// routes/tagFollow.route.js
import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import {
  checkTagFollowStatus,
  followTag,
  getFollowedTags,
  unfollowTag,
} from "../../controllers/tagfollow/tagfollow.controller.js";

const router = express.Router();

router.use(verifyJwt);

// Follow/Unfollow
router.post("/:tagId/follow", followTag);
router.delete("/:tagId/follow", unfollowTag);

// // Get followed tags
router.get("/followed", getFollowedTags);

// // Check follow status
router.get("/:tagId/status", checkTagFollowStatus);

export default router;
