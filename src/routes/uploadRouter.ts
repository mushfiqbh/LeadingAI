import express from "express";
import multer from "multer";
import { createNotice, createRoutine } from "../controllers/uploadController";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use the production chat controller
uploadRouter.post("/notice", upload.single("image"), createNotice);
uploadRouter.post("/routine", createRoutine);

export default uploadRouter;
