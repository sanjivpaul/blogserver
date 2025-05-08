// models/Comment.js
const Comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      comment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      content: DataTypes.TEXT,
      parent_comment_id: DataTypes.UUID, // For nested comments
    },
    { timestamps: true }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: "user_id" });
    Comment.belongsTo(models.Article, { foreignKey: "article_id" });
    Comment.belongsTo(models.Comment, {
      foreignKey: "parent_comment_id",
      as: "parentComment",
    });
  };

  return Comment;
};

export default Comment;
