import { RoutineData } from "./../types/types";
import { Request, Response } from "express";
import { FirebaseAdminService } from "../services/firebaseAdmin";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import extractImageText from "../services/extractImageText";
import extractClassRoutineSheet from "../services/gsheet/extractClassSheet";
import extractExamRoutineSheet from "../services/gsheet/extractExamSheet";

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
  const { expiryDate, userId, userName } = req.body;
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
  const { routineId, sheetUrl, category } = req.body;

  try {
    if (!routineId) {
      res.status(400).json({ error: "Routine ID is required" });
      return;
    }

    // Extract the spreadsheet ID from the URL
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const match = sheetUrl.match(regex);
    if (!match) {
      throw new Error("Invalid Google Sheets URL");
    }
    const spreadsheetId = match[1];

    let data: RoutineData | null = {
      title: "",
      department: "",
      semester: "",
      timeSlots: [],
      schedules: [],
    };

    if (category === "class-routine") {
      data = await extractClassRoutineSheet(spreadsheetId);
    } else if (category === "exam-routine") {
      data = await extractExamRoutineSheet(spreadsheetId);
    }

    if (
      !data ||
      !data.title ||
      !data.department ||
      !data.semester ||
      data.schedules.length === 0
    ) {
      await FirebaseAdminService.deleteRoutine(routineId);

      res
        .status(400)
        .json({ error: "Invalid routine data extracted from sheet" });
      return;
    }

    await FirebaseAdminService.updateRoutine(routineId, {
      title: data.title,
      department: data.department,
      semester: data.semester,
      timeSlots: data.timeSlots,
      schedules: data.schedules,
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
