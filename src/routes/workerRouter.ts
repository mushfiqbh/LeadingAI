import { Router } from "express";
import { workerJobController } from "../controllers/workerController";

const router = Router();

// Endpoint for cron-job-as-a-service to trigger the worker
router.get("/run", (req, res, next) => {
  workerJobController(req, res).catch(next);
});
router.post("/run", (req, res, next) => {
  workerJobController(req, res).catch(next);
});

export default router;
