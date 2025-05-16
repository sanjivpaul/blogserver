// models/Tag.js
const Tag = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      tag_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        unique: true,
      },
    },
    { timestamps: false }
  );

  Tag.associate = (models) => {
    // Tag.belongsToMany(models.Article, {
    //   through: "ArticleTags",
    //   as: "articles",
    // });
    Tag.belongsToMany(models.User, {
      through: models.TagFollow,
      foreignKey: "tag_id",
      otherKey: "user_id",
      as: "followers",
      onDelete: "CASCADE",
    });

    Tag.belongsToMany(models.Article, {
      through: models.ArticleTag, // ✅ Use the actual model
      foreignKey: "tag_id",
      otherKey: "article_id",
      as: "articles",
    });

    Tag.hasMany(models.TagFollow, {
      foreignKey: "tag_id",
      as: "tagFollowRelations",
    });
  };

  // Tag.associate = (models) => {
  //   // Association with Articles (Many-to-Many)
  //   Tag.belongsToMany(models.Article, {
  //     through: models.ArticleTag, // Use model instead of table name
  //     foreignKey: "tag_id",
  //     otherKey: "article_id",
  //     as: "articles",
  //     onDelete: "CASCADE", // Add cascade delete
  //   });

  // // Association with Users (Many-to-Many through TagFollows)
  // Tag.belongsToMany(models.User, {
  //   through: models.TagFollow,
  //   foreignKey: "tag_id",
  //   otherKey: "user_id",
  //   as: "followers",
  //   onDelete: "CASCADE",
  // });

  // // Additional direct association if needed
  // Tag.hasMany(models.TagFollow, {
  //   foreignKey: "tag_id",
  //   as: "tagFollowRelations",
  // });
  // };

  return Tag;
};

export default Tag;
