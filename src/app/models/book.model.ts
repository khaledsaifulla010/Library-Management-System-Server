import { model, Schema, Model, Document, } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookModel extends Model<IBook> {
  adjustCopies(bookId: string, quantity: number): Promise<IBook>;
  returnCopies(bookId: string, quantity: number): Promise<IBook>;
}

const BookSchema = new Schema<IBook, BookModel>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    description: { type: String, default: "", trim: true },
    copies: {
      type: Number,
      required: [true, "Copies count is required"],
      min: [0, "Copies cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Copies must be a non-negative integer",
      },
    },
    available: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true }
);

// STATIC METHODS //
BookSchema.statics.adjustCopies = async function (
  bookId: string,
  quantity: number
) {
  const book = await this.findById(bookId);
  if (!book) throw new Error("Book not found");
  if (book.copies < quantity) throw new Error("Not enough copies available");

  book.copies -= quantity;
  if (book.copies === 0) book.available = false;
  await book.save();
  return book;
};

BookSchema.statics.returnCopies = async function (
  bookId: string,
  quantity: number
) {
  const book = await this.findById(bookId);
  if (!book) throw new Error("Book not found");

  book.copies += quantity;
  if (book.copies > 0) book.available = true;
  await book.save();
  return book;
};

export const Book = model<IBook, BookModel>("Book", BookSchema);
