import express from "express";
import { createMeeting } from "./../controllers/meeting.controller.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import { protect } from "./../middleware/auth.middleware.js";

const route = express.Router();
route.use(protect);
route.post("/create", asyncHandler(createMeeting));

export default route;
