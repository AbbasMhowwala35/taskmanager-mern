import Product from "../models/Products.js";

export const getAllProducts = async (req, res) => {
    try {
        console.log("GET PRODUCTS HIT");

        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};