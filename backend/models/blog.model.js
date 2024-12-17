import mongoose , { Schema } from "mongoose"

const blogPostSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);

export const BlogPost = mongoose.model("BlogPost", blogPostSchema);