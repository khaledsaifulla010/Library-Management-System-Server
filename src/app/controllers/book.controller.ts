import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { globalError } from "../../utils/globalError";

export const bookRoutes = express.Router();

// CREATE A BOOK
bookRoutes.post("/books", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (typeof body.copies === "number" && body.copies === 0) {
      body.available = false;
    }

    const data = await Book.create(body);
    res
      .status(201)
      .json({ success: true, message: "Book created successfully", data });
  } catch (error) {
    const formatted = globalError(error);
    res.status(formatted.statusCode).json(formatted);
  }
});

// GET ALL BOOKS 
bookRoutes.get("/books", async (req: Request, res: Response) => {
  try {
    const genreFilter = (req.query.filter as string) || "";
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sort as string) === "asc" ? 1 : -1;

    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const skip = (page - 1) * limit;

    const filterCondition = genreFilter
      ? { genre: genreFilter.toUpperCase() }
      : {};

    const [books, total] = await Promise.all([
      Book.find(filterCondition)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Book.countDocuments(filterCondition),
    ]);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        sortBy,
        sort: sortOrder === 1 ? "asc" : "desc",
        filter: genreFilter || "",
      },
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(formatted.statusCode).json(formatted);
  }
});

// GET BOOK BY ID
bookRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(formatted.statusCode).json(formatted);
  }
});

// UPDATE A BOOK BY ID
bookRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const updateBookData = req.body;

    if (
      typeof updateBookData.copies === "number" &&
      updateBookData.copies === 0
    ) {
      updateBookData.available = false;
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updateBookData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(formatted.statusCode).json(formatted);
  }
});

// DELETE A BOOK BY ID
bookRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(formatted.statusCode).json(formatted);
  }
});
