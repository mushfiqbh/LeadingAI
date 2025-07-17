import { FirebaseAdminService } from "../services/firebaseAdmin";

export async function getRoutine(
  category: string,
  batch: string,
  section?: string
): Promise<string[] | null> {
  try {
    const routines = await FirebaseAdminService.getRoutinesByCategory(category);

    if (!routines || routines.length === 0) {
      console.log(`No routines found for category: ${category}`);
      return null;
    }

    // Filter routines for schedules that match the batch and section
    const matchedContent: string[] = [];

    routines.forEach((routine) => {
      if (Array.isArray(routine.schedules)) {
        routine.schedules.forEach((schedule: any) => {
          if (
            String(schedule.batch) === String(batch) &&
            String(schedule.section).includes(String(section || "All Sections"))
          ) {
            if (schedule.content) {
              matchedContent.push(
                JSON.stringify({
                  batch: schedule.batch,
                  section: schedule.section,
                  times: routine.times,
                  schedule: schedule.content,
                })
              );
            }
          }
        });
      }
    });

    return matchedContent.length > 0 ? matchedContent : null;
  } catch (err: any) {
    console.error("Error in getRoutine:", err.message);
    return [];
  }
}
