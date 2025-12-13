import express from "express";
import {
  addRequest,
  getRequest,
  getRequests,
  getUserWithdrawalRequest,
  withdraw,
} from "../controllers/withdraw.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const route = express.Router();

route.get("/requests", asyncHandler(getRequests));
route.get("/userrequest/:user_id", asyncHandler(getUserWithdrawalRequest));
route.get("/request/:id", asyncHandler(getRequest));
route.post("/request", asyncHandler(addRequest));
route.post("/withdraw", asyncHandler(withdraw));

export default route;
