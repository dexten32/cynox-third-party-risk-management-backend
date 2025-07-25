import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import { parseDocxBuffer } from "../utils/parseDocx";
import prisma from "../../prisma/client";

interface CustomRequest extends Request {
  user?: { id: string; role: string }; // changed id to string
}

export const uploadSubmission = async (req: CustomRequest, res: Response) => {
  try {
    const file = req.file;
    const { vendorId } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!vendorId) {
      return res.status(400).json({ message: "Missing vendor ID" });
    }

    // Ensure vendor exists
    const vendor = await prisma.user.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw" },
      async (error, result) => {
        if (error || !result) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ error: "Upload failed" });
        }

        const summary = await parseDocxBuffer(file.buffer);

        const submission = await prisma.summary.create({
          data: {
            originalFileUrl: result.secure_url,
            vendorId,
            parsedContent: summary,
          },
        });

        return res.json({ submission });
      }
    );

    stream.end(file.buffer);
  } catch (err: any) {
    console.error("Upload Submission Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
