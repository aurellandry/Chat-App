const config = require("../config/auth.config");
const db = require("../models");
const Room = db.room;

/**
 * Retrouver une discussion grâce à son identifiant
 * 
 * @param {int} id 
 * 
 * @returns {Room}
 */
function findRoomById(id) {
    return new Promise((resolve, reject) => {
        console.log("ROOM ID : ", id);
        Room.findById(id, (err, room) => {
            if (err) {
                reject(Error(err));
            }
    
            resolve(room)
        });
    });
}

/**
 * Enregistrer un message dans une discussion
 * 
 * @param {Room} room 
 * @param {Request} req 
 */
function createRoomMsg(room, req) {
    return new Promise((resolve, reject) => {
        console.log(req.body.user_id);
        var user;

        for(var i=0; i < room.users.length; i++){
            if(room.users[i].id == req.body.user_id) {
                user = room.users[i];
            }
        }

        const msg = {
            text: req.body.message,
            created_at : req.body.created_at,
            created_by: user.id
        }
        room.messages.push(msg);
        room.save(error => {
            if (error) {
                console.log(`Erreur : ${error}`);
                reject(Error(error));
            }
            console.log(`Message de ${user.username} enregistré en BDD.`);
        });
        resolve(msg);
    });
}

// Enregistrer un message en base de données
exports.createMessage = async (req, res) => {
    console.log("Create msg in room", req.body.room_id);
    findRoomById(req.body.room_id).then(room => createRoomMsg(room, req))
    .then((msg) => res.send({message: msg}))
    .catch(error => {
        console.log(`Erreur création de message : ${error}`);
        res.status(500).send(error);
    });
}

// Retrouver l'historique des messages d'une discussion
exports.getRoomMessages = async (req, res) => {
    findRoomById(req.query.room_id).then(room => res.send({messages: room.messages}))
    .catch(error => {
        console.log(`Erreur historique message dans discussion : ${error}`);
        res.status(500).send(error);
    });
}