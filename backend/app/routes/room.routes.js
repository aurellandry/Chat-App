/**
 * 
 *  Ici sont répertoriées toutes les routes utiles pour l'authentification
 * 
 */

const { authJwt } = require("../middlewares");
const controller  = require("../controllers/room.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // --------------- //
    //      ROOMS      //
    // --------------- //
    app.get("/room", authJwt.verifyToken, controller.getRooms);
};