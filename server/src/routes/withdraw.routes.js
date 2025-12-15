import express from "express";
import {
  addRequest,
  getRequest,
  getRequests,
  getUserWithdrawalRequest,
  withdraw,
  getWithdrawRequestsManager,
  updateWithdrawStatusManger,
  updateWithdrawalCustomer,
  deleteWithdrawal,
} from "../controllers/withdraw.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/auth.middleware.js";
const route = express.Router();
route.use(protect);
route.get("/requests", asyncHandler(getRequests));
route.get("/userrequest/:user_id", asyncHandler(getUserWithdrawalRequest));
route.get("/request/:id", asyncHandler(getRequest));
route.post("/request", asyncHandler(addRequest));
route.post("/withdraw", asyncHandler(withdraw));
route.get("/managerwithdraw", asyncHandler(getWithdrawRequestsManager));
route.patch("/updatewithdraw", asyncHandler(updateWithdrawalCustomer));
route.delete("/deletewithdraw/:id", asyncHandler(deleteWithdrawal));

export default route;
