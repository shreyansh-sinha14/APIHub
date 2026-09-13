const mongoose = require("mongoose");

const apiSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },

        tags: [
            {
                type: String
            }
        ],

        baseUrl: {
            type: String,
            required: true
        },

        authenticationType: {
            type: String,
            default: "None"
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public"
        },
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("API", apiSchema);