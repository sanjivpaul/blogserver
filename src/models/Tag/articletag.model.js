// models/ArticleTag.js (junction table)
const ArticleTag = (sequelize, DataTypes) => {
  return sequelize.define(
    "ArticleTag",
    {},
    { timestamps: false, tableName: "ArticleTags" }
  );
};

export default ArticleTag;
