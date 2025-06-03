import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js";
import braintree from "braintree";
import cors from "cors";
import path from "path";

dotenv.config();
console.log("Loaded ENV:");

connectDB();

// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

app.get("/", (req, res) => {
  res.send(" <h1>Welcome to Ecommerce App</h1>");
});

const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgCyan.white);
});
