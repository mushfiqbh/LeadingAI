import { Request, Response } from "express";
import { runAgentStream } from "../utils/runAgentStream";
import { ChatCompletionContentPart } from "openai/resources/index";
import { FirebaseAdminService } from "../services/firebaseAdmin";

export const chatController = async (req: Request, res: Response): Promise<void> => {
  // Chat controller called

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

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

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

    // 2. Create initial empty AI message in Firebase
    aiMessageId = await FirebaseAdminService.createMessage({
      role: "assistant",
      content: {
        text: "",
        image: null,
      },
      conversationId,
      senderId: "system",
    });

    // Add AI message to conversation
    await FirebaseAdminService.addMessageToConversation(
      conversationId,
      aiMessageId
    );

    // Send message IDs to frontend for reference (optional)
    res.write(
      `data: {"type": "message_ids", "userMessageId": "${userMessageId}", "aiMessageId": "${aiMessageId}"}\n\n`
    );

    // 3. Stream AI response and update Firebase in real-time
    let accumulatedText = "";
    let updateCount = 0;
    const UPDATE_FREQUENCY = 3; // Update Firebase every 3 chunks

    for await (const messageChunk of runAgentStream(content)) {
      // Send chunk to frontend for immediate display (optional - frontend can rely on Firebase listeners)
      res.write(`data: ${messageChunk}\n\n`);

      // Handle special status messages
      if (
        messageChunk === "__thinking__" ||
        messageChunk === "__requesting_mcp__"
      ) {
        continue;
      }

      // Accumulate actual text content
      accumulatedText += messageChunk;
      updateCount++;

      // Update Firebase periodically and on final chunk
      if (updateCount % UPDATE_FREQUENCY === 0) {
        try {
          await FirebaseAdminService.updateMessageById(aiMessageId, {
            content: {
              text: accumulatedText,
              image: null,
            },
          });
        } catch (updateError) {
          // Continue streaming even if update fails
        }
      }
    }

    // 4. Final update to Firebase with complete message
    if (accumulatedText) {
      await FirebaseAdminService.updateMessageById(aiMessageId, {
        content: {
          text: accumulatedText,
          image: null,
        },
      });

      // Update conversation lastMessage with AI response
      await FirebaseAdminService.updateConversationLastMessage(conversationId, {
        text:
          accumulatedText.substring(0, 100) +
          (accumulatedText.length > 100 ? "..." : ""),
        senderId: "system",
      });
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.error("Error in chat controller:", err);
    
    // Check if the error is Firebase-related
    if (err instanceof Error) {
      console.error("Error details:", err.message);
      if (err.message.includes("credential") || err.message.includes("authentication")) {
        console.error("Firebase credentials issue detected. Please check your Firebase Admin setup.");
      }
    }
    
    res.write(`data: [ERROR]\n\n`);
    res.end();
  }
};
