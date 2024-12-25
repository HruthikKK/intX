import mongoose , { Schema } from "mongoose"

const blogPostSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
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
        vote: [
            {
              user: {
                type: Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
                required: true, // Ensure a user is always associated with a vote
              },
              type: {
                type: String,
                enum: ['up', 'down'], // Restrict to these two types
                required: true, // Make the vote type mandatory
              },
            },
        ],
        upvotes : {
            type : Number,
            default : 0
        }
    },
    {
        timestamps: true
    }
);

export const BlogPost = mongoose.model("BlogPost", blogPostSchema);