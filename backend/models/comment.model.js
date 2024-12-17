import mongoose, { Schema } from "mongoose"

const commentSchema = new mongoose.Schema({
    blogPost: {
        type: Schema.Types.ObjectId,
        ref: "BlogPost", // Reference to the BlogPost model
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User", // Assuming a User model exists
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "Comment", // Reference to another Comment
        default: null,  // Null if it's a direct comment to the blog
    },
});

export const Comment = mongoose.model("Comment", commentSchema);

