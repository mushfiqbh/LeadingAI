import { Request, Response } from "express";
import { FirebaseAdminService } from "../services/firebaseAdmin";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import extractImageText from "../services/extractImageText";
import extractGoogleSheet from "../services/extractGoogleSheet";

function resolveExpirationDate(expiryDate?: string): string | null {
  if (expiryDate && expiryDate.trim() !== "") {
    return expiryDate; // Use provided date
  }
  return new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000).toISOString();
}

export const createNotice = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category, expiryDate, userId, userName } = req.body;
  const image = req.file as Express.Multer.File | undefined;

  try {
    if (image) {
      // Extract text from the image
      const extracted = await extractImageText(image);

      if (!extracted) {
        res.status(400).json({ error: "Failed to extract text from image" });
        return;
      }

      const { title, information } = extracted;

      // Upload the image to Cloudinary
      const imageUrl = await uploadToCloudinary(
        image.buffer,
        "leadingai_notices"
      );

      if (!imageUrl) {
        res.status(500).json({ error: "Failed to upload image" });
        return;
      }

      // Create the notice object
      const noticeData: any = {
        category: category || "general",
        title,
        imageUrl,
        information,
        contributor: {
          uid: userId || "Anonymous",
          name: userName || "Anonymous",
        },
        expiryDate: resolveExpirationDate(expiryDate),
      };

      const noticeId = await FirebaseAdminService.createNotice(noticeData);
      res.status(201).json({
        success: true,
        message: "Notice created successfully",
        noticeId,
      });
    } else {
      res.status(400).json({ error: "Image file is required" });
    }
  } catch (error) {
    console.error("💥 Error in createNotice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createRoutine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { routineId, routineUrl, category } = req.body;

  try {
    if (!routineId) {
      res.status(400).json({ error: "Routine ID is required" });
      return;
    }

    const content = await extractGoogleSheet(routineUrl, category);

    await FirebaseAdminService.updateRoutine(routineId, {
      content,
    });

    res.status(200).json({
      success: true,
      message: "Routine creation initiated",
    });
  } catch (error) {
    console.error("💥 Error in createRoutine:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
