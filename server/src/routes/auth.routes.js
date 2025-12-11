import express from "express";
import { Login, me, refreshToken } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authroute = express.Router();

authroute.post("/login", asyncHandler(Login));
authroute.get("/me", asyncHandler(me));
authroute.post("/refreshtoken", asyncHandler(refreshToken));
export default authroute;
