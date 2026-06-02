import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        image: String,
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: [(items) => items.length > 0, "Order must include at least one item"]
        },
        shippingAddress: {
            firstName: String,
            lastName: String,
            email: String,
            address: String,
            city: String,
            zipCode: String
        },
        paymentMethod: {
            type: String,
            default: "Card"
        },
        subtotal: {
            type: Number,
            required: true
        },
        shipping: {
            type: Number,
            required: true
        },
        tax: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Placed"
        },
        deliveredAt: Date
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Order", orderSchema);
