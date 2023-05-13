import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";

const app = express();

// ミドルウェア設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ルート設定
app.use("/api/users", userRoutes);

// app.get("/", (req: Request, res: Response): void => {
//   let users = ["Goon", "Tsuki", "Joe"];
//   res.status(200).send(users);
// });

app.use("/", (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: "Allo! Catch-all route." });
});

export default app;
