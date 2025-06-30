import { Request, Response } from "express";
import { runAgentStream } from "../utils/runAgentStream";
import { ChatCompletionContentPart } from "openai/resources/index";
import { FirebaseAdminService } from "../services/firebaseAdmin";

export const chatController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("🎯 Chat controller called");

  const { text, conversationId, userId } = req.body;
  const image = req.file as Express.Multer.File | undefined;

  // Validate required fields
  if (!conversationId || !userId) {
    res.status(400).json({
      error: "conversationId and userId are required",
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

  let userMessageId: string | null = null;
  let aiMessageId: string | null = null;

  try {
    // 1. Create user message in Firebase
    userMessageId = await FirebaseAdminService.createMessage({
      role: "user",
      content: {
        text,
        image: image
          ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
          : null,
      },
      conversationId,
      senderId: userId,
    });

    // Add user message to conversation
    await FirebaseAdminService.addMessageToConversation(
      conversationId,
      userMessageId
    );

    // Update conversation lastMessage with user message
    await FirebaseAdminService.updateConversationLastMessage(conversationId, {
      text,
      senderId: userId,
    });

    // Send user message ID confirmation as JSON (keep this as JSON since it has data)
    res.write(
      `data: ${JSON.stringify({
        type: "message_ids",
        userMessageId: userMessageId,
      })}\n\n`
    );

    // 2. Stream AI response directly to client
    let accumulatedText = "";

    for await (const messageChunk of runAgentStream(content)) {
      // Handle special status messages - send as simple strings
      if (messageChunk === "__thinking__") {
        res.write(`data: __thinking__\n\n`);
        continue;
      }

      if (messageChunk === "__requesting_mcp__") {
        res.write(`data: __requesting_mcp__\n\n`);
        continue;
      }

      // Stream the actual text chunk as raw text
      accumulatedText += messageChunk;
      res.write(`data: ${messageChunk}\n\n`);
    }

    // 3. Create AI message in Firebase after completion
    if (accumulatedText) {
      aiMessageId = await FirebaseAdminService.createMessage({
        role: "assistant",
        content: {
          text: accumulatedText,
          image: null,
        },
        conversationId,
        senderId: "system",
        timestamp: new Date(),
      });

      // Add AI message to conversation
      await FirebaseAdminService.addMessageToConversation(
        conversationId,
        aiMessageId
      );

      // Update conversation lastMessage with AI response
      await FirebaseAdminService.updateConversationLastMessage(conversationId, {
        text:
          accumulatedText.substring(0, 100) +
          (accumulatedText.length > 100 ? "..." : ""),
        senderId: "system",
      });

      // Send completion with AI message ID as JSON (keep this as JSON since it has data)
      res.write(
        `data: ${JSON.stringify({
          type: "complete",
          aiMessageId: aiMessageId,
        })}\n\n`
      );
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
