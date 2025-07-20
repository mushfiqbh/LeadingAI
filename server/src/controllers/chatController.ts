import { Request, Response } from "express";
import { buildMessagesWithContext } from "../openai/messageBuilder";
import { streamAgentResponse } from "../openai/sse";
import { FirebaseAdminService } from "../services/firebaseAdmin";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

export const chatController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { text, conversationId, userId, userMessageId, aiMessageId } = req.body;
  const image = req.file as Express.Multer.File | undefined;

  if (!conversationId || !userId || !aiMessageId) {
    res
      .status(400)
      .json({ error: "conversationId, userId, and aiMessageId are required" });
    return;
  }

  if (image) {
    await FirebaseAdminService.updateMessageById(userMessageId, {
      content: {
        uploadStatus: "sent",
      },
    });
  }

  try {
    // Get user profile for context
    let userProfile: {
      uid: string;
      totalCredits?: number;
      usedCredits?: number;
    } | null = null;
    try {
      userProfile = await FirebaseAdminService.getUserProfile(userId);

      const creditsBalance =
        Number(userProfile?.totalCredits) - Number(userProfile?.usedCredits);

      if (creditsBalance <= 0) {
        res.status(403).json({ error: "Insufficient credits" });
        return;
      }
    } catch (error) {
      console.log("User profile not found, continuing without profile context");
    }

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
      userProfile,
    });

    // Prepare image upload callback to run after AI response completion
    const onComplete = async () => {
      if (image && userMessageId) {
        try {
          console.log(
            "🔄 Starting image upload after AI response completion..."
          );
          const image_url = await uploadToCloudinary(
            image.buffer,
            "leadingai_chat_images"
          );

          if (image_url) {
            await FirebaseAdminService.updateMessageById(userMessageId, {
              content: {
                text,
                imageUrl: image_url,
                uploadStatus: "done",
              },
            });
            console.log("✅ Image uploaded and message updated successfully");
          } else {
            console.error("❌ Failed to upload image to Cloudinary");
          }
        } catch (error) {
          console.error("❌ Error uploading image:", error);
        }
      }
    };

    // Start AI response streaming with completion callback
    streamAgentResponse({
      userId,
      messages,
      aiMessageId,
      conversationId,
      onComplete,
      res,
    });
  } catch (error) {
    console.error("💥 Error in chatController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
