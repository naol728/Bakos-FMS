import express from "express";
import {
  getFinancialReport,
  getdepositReport,
  getLoanreport,
} from "../controllers/finance.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const route = express.Router();

route.get("/report", asyncHandler(asyncHandler(getFinancialReport)));
route.get("/deposit", asyncHandler(asyncHandler(getdepositReport)));
route.get("/loan", asyncHandler(asyncHandler(getLoanreport)));

export default route;
