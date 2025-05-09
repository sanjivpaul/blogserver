import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Hello Backend Tas k!");
// });

import userRouter from "./routes/user/user.routes.js";

app.use("/api/auth", userRouter);

export { app };
