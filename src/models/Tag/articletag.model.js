// models/ArticleTag.js (junction table)
const ArticleTag = (sequelize, DataTypes) => {
  return sequelize.define(
    "ArticleTag",
    {},
    { timestamps: true, tableName: "ArticleTags" }
  );
};

export default ArticleTag;
