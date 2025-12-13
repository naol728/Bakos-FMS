import express from "express";
import {
  getLoans,
  depenseLoan,
  repayLoan,
} from "../controllers/loan.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const route = express.Router();
route.get("/getloans", asyncHandler(getLoans));
route.post("/loandepesment", asyncHandler(depenseLoan));
route.post("/repayloan", asyncHandler(repayLoan));

export default route;
