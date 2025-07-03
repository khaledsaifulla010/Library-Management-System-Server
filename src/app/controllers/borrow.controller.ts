import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
export const borrowRoutes = express.Router();

// CREATE A BORROW //
borrowRoutes.post("/borrow", async (req: Request, res: Response) => {
  try {
    const { book, quantity, dueDate } = req.body;

    await (Book as any).adjustCopies(book, quantity);
    const borrowRecord = await Borrow.create({ book, quantity, dueDate });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to borrow book",
      error: (error as Error).message,
    });
  }
});
