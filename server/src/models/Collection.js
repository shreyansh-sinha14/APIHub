const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        apiIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "API"
            }
        ],

        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "private"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Collection", collectionSchema);