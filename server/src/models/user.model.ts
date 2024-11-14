import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    googleClientId: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String,
    },
    credits: {
        type: Number,
        default: 5
    },
    lastCreditRefresh: {
        type: Date,
        default: Date.now
    },
    isSpecial: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)