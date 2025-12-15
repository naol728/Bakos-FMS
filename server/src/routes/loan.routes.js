import express from "express";
import {
  getLoans,
  depenseLoan,
  repayLoan,
  getLoanRequests,
  updateStatusLoanCommite,
  updateStatusManager,
} from "../controllers/loan.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const route = express.Router();
route.get("/getloans", asyncHandler(getLoans));
route.get("/getloanrequests", asyncHandler(getLoanRequests));
route.post("/loandepesment", asyncHandler(depenseLoan));
route.post("/repayloan", asyncHandler(repayLoan));
route.post("/commiteaproval/:id", asyncHandler(updateStatusLoanCommite));
route.post("/manageraproval/:id", asyncHandler(updateStatusManager));

export default route;
