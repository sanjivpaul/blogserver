import express from "express";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello blog app");
});

app.listen(port, () => {
  console.log(`blog app server is running on port ${port}`);
});
