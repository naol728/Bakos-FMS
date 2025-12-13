import express from "express";
import { asyncHandler } from "./../utils/asyncHandler.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
  getCustomer,
} from "../controllers/customer.controller.js";
import { upload } from "./../middleware/upload.js";
import { protect } from "../middleware/auth.middleware.js";

const route = express.Router();
route.use(protect);
route.get("/get", asyncHandler(getCustomers));
route.get("/get/:id", asyncHandler(getCustomer));
route.post("/create", upload.single("photo"), asyncHandler(createCustomer));
route.patch("/update", upload.single("photo"), asyncHandler(updateCustomer));
route.delete("/delete/:id", asyncHandler(deleteCustomer));

export default route;
