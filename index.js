import express from "express";
import sequelize from "./src/db/index.js";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello blog app");
});

// app.listen(port, () => {
//   console.log(`blog app server is running on port ${port}`);
// });

sequelize
  .sync()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(port || 5001, () => {
      console.log(`server is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("DB Connection error:", error);
  });
