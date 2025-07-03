import { Response } from "express";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { runAgentStream } from "./runAgentStream";
import { FirebaseAdminService } from "../services/firebaseAdmin";

interface StreamAgentParams {
  messages: ChatCompletionMessageParam[];
  aiMessageId: string;
  conversationId: string;
  res: Response;
}

export async function streamAgentResponse({
  messages,
  aiMessageId,
  conversationId,
  res,
}: StreamAgentParams): Promise<void> {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Cache-Control");

  let accumulatedText = "";

  try {
    for await (const chunk of runAgentStream(messages)) {
      if (chunk === "__thinking__" || chunk === "__calling_mcp__") {
        res.write(`data: ${chunk}\n\n`);
        continue;
      }

      accumulatedText += chunk;
      res.write(`data: ${chunk}\n\n`);
    }

    if (accumulatedText) {
      await FirebaseAdminService.updateMessageById(aiMessageId, {
        content: { text: accumulatedText, image: null },
        timestamp: new Date(),
      });

      await FirebaseAdminService.updateConversationLastMessage(conversationId, {
        text: accumulatedText.substring(0, 100) + (accumulatedText.length > 100 ? "..." : ""),
        senderId: "system",
      });
    }

    res.write(`data: [DONE]\n\n`);
  } catch (error) {
    console.error("❌ SSE streaming error:", error);
    res.write(`data: [ERROR]\n\n`);
  } finally {
    res.end();
  }
}
