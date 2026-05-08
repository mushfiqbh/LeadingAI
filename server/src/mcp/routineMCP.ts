import routineCreatorWorker from "../services/creator/routineCreatorWorker";
import { FirebaseAdminService } from "../services/firebaseAdmin";
import extractClassRoutineSheet from "../services/gsheet/extractClassSheet";
import extractExamRoutineSheet from "../services/gsheet/extractExamSheet";
import { FlatSchedule, RoutineData } from "../types/types";
import refineDepartmentName from "../utils/refineDepartmentName";

export async function getRoutine(
  aiMessageId: string,
  args: {
    category: string;
    department: string;
    batch: string;
    section?: string;
  }
): Promise<string> {
  try {
    const { category, department, batch, section } = args;

    const refinedDept = refineDepartmentName(department);

    const routine = await FirebaseAdminService.getRoutineByCategory(
      category,
      refinedDept
    );

    if (!routine?.schedules) {
      return "Routine not found. Please contribute to add new routines.";
    }

    if (!department) {
      return "Department is required to fetch the routine.";
    }

    if (!batch) {
      return "Batch is required to fetch the routine.";
    }

    if (!section && category === "class-routine") {
      return "Section is required for class routines.";
    }

    const schedule = routine?.schedules?.find(
      (s: FlatSchedule) =>
        s.batch === batch.toString() &&
        (category === "class-routine" && section
          ? s.section.includes(section.toUpperCase())
          : true)
    );

    if (schedule) {
      // Don't wait for the worker to finish. Let it run in the background.
      routineCreatorWorker(category, schedule, routine, aiMessageId);
      return "Your routine image is being created and will be sent with the response.";
    }

    return "No matching routine found for the specified batch and section.";
  } catch (err: any) {
    console.error("Error in getRoutine:", err.message);
    return "Error fetching routine data.";
  }
}

export const setRoutine = async (
  userId: string,
  sheetUrl: string,
  category: string
) => {
  try {
    if (!sheetUrl) {
      throw new Error("Sheet URL is required");
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

    if (!data) {
      return "Error extracting routine data";
    }

    await FirebaseAdminService.createRoutine(userId, {
      title: data.title,
      department: data.department,
      semester: data.semester,
      timeSlots: data.timeSlots,
      schedules: data.schedules,
      sheetUrl: sheetUrl,
      category,
      expiryDate: new Date("2099-12-31").toISOString(),
    });

    return "Routine created successfully";
  } catch {
    return "Error creating routine";
  }
};
