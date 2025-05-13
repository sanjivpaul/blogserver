// routes/tag.route.js
import express from "express";
import {
  createTag,
  deleteTag,
  getAllTags,
  getTagArticles,
  updateTag,
} from "../../controllers/tag/tag.controller.js";
import { isAdmin, verifyJwt } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllTags);
router.get("/:tagId/articles", getTagArticles);

// Admin protected routes
router.use(verifyJwt, isAdmin);
// router.use(verifyJwt);
router.post("/", createTag);
router.patch("/:tagId", updateTag);
router.delete("/:tagId", deleteTag);

export default router;
