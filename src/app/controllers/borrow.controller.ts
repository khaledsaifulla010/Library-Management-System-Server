import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
import { globalError } from "../../utils/globalError";
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
    const formatted = globalError(error);
    res.status(400).json(formatted);
  }
});

// GET ALL BORROW BOOK SUMMARY //
borrowRoutes.get("/borrow", async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(400).json(formatted);
  }
});
