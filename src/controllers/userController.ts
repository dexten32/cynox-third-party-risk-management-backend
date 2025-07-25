// src/controllers/userController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Get Pending Users
export const getPendingUsers = async (req: Request, res: Response) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: { verificationStatus: "PENDING" },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        role: true,
      },
    });
    res.json(pendingUsers);
  } catch (err) {
    console.error("Error fetching pending users:", err);
    res.status(500).json({ error: "Failed to fetch pending users" });
  }
};

// 2. Approve / Reject User Status
export const updateUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { verificationStatus: status },
    });
    res.json({ message: "User status updated" });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ error: "Failed to update user status" });
  }
};

// 3. Get Users by Role (Simple List)
export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.user.findMany({
      where: { role: "CLIENT", verificationStatus: "APPROVED" },
      select: { id: true, name: true, email: true },
    });

    const vendors = await prisma.user.findMany({
      where: { role: "VENDOR", verificationStatus: "APPROVED" },
      select: { id: true, name: true, email: true },
    });

    res.json({ clients, vendors });
  } catch (err) {
    console.error("Error fetching clients/vendors:", err);
    res.status(500).json({ error: "Failed to fetch clients/vendors" });
  }
};

// 4. Grouped Clients with Their Vendors
export const getUsersGrouped = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
        verificationStatus: "APPROVED",
      },
      include: {
        vendors: {
          where: {
            role: "VENDOR",
            verificationStatus: "APPROVED",
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ clients });
  } catch (err) {
    console.error("Error fetching grouped users:", err);
    res.status(500).json({ error: "Failed to fetch grouped users" });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        role: true,
        verificationStatus: true,
        // Add more fields if needed
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Server error while fetching user" });
  }
};
