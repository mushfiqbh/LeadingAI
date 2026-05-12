import "dotenv/config";
import { DriveDownloadService } from "../services/driveDownloadService";

async function testSync() {
  console.log("🚀 Starting Drive Sync Test...");
  try {
    const result = await DriveDownloadService.downloadFilesFromFolder();
    console.log("✅ Sync Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Sync Test Failed:", error);
  }
}

testSync();
