import openaiClient from "./openaiClient";
import { tools } from "../mcp/tools";
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from "openai/resources/index";
import { getResult } from "../mcp/resultMCP";
import { getUnifiedSystemPrompt, getNoticeSystemPrompt } from "./systemPrompt";
import { getNotice } from "../mcp/noticeMCP";
import { getRoutine, setRoutine } from "../mcp/routineMCP";
import { getLinks } from "../mcp/driveMCP";
import { countTokens } from "../utils/countTokens";
import { TiktokenModel } from "tiktoken";
import { FirebaseAdminService } from "../services/firebaseAdmin";
import { VectorStoreService } from "../services/vectorStoreService";

const MODEL = process.env.OPENROUTER_MODEL!;

export async function* runAgentStream(
  userId: string,
  messages: ChatCompletionMessageParam[],
  aiMessageId: string
) {
  yield "__thinking__";

  const uniqueSources = new Map<string, string>();

  let systemContent = getUnifiedSystemPrompt();
  const systemPrompt: ChatCompletionSystemMessageParam = {
    role: "system",
    content: systemContent,
  };

  const lastMessage = messages[messages.length - 1];
  const query = typeof lastMessage.content === "string" ? lastMessage.content : "";

  // === RAG: Retrieve relevant documents before tool check ===
  if (query) {
    try {
      const searchResults = await VectorStoreService.search(query);
      if (searchResults && searchResults.length > 0) {
        console.log("🔍 First search result keys:", searchResults[0] ? Object.keys(searchResults[0]) : "None");
        console.log("🔍 First search result metadata:", searchResults[0]?.metadata);

        const context = searchResults
          .map((res: any, index: number) => {
            const metadata = typeof res.metadata === "string" ? JSON.parse(res.metadata) : res.metadata;
            const driveId = metadata?.drive_file_id || res.drive_file_id;
            const sourceName = metadata?.source || res.file_name || "Unknown";
            
            const sourceLink = driveId ? `https://drive.google.com/file/d/${driveId}/view` : null;
            let chunkInfo = `Chunk ${index + 1}:\n${res.chunk_text}\nSource: ${sourceName}`;
            if (sourceLink) {
              chunkInfo += `\nLink: ${sourceLink}`;
            }
            return chunkInfo;
          })
          .join("\n\n");
        
        searchResults.forEach((res: any) => {
          const metadata = typeof res.metadata === "string" ? JSON.parse(res.metadata) : res.metadata;
          const driveId = metadata?.drive_file_id || res.drive_file_id;
          const name = metadata?.source || res.file_name;
          
          if (driveId && name) {
            uniqueSources.set(name, `https://drive.google.com/file/d/${driveId}/view`);
          }
        });

        console.log(`📡 RAG Context built with ${searchResults.length} chunks. Unique Sources: ${uniqueSources.size}`);

        systemContent += `\n\n### DOCUMENT CONTEXT:\n${context}\n\nINSTRUCTION: Use the above DOCUMENT CONTEXT to answer the user's question if relevant.`;
        systemPrompt.content = systemContent;
      }
    } catch (error) {
      console.error("Error during pre-retrieval search:", error);
    }
  }

  // === Check for tool usage ===
  const toolCheck = await openaiClient.chat.completions.create({
    model: MODEL,
    messages: [systemPrompt, ...messages],
    tools,
    tool_choice: "auto",
  });

  const choice = toolCheck.choices[0];
  const toolCall = choice?.message?.tool_calls?.[0];

  if (toolCall?.type === "function") {
    yield `__calling_${toolCall.function.name}_mcp__`;

    const args = JSON.parse(toolCall.function.arguments || "{}");

    let mcpResult;
    if (toolCall.function.name === "get_result") {
      mcpResult = await getResult(args.student_id, args.birthday);
    } else if (toolCall.function.name === "get_notice") {
      mcpResult = await getNotice();
      if (mcpResult) {
      systemContent += "\n\n" + getNoticeSystemPrompt();
      systemPrompt.content = systemContent;
      }
    } else if (toolCall.function.name === "get_routine") {
      mcpResult = await getRoutine(aiMessageId, args);
    } else if (toolCall.function.name === "set_routine") {
      mcpResult = await setRoutine(userId, args.sheet_url, args.category);
    } else if (toolCall.function.name === "get_links") {
      mcpResult = await getLinks();
    } else {
      console.warn(`⚠️ Unknown tool called: ${toolCall.function.name}`);
      mcpResult = { error: `Unknown tool: ${toolCall.function.name}` };
    }

    const toolMessages: ChatCompletionMessageParam[] = [
      systemPrompt,
      ...messages,
      {
        role: "assistant",
        tool_calls: [toolCall],
      },
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify({ result: mcpResult }),
      },
    ];

    // Remove final reminder as we are attaching sources by code

    const stream = await openaiClient.chat.completions.create({
      model: MODEL,
      messages: toolMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        yield delta;
      }
    }
  } else {
    // === No tool, direct stream ===
    const finalMessages: ChatCompletionMessageParam[] = [systemPrompt, ...messages];
    
    // Remove final reminder as we are attaching sources by code

    const stream = await openaiClient.chat.completions.create({
      model: MODEL,
      messages: finalMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        yield delta;
      }
    }
  }

  // === Attach Sources by Code ===
  if (uniqueSources.size > 0) {
    let sourcesMarkdown = "\n\n---\n**Sources:**\n";
    uniqueSources.forEach((link, name) => {
      sourcesMarkdown += `- [${name}](${link})\n`;
    });
    yield sourcesMarkdown;
  }

  // === Check token limits ===
  try {
    const totalTokenCount = countTokens(
      [systemPrompt, ...messages],
      "gpt-4.1-nano" as TiktokenModel
    );

    // Update user Credits in Firebase (don't await to avoid blocking stream)
    FirebaseAdminService.updateUserCredits({
      userId,
      usedCredits: Math.round(totalTokenCount / 100), // 1 credit per 100 tokens
    }).catch((error) => {
      console.error("Error updating user Credits:", error);
    });
  } catch (error) {
    console.error("Error counting Credits:", error);
  }
}
