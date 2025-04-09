import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import formidable from "express-formidable";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProduct,
  deleteProduct,
  getFilters,
  getProducts,
  getProductsByCategory,
  getSingleProduct,
  productCount,
  productList,
  productPhoto,
  searchProduct,
  similarProducts,
  updateProduct,
} from "../controller/productController.js";

const router = express.Router();

// Create a product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProduct
);

// Update a product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProduct
);

// Get all products
router.get("/get-products", getProducts);

// Get a single product
router.get("/get-product/:slug", getSingleProduct);

// Get photo
router.get("/product-photo/:pid", productPhoto);

// Delete a product
router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProduct);

// product filter
router.post("/product-filter", getFilters);

// product count
router.get("/product-count", productCount);

// product per page
router.get("/product-list/:page", productList);

// Search Product
router.get("/search-product/:keyword", searchProduct);

// Similar Products
router.get("/similar-products/:pid/:cid", similarProducts);

// category wise product
router.get("/product-category/:slug", getProductsByCategory);

// payment routes
// token
router.get("/braintree/token", braintreeTokenController);

// payments
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;
