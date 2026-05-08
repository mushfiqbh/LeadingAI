import { RoutineData, FlatSchedule } from "../../types/types";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { FirebaseAdminService } from "../firebaseAdmin";
import classRoutineImageCreator from "./classRoutineImageCreator";
import examRoutineImageCreator from "./examRoutineImageCreator";

export default async function routineCreatorWorker(
  category: string,
  schedule: FlatSchedule,
  routine: RoutineData,
  aiMessageId: string,
) {
  try {
    const FILENAME = `${schedule.batch}${
      schedule.section
    }-${category}-${routine.semester.replace("'", "")}`;

    if (schedule.imageUrl) {
      return await FirebaseAdminService.updateMessageById(aiMessageId, {
        "content.imageUrl": schedule.imageUrl,
        "content.filename": FILENAME,
      });
    }

    let imageUrl = "";

    if (category === "class-routine") {
      const buffer = classRoutineImageCreator({
        department: routine.department,
        semester: routine.semester,
        batch: Number(schedule.batch),
        section: schedule.section,
        timeSlots: routine.timeSlots,
        weeklySchedule: JSON.parse(schedule.content),
      });
      imageUrl = await uploadToCloudinary(buffer, "leadingai_routines");
    } else if (category === "exam-routine") {
      const buffer = examRoutineImageCreator({
        department: routine.department,
        semester: routine.semester,
        batch: Number(schedule.batch),
        timeSlots: routine.timeSlots,
        weeklySchedule: JSON.parse(schedule.content),
      });
      imageUrl = await uploadToCloudinary(buffer, "leadingai_routines");
    }

    if (imageUrl) {
      await FirebaseAdminService.updateMessageById(aiMessageId, {
        "content.imageUrl": imageUrl,
        "content.filename": FILENAME,
      });
    }

    if (imageUrl && routine.id) {
      await FirebaseAdminService.updateRoutine(routine.id, {
        schedules: routine.schedules.map((s) =>
          s.batch === schedule.batch && s.section === schedule.section
            ? { ...s, imageUrl }
            : s
        ),
      });
    } else {
      console.error("Failed to upload image to Cloudinary");
    }
  } catch (error) {
    console.error("Error in routineCreatorWorker:", error);
  }
}
