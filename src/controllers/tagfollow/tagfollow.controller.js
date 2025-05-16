import db from "../../models/index.js";
import { Op } from "sequelize";
import sequelize from "../../db/index.js";

const { TagFollow, Tag, User } = db;

// Follow a Tag
const followTag = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { tagId } = req.params;
    const userId = req.user.user_id;

    // Check if tag exists
    const tag = await Tag.findByPk(tagId, { transaction });
    if (!tag) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // Check existing follow
    const existingFollow = await TagFollow.findOne({
      where: { user_id: userId, tag_id: tagId },
      transaction,
    });

    if (existingFollow) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: "Already following this tag",
      });
    }

    // Create follow relationship
    await TagFollow.create(
      {
        user_id: userId,
        tag_id: tagId,
        created_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Successfully followed tag",
      tag: {
        tag_id: tag.tag_id,
        name: tag.name,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: "Failed to follow tag",
    });
  }
};

// unfollow tag
const unfollowTag = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { tagId } = req.params;
    const userId = req.user.user_id;

    // if exist then destroy it
    const result = await TagFollow.destroy({
      where: { user_id: userId, tag_id: tagId },
      transaction,
    });

    // if not then just show a msg
    if (result === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Tag follow relationship not found",
      });
    }

    // commit the changes
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Successfully unfollowed tag",
    });
  } catch (error) {
    // if error the rollbac all the commit changes
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: "Failed to unfollow tag",
    });
  }
};

// Get User's Followed Tags
const getFollowedTags = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { limit = 20, offset = 0 } = req.query;

    const followedTags = await TagFollow.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Tag,
          attributes: ["tag_id", "name"],
          as: "tag",
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: followedTags.length,
      tags: followedTags.map((follow) => ({
        tag_id: follow.tag.tag_id,
        name: follow.tag.name,
        followed_at: follow.created_at,
      })),
    });
  } catch (error) {
    console.error("get followed tags error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch followed tags",
    });
  }
};

// Check if User is Following Tag
const checkTagFollowStatus = async (req, res) => {
  try {
    const { tagId } = req.params;
    const userId = req.user.user_id;

    const follow = await TagFollow.findOne({
      where: { user_id: userId, tag_id: tagId },
      attributes: ["created_at"],
    });

    return res.status(200).json({
      success: true,
      is_following: !!follow,
      followed_at: follow?.created_at,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check follow status",
    });
  }
};

export { followTag, getFollowedTags, checkTagFollowStatus, unfollowTag };
