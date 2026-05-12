import express from "express";
import multer from "multer";
import { chatController } from "../controllers/chatController";

const chatRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use the production chat controller
chatRouter.post("/", upload.single("image"), chatController);

export default chatRouter;
