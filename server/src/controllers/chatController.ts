import { Request, Response } from "express";
import { runAgentStream } from "../utils/runAgentStream";
import { ChatCompletionContentPart } from "openai/resources/index";
import { FirebaseAdminService } from "../services/firebaseAdmin";

export const chatController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("🎯 Chat controller called");

  const { text, conversationId, userId, aiMessageId } = req.body;
  const image = req.file as Express.Multer.File | undefined;

  // Validate required fields
  if (!conversationId || !userId || !aiMessageId) {
    res.status(400).json({
      error: "conversationId, userId, and aiMessageId are required",
    });
    return;
  }

  // Verify conversation exists
  try {
    const conversation = await FirebaseAdminService.getConversationById(
      conversationId
    );
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
  } catch (error) {
    console.error("Error verifying conversation:", error);
    res.status(500).json({ error: "Failed to verify conversation" });
    return;
  }

  const content: ChatCompletionContentPart[] = [{ type: "text", text }];

  if (image) {
    const base64 = image.buffer.toString("base64");
    const mimeType = image.mimetype;
    content.push({
      type: "image_url",
      image_url: {
        url: `data:${mimeType};base64,${base64}`,
      },
    });
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Cache-Control");

  try {
    // Frontend already created user and empty AI messages
    // Backend only handles streaming AI response

    // 1. Stream AI response directly to client
    let accumulatedText = "";

    for await (const messageChunk of runAgentStream(content)) {
      // Handle special status messages - send as simple strings
      if (messageChunk === "__thinking__") {
        res.write(`data: __thinking__\n\n`);
        continue;
      }

      if (messageChunk === "__calling_mcp__") {
        res.write(`data: __calling_mcp__\n\n`);
        continue;
      }

      // Stream the actual text chunk as raw text
      accumulatedText += messageChunk;
      res.write(`data: ${messageChunk}\n\n`);
    }

    // 2. Update the existing AI message in Firebase with the complete response
    if (accumulatedText) {
      await FirebaseAdminService.updateMessageById(aiMessageId, {
        content: {
          text: accumulatedText,
          image: null,
        },
        timestamp: new Date(),
      });

      // Update conversation lastMessage with AI response
      await FirebaseAdminService.updateConversationLastMessage(conversationId, {
        text:
          accumulatedText.substring(0, 100) +
          (accumulatedText.length > 100 ? "..." : ""),
        senderId: "system",
      });
    }

    // Send simple completion signal
    res.write(`data: [DONE]\n\n`);
  } catch (err) {
    console.error("💥 Error in chat controller:", err);

    // Send simple error signal
    res.write(`data: [ERROR]\n\n`);
  } finally {
    // Always end the response
    res.end();
  }
};
