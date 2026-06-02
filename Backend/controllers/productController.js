import Product from "../models/Products.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
    brand: body.brand,
    description: body.description,
    featured: body.featured,
    specs: body.specs === undefined ? undefined : normalizeSpecs(body.specs),
    rating: body.rating,
    reviews: body.reviews,
    countInStock: body.countInStock,
    image: normalizeImages(body.image, files),
});

export const getAllProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            minRating,
            featured,
            sort = "newest",
        } = req.query;
        const filter = {};

        if (search) {
            const regex = new RegExp(escapeRegex(search), "i");
            filter.$or = [
                { name: regex },
                { description: regex },
                { brand: regex },
                { specs: regex },
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (brand) {
            filter.brand = { $in: String(brand).split(",") };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        if (featured !== undefined) {
            filter.featured = featured === "true";
        }

        const sortOptions = {
            newest: { createdAt: -1 },
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            rating: { rating: -1 },
            name: { name: 1 },
        };

        const products = await Product.find(filter)
            .populate("category")
            .sort(sortOptions[sort] || sortOptions.newest);

        const allProducts = await Product.find().populate("category");
        const prices = allProducts.map((product) => product.price);

        res.status(200).json({
            status: "success",
            message: "Products fetched successfully",
            data: products,
            filters: {
                categories: [
                    ...new Map(
                        allProducts
                            .filter((product) => product.category)
                            .map((product) => [product.category._id.toString(), product.category])
                    ).values(),
                ],
                brands: [...new Set(allProducts.map((product) => product.brand).filter(Boolean))].sort(),
                specs: [...new Set(allProducts.flatMap((product) => product.specs || []))].sort(),
                priceRange: {
                    min: prices.length ? Math.min(...prices) : 0,
                    max: prices.length ? Math.max(...prices) : 0,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");

        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
                data: null
            });
        }

        const similarProducts = await Product.find({
            _id: { $ne: product._id },
            category: product.category?._id,
        })
            .populate("category")
            .limit(4);

        res.status(200).json({
            status: "success",
            message: "Product fetched successfully",
            data: product,
            similarProducts,
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

export const addProductReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
                data: null
            });
        }

        const alreadyReviewed = product.reviewList.some(
            (review) => review.user?.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                status: "error",
                message: "You already reviewed this product",
                data: null
            });
        }

        product.reviewList.push({
            user: req.user._id,
            name: req.user.name,
            rating: Number(req.body.rating),
            comment: req.body.comment,
        });

        product.reviews = product.reviewList.length;
        product.rating = product.reviewList.reduce((sum, review) => sum + review.rating, 0) / product.reviewList.length;

        await product.save();

        res.status(201).json({
            status: "success",
            message: "Review added successfully",
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
