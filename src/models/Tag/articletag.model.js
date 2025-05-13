// models/ArticleTag.js (junction table)
const ArticleTag = (sequelize, DataTypes) => {
  return sequelize.define(
    "ArticleTag",
    {
      article_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      tag_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
    },
    { timestamps: true, tableName: "ArticleTags" }
  );
};

export default ArticleTag;
