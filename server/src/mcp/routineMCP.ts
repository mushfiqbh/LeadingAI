import routineCreatorWorker from "../services/creator/routineCreatorWorker";
import { FirebaseAdminService } from "../services/firebaseAdmin";
import { FlatSchedule } from "../types/types";
import refineDepartmentName from "../utils/refineDepartmentName";

export async function getRoutine(
  aiMessageId: string,
  category: string,
  department: string,
  batch: string,
  section?: string
): Promise<string> {
  try {
    const refinedDept = refineDepartmentName(department);

    const routine = await FirebaseAdminService.getRoutineByCategory(
      category,
      refinedDept
    );

    if (!routine?.schedules) {
      return "Routine not found. Please contribute to add new routines.";
    }

    const schedule = routine.schedules.find(
      (s: FlatSchedule) =>
        s.batch === batch && (section ? s.section.includes(section) : true)
    );

    if (schedule) {
      // Don't wait for the worker to finish. Let it run in the background.
      routineCreatorWorker(category, aiMessageId, schedule, routine);
      return "Your routine image is being created and will be sent with the response.";
    }

    return "No matching routine found for the specified batch and section.";
  } catch (err: any) {
    console.error("Error in getRoutine:", err.message);
    return "Error fetching routine data.";
  }
}
