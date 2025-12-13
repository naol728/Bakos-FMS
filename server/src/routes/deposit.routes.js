import express from "express";
import { deposit } from "../controllers/deposit.controller.js";
import { asyncHandler } from "./../utils/asyncHandler.js";

const route = express.Router();

route.post("/deposit", asyncHandler(deposit));
export default route;
