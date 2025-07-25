import express from "express";
import { uploadSubmission } from "../controllers/submissionControllers";
import { authenticate, authorizeRoles } from "../middlewares/auth";
import upload from "../middlewares/upload";

const router = express.Router();

router.post(
  "/upload",
  authenticate,
  authorizeRoles("VENDOR"),
  upload.single("file"),
  uploadSubmission
);

export default router;
