import categoryModel from "../model/categoryModel.js";
import slugify from "slugify";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }
    const category = new categoryModel({ name, slug: slugify(name) });
    await category.save();
    res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Get a single category
export const singleCategory = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};
