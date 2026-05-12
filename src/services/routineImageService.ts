import { FlatSchedule } from "../types/types";
import { FirebaseAdminService } from "./firebaseAdmin";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import examRoutineImageCreator from "./creator/examRoutineImageCreator";
import classRoutineImageCreator from "./creator/classRoutineImageCreator";

type GenerateParams = {
  category: string;
  refinedDept: string;
  batch: string | number;
  section?: string;
};

export class RoutineImageService {
  static async generateRoutineImage({
    category,
    refinedDept,
    batch,
    section,
  }: GenerateParams) {
    const routine = await FirebaseAdminService.getRoutineByCategory(
      category,
      refinedDept
    );

    if (!routine?.schedules?.length) {
      throw new Error("ROUTINE_NOT_FOUND");
    }

    const schedule = routine.schedules.find((s: FlatSchedule) => {
      const batchMatch = s.batch === String(batch);

      const sectionMatch =
        category === "class-routine" && section
          ? s.section?.includes(section.toUpperCase())
          : true;

      return batchMatch && sectionMatch;
    });

    if (!schedule) {
      throw new Error("SCHEDULE_NOT_FOUND");
    }

    // ✅ Skip regeneration if image already exists
    if (schedule.imageUrl) {
      return { imageUrl: schedule.imageUrl, cached: true };
    }

    let weeklySchedule;
    try {
      weeklySchedule = JSON.parse(schedule.content);
    } catch {
      throw new Error("INVALID_SCHEDULE_FORMAT");
    }

    const creator =
      category === "class-routine"
        ? classRoutineImageCreator
        : examRoutineImageCreator;

    const buffer = creator({
      department: routine.department,
      semester: routine.semester,
      batch: Number(schedule.batch),
      section: schedule.section,
      timeSlots: routine.timeSlots,
      weeklySchedule,
    });

    const imageUrl = await uploadToCloudinary(
      buffer,
      "leadingai_routines"
    );

    if (!imageUrl || !routine.id) {
      throw new Error("UPLOAD_FAILED");
    }

    // Save URL
    await FirebaseAdminService.updateRoutine(routine.id, {
      schedules: routine.schedules.map((s) =>
        s.batch === schedule.batch && s.section === schedule.section
          ? { ...s, imageUrl }
          : s
      ),
    });

    return { imageUrl, cached: false };
  }
}
