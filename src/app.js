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
app.use(express.json({ limit: "25kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Hello Backend Tas k!");
// });

import userRouter from "./routes/user/user.routes.js";
import subscriptionRouter from "./routes/subscription/subscription.routes.js";
import userProfileRouter from "./routes/user/userprofile.routes.js";
import userPreferencesRouter from "./routes/user/userpreferences.routes.js";
import userSecurityRouter from "./routes/user/usersecurity.routes.js";
import articleRouter from "./routes/article/article.routes.js";
import tagRouter from "./routes/tag/tag.routes.js";
import tagFollowRouter from "./routes/tagfollow/tagfollow.routes.js";

app.use("/api/auth", userRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/profile", userProfileRouter);
app.use("/api/preferences", userPreferencesRouter);
app.use("/api/security", userSecurityRouter);
app.use("/api/article", articleRouter);
app.use("/api/tags", tagRouter);
app.use("/api/tagfollow", tagFollowRouter);

export { app };
