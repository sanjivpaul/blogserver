// models/Article.js
const Article = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      article_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("draft", "published"),
        defaultValue: "draft",
      },
      published_at: DataTypes.DATE,
    },
    { timestamps: true }
  );

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: "author_id",
      as: "author",
    });
    // Article.belongsToMany(models.Tag, {
    //   through: "ArticleTags",
    //   as: "tags",
    // });
    Article.belongsToMany(models.Tag, {
      through: models.ArticleTag,
      foreignKey: "article_id",
      otherKey: "tag_id",
      as: "tags",
    });
  };

  return Article;
};

export default Article;
