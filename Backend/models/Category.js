import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        image: String,

        description: String,

        featured: {
            type: Boolean,
            default: false
        },

        rating: {
            type: Number,
            default: 0
        },

        products: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Product",
            default: []
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Category", categorySchema);