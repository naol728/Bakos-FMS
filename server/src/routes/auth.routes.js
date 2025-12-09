import express from "express";
import { Login, me, refreshToken } from "../controllers/auth.controller.js";

const authroute = express.Router();

authroute.post("/login", Login);
authroute.get("/me", me);
authroute.post("/refreshtoken", refreshToken);
export default authroute;
