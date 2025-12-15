import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createFeedback,
  getFeedbaks,
} from "../controllers/feedback.controller.js";

const route = express.Router();
route.use(protect);
route.post("/create", createFeedback);
route.get("/get", getFeedbaks);
export default route;
