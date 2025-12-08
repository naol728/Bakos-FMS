import express from "express";

const app = express();

app.use("/", (req, res) => {
  res.send("Bakos Backend");
});

export default app;
