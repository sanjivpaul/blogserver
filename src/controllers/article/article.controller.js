import { Article, User, Tag } from "../../models/index.js";
import sequelize from "../../db/index.js";

// Create Article (Writer/Admin only)
const createArticle = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { title, content, tags, status } = req.body;
    const userId = req.user.user_id;

    console.log("role===>", req.user.role);

    // Authorization check
    if (!["writer", "admin"].includes(req.user.role)) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only writers and admins can create articles",
      });
    }

    // Validation
    if (!title || !content) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Create article
    const article = await Article.create(
      {
        title,
        content,
        status: status || "draft",
        author_id: userId,
        published_at: status === "published" ? new Date() : null,
      },
      { transaction }
    );

    console.log("article===>", article);

    // // Handle tags
    // if (tags && tags.length > 0) {
    //   const tagInstances = await Tag.findAll({
    //     where: { name: { [Op.in]: tags } },
    //     transaction,
    //   });
    //   await article.setTags(tagInstances, { transaction });
    // }

    // Handle tags (create missing, associate all)
    if (tags && tags.length > 0) {
      const tagInstances = [];

      const existingTags = await Tag.findAll({
        where: { name: { [Op.in]: tags } },
        transaction,
      });

      const existingTagNames = existingTags.map((tag) => tag.name);
      tagInstances.push(...existingTags);

      const missingTagNames = tags.filter(
        (tag) => !existingTagNames.includes(tag)
      );

      // Create new tags if they don't exist
      for (const tagName of missingTagNames) {
        const newTag = await Tag.create({ name: tagName }, { transaction });
        tagInstances.push(newTag);
      }

      // Associate all tags with the article
      await article.setTags(tagInstances, { transaction });
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Article created successfully",
      article: {
        article_id: article.article_id,
        title: article.title,
        status: article.status,
        created_at: article.created_at,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: "Failed to create article",
      //   error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export { createArticle };
