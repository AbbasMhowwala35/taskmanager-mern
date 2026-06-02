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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        brand: String,

        image: [String],

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
        },

        reviewList: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                name: String,
                rating: {
                    type: Number,
                    min: 1,
                    max: 5
                },
                comment: String,
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        countInStock: {
            type: Number,
            default: 25
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Products", productSchema);
