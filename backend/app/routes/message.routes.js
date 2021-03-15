/**
 * 
 *  Ici sont répertoriées toutes les routes utiles pour les messages
 * 
 */

const { authJwt } = require("../middlewares");
const controller  = require("../controllers/message.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // ----------------------- //
    //      ROOM MESSAGES      //
    // ----------------------- //
    app.get("/api/room/messages", authJwt.verifyToken, controller.getRoomMessages);
    app.post("/api/room/messages/create", authJwt.verifyToken, controller.createMessage);
};