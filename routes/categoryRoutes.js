import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  singleCategory,
  updateCategory,
} from "../controller/categoryController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new category
router.post("/create-category", requireSignIn, isAdmin, createCategory);

// Update a category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategory);

// Get all categories
router.get("/get-category", getCategories);

// Single category
router.get("/single-category/:slug", singleCategory);

// Delete a category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);

export default router;
