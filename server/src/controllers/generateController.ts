import { Request, Response } from "express";
import refineDepartmentName from "../utils/refineDepartmentName";
import { RoutineImageService } from "../services/routineImageService";

export const generateRoutineImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, department, batch, section } = req.body;

    if (!department || !batch) {
      res.status(400).json({
        message: "Department and Batch are required.",
      });
      return;
    }

    if (category === "class-routine" && !section) {
      res.status(400).json({
        message: "Section is required for class routines.",
      });
      return;
    }

    const refinedDept = refineDepartmentName(department);

    const result = await RoutineImageService.generateRoutineImage({
      category,
      refinedDept,
      batch,
      section,
    });

    res.status(200).json({
      imageUrl: result.imageUrl,
      cached: result.cached,
    });
    return;
  } catch (err: any) {
    const map: Record<string, number> = {
      ROUTINE_NOT_FOUND: 404,
      SCHEDULE_NOT_FOUND: 404,
      INVALID_SCHEDULE_FORMAT: 500,
      UPLOAD_FAILED: 500,
    };

    const status = map[err.message] || 500;

    res.status(status).json({
      message: err.message,
    });
  }
};
