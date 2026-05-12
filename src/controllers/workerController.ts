import { Request, Response } from "express";
import { DriveDownloadService } from "../services/driveDownloadService";

/**
 * Worker job to be triggered by a cron service.
 * This can handle background tasks like cleaning up old data, 
 * sending notifications, or processing queue items.
 */
export const workerJobController = async (req: Request, res: Response): Promise<void> => {
  // Security check: Ensure the request comes from the cron service
  const cronSecret = req.headers["x-cron-secret"];
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && cronSecret !== expectedSecret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    console.log("Starting worker job at:", new Date().toISOString());

    // Sync Google Drive files to Vector Store
    console.log("🔄 Syncing Google Drive to Vector Store...");
    const syncResult = await DriveDownloadService.downloadFilesFromFolder();
    console.log("✅ Sync completed:", syncResult);

    console.log("Worker job completed successfully");
    
    res.status(200).json({
      success: true,
      message: "Worker job executed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Worker job failed:", error);
    res.status(500).json({
      success: false,
      message: "Worker job failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
