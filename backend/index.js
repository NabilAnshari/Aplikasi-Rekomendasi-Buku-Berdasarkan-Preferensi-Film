import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./models/index.js";
import router from "./routes/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

(async () => {
  try {
    await db.authenticate();
    console.log(" Database Connected...");
    await db.sync(); 
    console.log(" All models were synchronized successfully.");
  } catch (error) {
    console.error(" Database connection error:", error);
  }
})();

app.use("/images", express.static("public/images"));
app.use("/images/user", express.static("public/images"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => console.log(" Server running at port 5000"));