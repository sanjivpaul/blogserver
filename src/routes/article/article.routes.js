// routes/article.route.js
import express from "express";
import { createArticle } from "../../controllers/article/article.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// // Public routes
// router.get("/", getArticles);
// router.get("/:id", getArticle);

// Protected routes
router.use(verifyJwt);
router.post("/", createArticle);
// router.patch("/:id", updateArticle);
// router.delete("/:id", deleteArticle);

export default router;
