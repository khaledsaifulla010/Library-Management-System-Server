import { model, Schema, Types } from "mongoose";

const BorrowSchema = new Schema(
  {
    book: {
      type: Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Borrow = model("Borrow", BorrowSchema);
