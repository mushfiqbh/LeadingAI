import { google } from "googleapis";
import { supabase } from "./supabaseClient";
import fs from "fs";
import path from "path";
import { VectorStoreService } from "./vectorStoreService";

/**
 * Service to handle Google Drive file operations and Supabase synchronization
 */
export class DriveDownloadService {
  private static auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  /**
   * Downloads files from a specific Google Drive folder and saves metadata to Supabase
   */
  static async downloadFilesFromFolder() {
    try {
      const drive = google.drive({ version: "v3", auth: this.auth });
      const folderId = process.env.DRIVE_FOLDER_ID;

      if (!folderId) {
        throw new Error("DRIVE_FOLDER_ID is not defined in environment variables");
      }

      console.log(`📂 Starting download from folder: ${folderId}`);

      // Get files inside folder
      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: "files(id, name, mimeType, createdTime, size, modifiedTime, md5Checksum)",
      });

      const files = res.data.files;

      if (!files || !files.length) {
        console.log("Empty folder. No files found.");
        return { success: true, count: 0 };
      }

      const downloadDir = path.join(process.cwd(), "downloads");

      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      const results = [];

      for (const file of files) {
        if (!file.id || !file.name) continue;

        // Check if file already exists in Supabase and compare modified time or checksum
        const { data: existingDoc, error: fetchError } = await supabase
          .from("documents")
          .select("id, modified_time, checksum")
          .eq("drive_file_id", file.id)
          .maybeSingle();

        if (fetchError) {
          console.error(`Error fetching document from Supabase: ${fetchError.message}`);
        }

        // If file exists and hasn't changed (both checksum and modified_time match), skip
        const isUnchanged = existingDoc && 
          existingDoc.checksum === (file as any).md5Checksum && 
          existingDoc.modified_time === (file as any).modifiedTime;

        if (isUnchanged) {
          console.log(`⏩ Skipping unchanged file: ${file.name}`);
          continue;
        }

        const filePath = path.join(downloadDir, file.name);
        console.log(`Downloading: ${file.name} (${file.id})`);

        const dest = fs.createWriteStream(filePath);

        try {
          const response = await drive.files.get(
            {
              fileId: file.id,
              alt: "media",
            },
            {
              responseType: "stream",
            }
          );

          await new Promise<void>((resolve, reject) => {
            (response.data as any)
              .on("end", () => {
                console.log(`✅ Downloaded: ${file.name}`);
                resolve();
              })
              .on("error", (err: any) => {
                console.error(`❌ Error downloading ${file.name}:`, err);
                reject(err);
              })
              .pipe(dest);
          });

          // Process file for vector store (Extract, Chunk, Embed, Store)
          await VectorStoreService.processFile(filePath, {
            drive_file_id: file.id,
            file_name: file.name,
            mime_type: file.mimeType || "application/octet-stream",
            checksum: (file as any).md5Checksum,
            modified_time: (file as any).modifiedTime,
          });

          results.push({ name: file.name, status: "indexed" });

        } catch (fileError) {
          console.error(`Failed to process file ${file.name}:`, fileError);
        } finally {
          // Delete local file after processing (even if it failed, to keep storage clean)
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`🗑️ Deleted local file: ${file.name}`);
            } catch (unlinkError) {
              console.error(`⚠️ Failed to delete local file ${file.name}:`, unlinkError);
            }
          }
        }
      }

      await this.cleanupRemovedFiles(files.map(f => f.id).filter(Boolean) as string[]);

      return { success: true, count: results.length, files: results };
    } catch (error) {
      console.error("💥 Error in downloadFilesFromFolder:", error);
      throw error;
    }
  }

  /**
   * Deletes documents and chunks from Supabase if they are no longer in Google Drive
   */
  private static async cleanupRemovedFiles(currentDriveIds: string[]) {
    try {
      console.log("🧹 Checking for removed files to cleanup...");
      
      // Get all stored drive_file_ids and internal IDs
      const { data: storedFiles, error } = await supabase
        .from("documents")
        .select("id, drive_file_id, file_name");

      if (error) throw error;

      const docsToDelete = storedFiles?.filter(f => !currentDriveIds.includes(f.drive_file_id)) || [];
      const internalIdsToDelete = docsToDelete.map(f => f.id);
      const driveIdsToDelete = docsToDelete.map(f => f.drive_file_id);

      if (driveIdsToDelete.length > 0) {
        console.log(`🗑️ Deleting ${driveIdsToDelete.length} removed files from Supabase...`);
        
        // 1. Delete associated chunks first (manual cascade if DB doesn't handle it)
        const { error: chunkDeleteError } = await supabase
          .from("document_chunks")
          .delete()
          .in("document_id", internalIdsToDelete);
        
        if (chunkDeleteError) {
          console.warn(`⚠️ Warning: Error deleting chunks: ${chunkDeleteError.message}`);
        }

        // 2. Delete the documents
        const { error: deleteError } = await supabase
          .from("documents")
          .delete()
          .in("drive_file_id", driveIdsToDelete);

        if (deleteError) throw deleteError;
        console.log("✅ Cleanup complete.");
      } else {
        console.log("✨ No files to cleanup.");
      }
    } catch (error) {
      console.error("❌ Cleanup failed:", error);
    }
  }
}

