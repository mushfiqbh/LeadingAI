import { FirebaseAdminService } from "../services/firebaseAdmin";

export async function getNotice(category: string): Promise<string[] | null> {
  try {
    return await FirebaseAdminService.getNoticesInformation(category);
  } catch (err: any) {
    console.error("Error in get_notice:", err.message);
    return [];
  }
}
