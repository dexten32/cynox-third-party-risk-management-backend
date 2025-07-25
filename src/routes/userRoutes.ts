import express from "express";
import {
  getPendingUsers,
  updateUserStatus,
  getUsersByRole,
  getUserById,
} from "../controllers/userController";

const router = express.Router();

router.get("/pending", getPendingUsers);
router.patch("/:id/status", updateUserStatus);
router.get("/by-role", getUsersByRole);
router.get("/:id", getUserById);

export default router;
