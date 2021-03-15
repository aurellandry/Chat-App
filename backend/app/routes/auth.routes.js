/**
 * 
 *  Ici sont répertoriées toutes les routes utiles pour l'authentification
 * 
 */

const { verifyRegister } = require("../middlewares");
const controller         = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // --------------------- //
    //      INSCRIPTION      //
    // --------------------- //
    app.post(
        "/api/auth/register",
        [
            verifyRegister.checkDuplicateUsernameOrEmail,
            verifyRegister.checkRolesExisted
        ],
        controller.register
    );

    // --------------- //
    //      LOGIN      //
    // --------------- //
    app.post("/api/auth/login", controller.login);
};