import express, { Application, Request, Response } from "express";
import cors from "cors";
import { bookRoutes } from "./app/controllers/book.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json());

// CONTROLLERS //
app.use("/api", bookRoutes);
app.use("/api", borrowRoutes);

// SERVER RUNNING //
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management System");
});

export default app;
