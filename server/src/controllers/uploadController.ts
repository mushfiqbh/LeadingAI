import { Request, Response } from "express";
import { FirebaseAdminService } from "../services/firebaseAdmin";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import extractImageText from "../services/extractImageText";

export const createNotice = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { expire_date, user_id, user_name } = req.body;
  const image = req.file as Express.Multer.File | undefined;

  if (!expire_date) {
    res.status(400).json({ error: "expire date is required" });
    return;
  }

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
      const image_url = await uploadToCloudinary(
        image.buffer,
        "leadingai_notices"
      );

      if (!image_url) {
        res.status(500).json({ error: "Failed to upload image" });
        return;
      }

      // Create the notice object
      const noticeData = {
        title,
        image_url,
        information,
        expire_date,
        contributor: {
          uid: user_id || "Anonymous",
          fullName: user_name || "Anonymous",
        },
      };

      const noticeId = await FirebaseAdminService.createNotice(noticeData);
      res.status(201).json({ noticeId, noticeData });
    } else {
      res.status(400).json({ error: "Image file is required" });
    }
  } catch (error) {
    console.error("💥 Error in chatController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
