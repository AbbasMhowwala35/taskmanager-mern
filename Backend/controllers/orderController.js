import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, subtotal, shipping, tax, total, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Order items are required",
                data: null
            });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shipping,
            tax,
            total,
        });

        res.status(201).json({
            status: "success",
            message: "Order placed successfully",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found",
                data: null
            });
        }

        order.status = req.body.status || order.status;

        if (order.status === "Delivered" && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }

        await order.save();

        res.status(200).json({
            status: "success",
            message: "Order status updated successfully",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
            data: null
        });
    }
};
