import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
import { globalError } from "../../utils/globalError";

export const borrowRoutes = express.Router();

// CREATE A BORROW
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
    res.status(formatted.statusCode).json(formatted);
  }
});

// LIST BORROWS (pagination)
borrowRoutes.get("/borrows", async (req: Request, res: Response) => {
  try {
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      Borrow.find()
        .populate({
          path: "book",
          select: "title isbn author genre copies available",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Borrow.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: "Borrows retrieved successfully",
      data: rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(formatted.statusCode).json(formatted);
  }
});

// GET A BORROW BY ID
borrowRoutes.get("/borrows/:id", async (req: Request, res: Response) => {
  try {
    const row = await Borrow.findById(req.params.id).populate({
      path: "book",
      select: "title isbn author genre copies available",
    });
    res.status(200).json({
      success: true,
      message: "Borrow retrieved successfully",
      data: row,
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(formatted.statusCode).json(formatted);
  }
});

// UPDATE A BORROW
borrowRoutes.put("/borrows/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      book: newBookId,
      quantity: newQty,
      dueDate,
    } = req.body as {
      book?: string;
      quantity?: number;
      dueDate?: Date | string;
    };

    const existing = await Borrow.findById(id);
    if (!existing) throw new Error("Borrow record not found");

    const oldBookId = existing.book.toString();
    const oldQty = existing.quantity;

    if (newBookId && newBookId !== oldBookId) {
      await (Book as any).returnCopies(oldBookId, oldQty);
      await (Book as any).adjustCopies(
        newBookId,
        typeof newQty === "number" ? newQty : oldQty
      );

      existing.set("book", newBookId as any);
      if (typeof newQty === "number") existing.quantity = newQty;
    } else if (typeof newQty === "number" && newQty !== oldQty) {
      const diff = newQty - oldQty;
      if (diff > 0) {
        await (Book as any).adjustCopies(oldBookId, diff);
      } else if (diff < 0) {
        await (Book as any).returnCopies(oldBookId, -diff);
      }
      existing.quantity = newQty;
    }

    if (dueDate) existing.dueDate = new Date(dueDate);

    await existing.save();

    res.status(200).json({
      success: true,
      message: "Borrow updated successfully",
      data: existing,
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(formatted.statusCode).json(formatted);
  }
});

// DELETE A BORROW
borrowRoutes.delete("/borrows/:id", async (req: Request, res: Response) => {
  try {
    const existing = await Borrow.findById(req.params.id);
    if (!existing) throw new Error("Borrow record not found");

    await (Book as any).returnCopies(
      existing.book.toString(),
      existing.quantity
    );
    await existing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Borrow deleted successfully",
      data: null,
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(formatted.statusCode).json(formatted);
  }
});

// SUMMARY (aggregation)
borrowRoutes.get("/borrow", async (_req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      { $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } } },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          book: { title: "$bookDetails.title", isbn: "$bookDetails.isbn" },
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
    res.status(formatted.statusCode).json(formatted);
  }
});
