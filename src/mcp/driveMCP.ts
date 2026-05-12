import { FirebaseAdminService } from "../services/firebaseAdmin";

export async function getLinks() {
  try {
    const links = await FirebaseAdminService.getLinks();
    console.log(links);

    return links;
  } catch (error: any) {
    console.error("Error retrieving Google Drive links:", error);
    return { error: "Failed to retrieve Google Drive links." };
  }
}
