const Bookmark = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    "Bookmark",
    {
      created_at: DataTypes.DATE,
    },
    {
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "article_id"],
        },
      ],
    }
  );

  return Bookmark;
};
