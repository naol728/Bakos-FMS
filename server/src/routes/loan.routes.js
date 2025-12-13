import express from "express";
import { getLoans, depenseLoan } from "../controllers/loan.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const route = express.Router();
route.get("/getloans", asyncHandler(getLoans));
route.post("/loandepesment", asyncHandler(depenseLoan));

export default route;
