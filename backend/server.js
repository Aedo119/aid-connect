import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import indexRoute from "./routes/indexRoute.routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser()); 

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);


export const pool = mysql.createPool({
  host: process.env.DB_HOST, // e.g. "mysql.railway.app"
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

app.use("/", indexRoute);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL connected!");
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
    process.exit(1);
  }
}

startServer();
