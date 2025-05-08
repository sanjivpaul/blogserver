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
    Tag.belongsToMany(models.Article, {
      through: "ArticleTags",
      as: "articles",
    });
  };

  return Tag;
};

export default Tag;
