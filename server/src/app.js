import express from "express";
import authroute from "./routes/auth.routes.js";
import adminroute from "./routes/admin.routes.js";
import customerroute from "./routes/customer.routes.js";
import depositroute from "./routes/deposit.routes.js";
import withdrawroute from "./routes/withdraw.routes.js";
import loanroute from "./routes/loan.routes.js";
import mettingroute from "./routes/meeting.routes.js";
import feedbackroute from "./routes/feedback.routes.js";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authroute);
app.use("/api/admin", adminroute);
app.use("/api/customer", customerroute);
app.use("/api/fund", depositroute);
app.use("/api/withdraw", withdrawroute);
app.use("/api/loan", loanroute);
app.use("/api/feedback", feedbackroute);
app.use("/api/meeting", mettingroute);
app.use("/", (req, res) => {
  res.send("Bakos Backend");
});
app.use(errorHandler);

export default app;
