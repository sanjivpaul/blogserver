import { Tag, Article, User } from "../../models/index.js";
import sequelize from "../../db/index.js";

// Create Tag (Admin only)
const createTag = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name } = req.body;

    if (!name) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    const existingTag = await Tag.findOne({
      where: { name },
      transaction,
    });

    if (existingTag) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: "Tag name already exists",
      });
    }

    const tag = await Tag.create({ name }, { transaction });
    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
      tag: {
        tag_id: tag.tag_id,
        name: tag.name,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: "Failed to create tag",
    });
  }
};

// Get All Tags (Public)
const getAllTags = async (req, res) => {
  try {
    const { search } = req.query;
    const where = search
      ? {
          name: { [Op.iLike]: `%${search}%` },
        }
      : {};

    const tags = await Tag.findAll({
      where,
      attributes: ["tag_id", "name"],
      order: [["name", "ASC"]],
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
    });

    return res.status(200).json({
      success: true,
      count: tags.length,
      tags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tags",
    });
  }
};

// Get Articles by Tag (Public)
const getTagArticles = async (req, res) => {
  console.log("req.params.tagId===>", req.params.tagId);

  try {
    const tag = await Tag.findByPk(req.params.tagId, {
      include: [
        {
          model: Article,
          as: "articles",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["user_id"],
            },
          ],
          through: { attributes: [] },
        },
      ],
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    return res.status(200).json({
      success: true,
      tag: {
        tag_id: tag.tag_id,
        name: tag.name,
        articles: tag.articles,
      },
    });
  } catch (error) {
    console.error("getTagArticles error:", error); // 👈 Add this

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tag articles",
    });
  }
};

export { createTag, getAllTags, getTagArticles };
