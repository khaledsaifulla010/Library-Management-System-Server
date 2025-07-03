import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/book.controller";

const app: Application = express();
app.use(express.json());

// CONTROLLERS //
app.use("/api", bookRoutes);

// SERVER RUNNING //
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management System");
});

export default app;
