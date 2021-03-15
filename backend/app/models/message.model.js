const mongoose = require("mongoose");

const Message = mongoose.model(
    "Message",
    new mongoose.Schema({
        text: String,
        created_at: Date,
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    })
);

module.exports = Message;