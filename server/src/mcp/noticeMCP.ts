import { FirebaseAdminService } from "../services/firebaseAdmin";

interface Notice {
  image_url: string;
  description: string;
  expire_date: string | null;
}

export async function getNotice(): Promise<Notice[] | null> {
  try {
    return await FirebaseAdminService.getNoticesInformation(10);
  } catch (err: any) {
    console.error("Error in get_notice:", err.message);
    return [];
  }
}
