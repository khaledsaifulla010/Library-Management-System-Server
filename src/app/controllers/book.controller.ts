import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { globalError } from "../../utils/globalError";
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
    const formatted = globalError(error);
    res.status(400).json(formatted);
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
    const formatted = globalError(error);
    res.status(400).json(formatted);
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
    const formatted = globalError(error);
    res.status(400).json(formatted);
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
    const formatted = globalError(error);
    res.status(400).json(formatted);
  }
});

// DELETE A BOOK BY ID //
bookRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    const formatted = globalError(error);
    res.status(400).json(formatted);
  }
});
