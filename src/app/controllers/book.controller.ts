import express, { Request, Response } from "express";
import { Book } from "../models/book.model";

export const bookRoutes = express.Router();

// CREATE A BOOK //
bookRoutes.post("/books", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const data = await Book.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to created books",
      error: (error as Error).message,
    });
  }
});

// GET ALL BOOKS with filtering, sorting, limiting //
bookRoutes.get("/books", async (req: Request, res: Response) => {
  try {
    const genreFilter = req.query.filter as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sort as string) === "asc" ? 1 : -1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filterCondition = genreFilter
      ? { genre: genreFilter.toUpperCase() }
      : {};

    const books = await Book.find(filterCondition)
      .sort({ [sortBy]: sortOrder })
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      error: (error as Error).message,
    });
  }
});

// GET BOOK BY ID //
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
    res.status(500).json({
      success: false,
      message: "Failed to retrieve book",
      error: (error as Error).message,
    });
  }
});

// UPDATE A BOOK BY ID //
bookRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const updateBookData = req.body;

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
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: (error as Error).message,
    });
  }
});
