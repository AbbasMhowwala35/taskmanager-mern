import Product from "../models/Products.js";

const normalizeImages = (bodyImage, files = []) => {
    if (files.length > 0) {
        return files.map((file) => `/uploads/products/${file.filename}`);
    }

    if (Array.isArray(bodyImage)) {
        return bodyImage;
    }

    if (typeof bodyImage === "string" && bodyImage.trim()) {
        return [bodyImage.trim()];
    }

    return [];
};

const normalizeSpecs = (specs) => {
    if (Array.isArray(specs)) {
        return specs;
    }

    if (typeof specs === "string") {
        return specs.split(",").map((spec) => spec.trim()).filter(Boolean);
    }

    return [];
};

const compactPayload = (payload) => Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
);

const buildProductPayload = (body, files = []) => compactPayload({
    name: body.name,
    price: body.price,
    category: body.category,
    description: body.description,
    featured: body.featured,
    specs: body.specs === undefined ? undefined : normalizeSpecs(body.specs),
    rating: body.rating,
    reviews: body.reviews,
    image: normalizeImages(body.image, files),
});

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.status(200).json({
            status: "success",
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(buildProductPayload(req.body, req.files));

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatePayload = buildProductPayload(req.body, req.files);

        if (updatePayload.image.length === 0) {
            delete updatePayload.image;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
                data: null
            });
        }
        res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
                data: null
            });
        }
        res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};
