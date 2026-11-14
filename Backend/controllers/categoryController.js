import Category from "../models/categoryModel.js";

/**
 * Get all categories
 * @route GET /api/categories
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new category
 * @route POST /api/categories
 */
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });

    res
      .status(201)
      .json({ category, message: "Added Category Successfully ✅" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete a category
 * @route DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const delCategory = await Category.findById(req.params.id);
    if (!delCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    await delCategory.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
