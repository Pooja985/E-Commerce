import express from "express";
import {
  forgotPasswordController,
  getAllOrderController,
  getOrdersController,
  loginController,
  orderStatusController,
  registerController,
  updateProfileController,
} from "./../controller/authController.js"; // Adjust the path as necessary
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// Define the registration route
router.post("/register", registerController);

// login
router.post("/login", loginController);

// forgot password
router.post("/forgot-password", forgotPasswordController);

// Protected route auth middleware
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected route admin middleware
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update profile
router.put("/update-profile", requireSignIn, updateProfileController);

// get orders
router.get("/orders", requireSignIn, getOrdersController);

// get all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrderController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default router;
