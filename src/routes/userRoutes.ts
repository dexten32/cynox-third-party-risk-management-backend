import express from "express";
import {
  getPendingUsers,
  updateUserStatus,
  getUsersByRole,
} from "../controllers/userController";

const router = express.Router();

router.get("/pending", getPendingUsers);
router.patch("/:id/status", updateUserStatus);
router.get("/by-role", getUsersByRole);

export default router;
