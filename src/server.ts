import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
let server: Server;
const port = process.env.PORT || 5000;
async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    console.log("Connect with MongoDB! ");
    server = app.listen(port, () => {
      console.log(`Library Management System is listening on port ${port}.`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
