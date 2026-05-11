import { Router } from "express";
import { DriveDownloadService } from "../services/driveDownloadService";

const driveRouter = Router();

/**
 * Endpoint to trigger manual sync from Google Drive
 * GET /drive/sync
 */
driveRouter.get("/sync", async (req, res) => {
  try {
    const result = await DriveDownloadService.downloadFilesFromFolder();
    res.status(200).json({
      status: "success",
      message: "Sync completed",
      data: result,
    });
  } catch (error) {
    console.error("Drive sync route error:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

export default driveRouter;
