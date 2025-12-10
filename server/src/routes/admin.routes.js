import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployeee,
  getFeedbacks,
  getLog,
  getMeetings,
  updateEmployee,
  updateme,
} from "../controllers/admin.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/auth.middleware.js";

const route = express.Router();
route.use(protect);
route.post("/createemployee", asyncHandler(createEmployee));
route.get("/getemployee", asyncHandler(getEmployeee));
route.patch("/updateemployee", asyncHandler(updateEmployee));
route.delete("/deleteemployee/:id", asyncHandler(deleteEmployee));
route.patch("/updateme", asyncHandler(updateme));
route.get("/feedbacks", asyncHandler(getFeedbacks));
route.get("/getmettings", asyncHandler(getMeetings));
route.get("/log", asyncHandler(getLog));

export default route;
