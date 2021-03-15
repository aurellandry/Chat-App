const mongoose = require("mongoose");

const Room = mongoose.model(
    "Room",
    new mongoose.Schema({
        name: String,
        users: [
            {
                id: String,
                username: String,
                name: String,
                first_name: String,
                email: String,
            }
        ],
        messages: [
            {
                text: String,
                created_at: Date,
                created_by: String
            }
        ]
    })
);

module.exports = Room;