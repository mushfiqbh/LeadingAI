import { Request, Response } from "express";
import { buildMessagesWithContext } from "../utils/messageBuilder";
import { streamAgentResponse } from "../utils/sse";
import { FirebaseAdminService } from "../services/firebaseAdmin";

export const chatController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { text, conversationId, userId, aiMessageId } = req.body;
  const image = req.file as Express.Multer.File | undefined;

  if (!conversationId || !userId || !aiMessageId) {
    res
      .status(400)
      .json({ error: "conversationId, userId, and aiMessageId are required" });
    return;
  }

  try {
    const conversation = await FirebaseAdminService.getConversationById(
      conversationId
    );
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    const conversationMessages =
      await FirebaseAdminService.getMessagesByConversationId(conversationId);

    const messages = buildMessagesWithContext({
      text,
      conversationMessages,
      image,
    });

    streamAgentResponse({
      messages,
      aiMessageId,
      conversationId,
      res,
    });
  } catch (error) {
    console.error("💥 Error in chatController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
