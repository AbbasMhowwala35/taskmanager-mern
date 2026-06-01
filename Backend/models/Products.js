import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        image: String,

        description: String,

        featured: {
            type: Boolean,
            default: false
        },

        specs: [String],

        rating: {
            type: Number,
            default: 0
        },

        reviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Products", productSchema);