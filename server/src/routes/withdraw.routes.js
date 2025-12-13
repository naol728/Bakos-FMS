import express from "express";
import {
  addRequest,
  getRequest,
  getRequests,
} from "../controllers/withdraw.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const route = express.Router();

route.get("/request/:id", asyncHandler(getRequest));
route.get("/requests", asyncHandler(getRequests));
route.post("/request", asyncHandler(addRequest));

export default route;
