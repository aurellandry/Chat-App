const express       = require("express");
const cors          = require('cors');
const bodyParser    = require("body-parser");
const db            = require("./app/models");
const dbConfig      = require("./app/config/db.config");
const WebSocket     = require('ws');
const HttpsServer   = require('https').createServer;
const fs            = require("fs");
const app           = express();
const PORT          = process.env.PORT || '3001';
const server        = require('http').createServer(app);
const wss           = new WebSocket.Server({server: server});


// CORS Middleware
app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const Role = db.role;
const Room = db.room;
const User = db.user;

// Connexion à la base de données MongoDB
db.mongoose.connect(`mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}/${dbConfig.DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connexion établie avec la base de données.");
    initial();
}).catch(err => {
    console.error("Erreur de connexion à la base de données", err);
    process.exit();
});

// ---------------------------------------------- //
//      Initialisation de la base de données.     //
//      Insertion des rôles                       //
// ---------------------------------------------- //
function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });

    Room.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            participants = User.find(
                {
                    username: { $in: ['aurellandry', 'test_user'] }
                },
                (err, participants) => {
                    if(err){
                        console.log("ERROR : " + err)
                    }
                    else {
                        new Room({
                            name: "",
                            users: [
                                {
                                    id: participants[0]._id,
                                    username: participants[0].username,
                                    name: participants[0].name,
                                    first_name: participants[0].first_name,
                                    email: participants[0].email
                                },
                                {
                                    id: participants[1]._id,
                                    username: participants[1].username,
                                    name: participants[1].name,
                                    first_name: participants[1].first_name,
                                    email: participants[1].email
                                }
                            ],
                            messages: []
                        }).save(err => {
                            if (err) {
                                console.log("error", err);
                            }
            
                            console.log("Room 'aurel / test' created!");
                        });
                    }
                }
            );

            
        }
    });
}

// ---------------- //
//      ROUTES      //
// ---------------- //
require('./app/routes/auth.routes')(app);
require('./app/routes/room.routes')(app);
require('./app/routes/message.routes')(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

var users_ws = [];

// ------------------- //
//      WEBSOCKET      //
// ------------------- //
wss.on('connection', function connection(ws, request, client) {
    const urlParams = new URL(request.headers.origin+request.url);
    const user_id = urlParams.searchParams.get('id');
    if(user_id && !users_ws[user_id]) {
        users_ws[user_id] = ws;
        console.log(`WebSocket ${user_id} enregistrée !`);
    }

    ws.on('message', function message(message) {
        var msg = JSON.parse(message);
        console.log(`Message "${msg.text}" reçu de l'utilisateur ${user_id} pour ${msg.receiver}`);
        if(users_ws[msg.receiver]) {
            console.log(`Envoi du message à l'utilisateur ${msg.receiver}.`);
            // Envoi du message au receveur via sa websocket
            users_ws[msg.receiver].send(JSON.stringify(msg));
        }
    }); 

    ws.on("error", function(error) {
        // Manage error here
        console.log(error);
    });

    ws.on('close', () => {
        console.log('Connexion lost with user : ' + user_id);
        users_ws[user_id] = undefined;
    });
});

wss.on('close', (ws, request, client) => {
    const urlParams = new URL(request.headers.origin+request.url);
    const user_id = urlParams.searchParams.get('id');

    console.log(`Closing socket for user ${user_id}`);
    users_ws[user_id] = undefined;
});
