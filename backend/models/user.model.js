import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
        avatar: {
            type: String, // cloudinary url
            // required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        },
        role: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema)