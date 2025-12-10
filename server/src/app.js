import express from "express";
import authroute from "./routes/auth.routes.js";
import adminroute from "./routes/admin.routes.js";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authroute);
app.use("/api/admin", adminroute);
app.use("/", (req, res) => {
  res.send("Bakos Backend");
});
app.use(errorHandler);

export default app;
