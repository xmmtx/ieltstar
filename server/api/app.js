import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/index.js";

// Load env
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan(":method :url :status :response-time ms"));

//Pass the app to the routes
routes(app);

// Connect to the database
try {
  console.log("Connecting to the database...");
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASS;
  const url = new URL(`${process.env.DB_URL}/${process.env.DB_NAME}`);
  if (user) url.username = user;
  if (pass) url.password = pass;
  await mongoose.connect(url.toString());
  console.log("Successfully connected to MongoDB");
} catch (e) {
  console.log("Error connecting to database : ", e);
}

export default app;
