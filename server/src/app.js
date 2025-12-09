import express from "express";
import authroute from "./routes/auth.routes.js";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authroute);

app.use("/", (req, res) => {
  res.send("Bakos Backend");
});

export default app;
