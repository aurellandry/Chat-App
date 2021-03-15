const config = require("../config/auth.config");
const db = require("../models");
const Room = db.room;

exports.getRooms = async (req, res) => {
    console.log(`getRooms, User_ID : ${req.query.user_id}`);
    Room.find({
        "users.id": req.query.user_id
    }, (err, room) => {
        if (err) {
            res.send({ message: err });
            return;
        }

        res.send({rooms: room});
    });
}