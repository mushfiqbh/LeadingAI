import { FirebaseAdminService } from "../services/firebaseAdmin";

export async function getRoutine(category: string): Promise<string[] | null> {
  try {
    return await FirebaseAdminService.getAllRoutinesByCategory(category);
  } catch (err: any) {
    console.error("Error in get_notice:", err.message);
    return [];
  }
}
