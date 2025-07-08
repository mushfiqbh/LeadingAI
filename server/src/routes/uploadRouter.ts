import express from "express";
import multer from "multer";
import { createNotice } from "../controllers/uploadController";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use the production chat controller
// uploadRouter.post("/sheet", );
uploadRouter.post("/notice", upload.single("image"), createNotice);

export default uploadRouter;
