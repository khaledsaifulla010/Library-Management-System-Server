import express, { Request, Response } from "express";
import { Book } from "../models/book.model";

export const bookRoutes = express.Router();

// CREATE A BOOK //
bookRoutes.post("/books", async (req: Request, res: Response) => {
  const body = req.body;
  const data = await Book.create(body);
  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data,
  });
});
