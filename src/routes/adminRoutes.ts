import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { requireCompany } from "../middlewares/requireCompany"; // renamed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/approve-user", verifyToken, requireCompany, async (req, res) => {
  const { userId } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: "APPROVED" },
    });

    res.json({ message: "User approved", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve user" });
  }
});

export default router;
