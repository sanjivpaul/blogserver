import { Tag, Article } from "../../models/index.js";
import { sequelize } from "../../db/index.js";

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

export { createTag };
