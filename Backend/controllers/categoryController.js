import Category from "../models/Category.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            status: "success",
            message: "Categories fetched successfully",
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({
            status: "success",
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
                data: null
            });
        }
        res.status(200).json({
            status: "success",
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found",
                data: null
            });
        }
        res.status(200).json({
            status: "success",
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};