import productModel from "../model/productModel.js";
import orderModel from "../model/orderModel.js";
import categoryModel from "../model/categoryModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

// Payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProduct = async (req, res) => {
  try {
    const { name, slug, price, description, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });
      case !price:
        return res.status(500).send({ message: "Price is required" });
      case !description:
        return res.status(500).send({ message: "Description is required" });
      case !category:
        return res.status(500).send({ message: "Category is required" });
      case !quantity:
        return res.status(500).send({ message: "Quantity is required" });
      case !photo && photo.size > 1000000:
        return res.status(500).send({ message: "Photo is required" });
    }
    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res
      .status(200)
      .send({ success: true, countTotal: products.length, products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Get a single product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate({
        path: "category",
        select: "name _id",
      });
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }
    res.status(200).send({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Get photo
export const productPhoto = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.send(product.photo.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");

    res.status(200).send({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { name, slug, price, description, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;
    switch (true) {
      case !name:
        console.log("product details" + req.fields + "name" + name);
        return res.status(500).send({ message: "Name is required" });
      case !price:
        return res.status(500).send({ message: "Price is required" });
      case !description:
        return res.status(500).send({ message: "Description is required" });
      case !category:
        return res.status(500).send({ message: "Category is required" });
      case !quantity:
        return res.status(500).send({ message: "Quantity is required" });
      case !photo && photo?.size > 1000000:
        return res.status(500).send({ message: "Photo is required" });
    }
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// filters
export const getFilters = async (req, res) => {
  try {
    const { checked, checkedRadio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (checkedRadio.length) {
      args.price = { $gte: checkedRadio[0], $lte: checkedRadio[1] };
    }
    const product = await productModel.find(args);
    res.status(200).send({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// product count
export const productCount = async (req, res) => {
  try {
    const count = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({ success: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// prodcuct per page
export const productList = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Search Product
export const searchProduct = async (req, res) => {
  try {
    let { keyword } = req.params;

    // Ensure keyword is a string
    if (!keyword || typeof keyword !== "string") {
      return res
        .status(400)
        .send({ success: false, message: "Invalid search keyword" });
    }

    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword.toString(), $options: "i" } },
          { description: { $regex: keyword.toString(), $options: "i" } },
        ],
      })
      .select("-photo");

    res.status(200).send({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Similar products
export const similarProducts = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo")
      .limit(4)
      .populate("category");
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// get product by category
export const getProductsByCategory = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({ success: true, products, category });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// payment gateway api
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send({ success: false, error: "Internal Server Error" });
      } else {
        res
          .status(200)
          .send({ success: true, clientToken: response.clientToken });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// payment
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({
            ok: true,
          });
        } else {
          console.error(err);
          res
            .status(500)
            .send({ success: false, error: "Internal Server Error" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};
