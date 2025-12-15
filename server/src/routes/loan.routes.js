import express from "express";
import {
  getLoans,
  depenseLoan,
  repayLoan,
  getLoanRequests,
  updateStatusLoanCommite,
  updateStatusManager,
  getMyLoanrequests,
  createLoanRequest,
  updateLoanRequest,
  deleteLoanRequest,
  getMyloans,
} from "../controllers/loan.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/auth.middleware.js";

const route = express.Router();
route.use(protect);
route.get("/getloans", asyncHandler(getLoans));
route.get("/myloans", asyncHandler(getMyloans));
route.get("/getloanrequests", asyncHandler(getLoanRequests));
route.post("/loandepesment", asyncHandler(depenseLoan));
route.post("/repayloan", asyncHandler(repayLoan));
route.post("/commiteaproval/:id", asyncHandler(updateStatusLoanCommite));
route.post("/manageraproval/:id", asyncHandler(updateStatusManager));
route.get("/myrequests", asyncHandler(getMyLoanrequests));
route.post("/createrequest", asyncHandler(createLoanRequest));
route.post("/updaterequest", asyncHandler(updateLoanRequest));
route.delete("/deleterequest/:id", asyncHandler(deleteLoanRequest));

export default route;
