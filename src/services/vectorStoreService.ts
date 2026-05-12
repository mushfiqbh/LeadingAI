import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const pdf = require("pdf-parse");
import mammoth from "mammoth";
import openaiClient from "../openai/openaiClient";
import { supabase } from "./supabaseClient";
import fs from "fs";

/**
 * Extracts course code from filename (e.g., CSE101, ENG 202)
 */
function extractCourseCode(filename: string): string | null {
  const pattern = /([A-Z]{2,4}\s?\d{3,4})/i;
  const match = filename.match(pattern);
  return match ? match[1].toUpperCase().replace(/\s/g, "") : null;
}

export class VectorStoreService {
  /**
   * Processes a file: extracts text, chunks it, embeds chunks, and stores in Supabase
   */
  static async processFile(filePath: string, fileMetadata: { 
    drive_file_id: string; 
    file_name: string; 
    mime_type: string;
    checksum?: string;
    modified_time?: string;
  }) {
    console.log(`📄 Processing file for vector store: ${fileMetadata.file_name}`);

    try {
      const buffer = fs.readFileSync(filePath);
      let text = "";

      // Step 1: Extract Text
      if (fileMetadata.mime_type === "application/pdf") {
        const { PDFParse } = pdf;
        if (!PDFParse) {
           throw new Error("PDFParse class not found in pdf-parse module. Check version.");
        }
        const parser = new PDFParse({ data: buffer });
        try {
          const result = await parser.getText();
          text = result.text;
        } finally {
          await parser.destroy();
        }
      } else if (
        fileMetadata.mime_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileMetadata.file_name.endsWith(".docx")
      ) {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } else if (fileMetadata.mime_type === "text/plain" || fileMetadata.file_name.endsWith(".txt")) {
        text = buffer.toString("utf-8");
      } else {
        console.warn(`⚠️ Unsupported mime type: ${fileMetadata.mime_type} for file ${fileMetadata.file_name}`);
        return;
      }

      if (!text || text.trim().length === 0) {
        console.warn(`⚠️ No text extracted from ${fileMetadata.file_name}`);
        return;
      }

      // Step 2: Upsert Document Metadata
      const course_code = extractCourseCode(fileMetadata.file_name);

      const { data: document, error: docError } = await supabase
        .from("documents")
        .upsert(
          {
            drive_file_id: fileMetadata.drive_file_id,
            file_name: fileMetadata.file_name,
            mime_type: fileMetadata.mime_type,
            checksum: fileMetadata.checksum,
            modified_time: fileMetadata.modified_time,
            course_code: course_code,
            indexed_at: new Date().toISOString(),
          },
          { onConflict: "drive_file_id" }
        )
        .select()
        .single();

      if (docError) {
        throw new Error(`Error upserting document: ${docError.message}`);
      }

      const document_id = document.id;

      // Step 3: Chunk Text
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const chunks = await splitter.splitText(text);
      console.log(`✂️ Split ${fileMetadata.file_name} into ${chunks.length} chunks`);

      // Step 4: Generate Embeddings (Batched)
      // Delete old chunks if any (to avoid duplicates on re-index)
      await supabase.from("document_chunks").delete().eq("document_id", document_id);

      console.log(`🧠 Generating embeddings for ${chunks.length} chunks (batched)...`);
      
      const embeddingResponse = await openaiClient.embeddings.create({
        model: "text-embedding-3-small",
        input: chunks,
      });

      const chunkRecords = chunks.map((chunk, i) => ({
        document_id,
        chunk_index: i,
        chunk_text: chunk,
        embedding: embeddingResponse.data[i].embedding,
        metadata: {
          source: fileMetadata.file_name,
          drive_file_id: fileMetadata.drive_file_id,
          page: 1,
        },
      }));

      // Insert all chunks in one request
      const { error: chunkError } = await supabase.from("document_chunks").insert(chunkRecords);

      if (chunkError) {
        throw new Error(`❌ Error inserting chunks: ${chunkError.message}`);
      }

      console.log(`✅ Successfully indexed ${fileMetadata.file_name}`);
    } catch (error) {
      console.error(`💥 Failed to process file ${fileMetadata.file_name}:`, error);
      throw error;
    }
  }

  /**
   * Searches for relevant document chunks using vector similarity
   */
  static async search(query: string, matchCount: number = 5) {
    try {
      console.log(`🔍 Searching for: "${query}"`);
      
      // 1. Generate query embedding
      const response = await openaiClient.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
      });
      const embedding = response.data[0].embedding;

      // 2. Call SQL function match_documents
      const { data, error } = await supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_count: matchCount,
      });

      if (error) {
        throw new Error(`Error searching vectors: ${error.message}`);
      }

      console.log(`🎯 Found ${data?.length || 0} matching chunks`);
      return data;
    } catch (error) {
      console.error("💥 Vector search failed:", error);
      throw error;
    }
  }
}
