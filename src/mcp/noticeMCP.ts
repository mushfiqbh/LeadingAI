import { FirebaseAdminService } from "../services/firebaseAdmin";

export async function getNotice() {
  try {
    return await FirebaseAdminService.getNoticesInformation();
  } catch (err: any) {
    console.error("Error in get_notice:", err.message);
    return [];
  }
}
