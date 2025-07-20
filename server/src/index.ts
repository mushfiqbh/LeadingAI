import "dotenv/config";
import express from "express";
import cors from "cors";
import { getApps } from "firebase-admin/app";
import chatRouter from "./routes/chatRouter";
import fs from "fs";
import uploadRouter from "./routes/uploadRouter";
// Initialize Firebase Admin (this will run the initialization code)
import "./services/firebaseAdmin";

if (
  process.env.GCP_CREDENTIALS_JSON &&
  process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  fs.writeFileSync(
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    process.env.GCP_CREDENTIALS_JSON
  );
}

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
    version: "3.2.1",
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

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
