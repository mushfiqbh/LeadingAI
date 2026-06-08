import "dotenv/config";
import express from "express";
import cors from "cors";
import { getApps } from "firebase-admin/app";
import chatRouter from "./routes/chatRouter";
import fs from "fs";
import uploadRouter from "./routes/uploadRouter";
import driveRouter from "./routes/driveRouter";
import workerRouter from "./routes/workerRouter";
import { generateRoutineImage } from "./controllers/generateController";

// Write GCP credentials to file if provided in environment variables
if (process.env.GCP_CREDENTIALS_JSON && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
        fs.writeFileSync(
            process.env.GOOGLE_APPLICATION_CREDENTIALS,
            process.env.GCP_CREDENTIALS_JSON
        );
        console.log("✅ Credentials file written successfully");
    } catch (err) {
        console.error("❌ Failed to write credentials file", err);
        process.exit(1);
    }
}

async function initFirebaseAdmin() {
  await import("./services/firebaseAdmin");
}
initFirebaseAdmin();

// app config
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.status(200).json({
    live: true,
    version: "4.5.0",
    message: "Server is running",
  });
});

// Health check for Firebase
app.get("/health/firebase", async (req, res) => {
  try {
    // Check if Firebase is initialized by getting the app instance
    const apps = getApps();
    if (apps.length === 0) {
      throw new Error("Firebase app not initialized");
    }

    res.status(200).json({
      status: "success",
      firebase: "connected",
      message: "Firebase Admin SDK is working properly",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Firebase health check failed:", error);
    res.status(500).json({
      firebase: "error",
      message: "Firebase Admin SDK is not properly configured",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.use("/chat", chatRouter);
app.use("/upload", uploadRouter);
app.use("/drive", driveRouter);
app.use("/worker", workerRouter);
app.get("/generate", generateRoutineImage);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
