import React, {useEffect, useState} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message/index';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import config from '../../config';
import states from '../../Store/States/states';

import './MessageList.css';

const MY_USER_ID = sessionStorage.getItem("user.id");
const websocket  = new WebSocket(`${config.wsHost}/?id=${sessionStorage.getItem("user.id")}`);

function MessageList(props) {
    const [timeout, setTimeout] = useState();
    const [ws, setWs]           = useState(websocket);
    
    useEffect(() => {
        connectWs(ws);
        return () => {
            ws.close();
            setWs(websocket);
        }
    }, [ws]);

    const dispatchMessage = (message) => {
        var msg = {
            id: props.messages.length+1,
            author: message.created_by,
            message: message.text,
            timestamp: (new Date(message.created_at)).getTime()
        }

        const action = { type: states.ADD_MESSAGE, payload: msg }
        props.dispatch(action);
    }

    const waitForOpenConnection = (socket) => {
        return new Promise((resolve, reject) => {
            const maxNumberOfAttempts = 10
            const intervalTime = 200 //ms
    
            let currentAttempt = 0
            const interval = setInterval(() => {
                if (currentAttempt > maxNumberOfAttempts - 1) {
                    clearInterval(interval)
                    reject(new Error('Maximum number of attempts exceeded'))
                } else if (socket.readyState === socket.OPEN) {
                    clearInterval(interval)
                    resolve()
                }
                currentAttempt++
            }, intervalTime)
        })
    }
    
    const sendMessage = async (socket, msg) => {
        config.debug && console.log(socket.readyState);

        if (socket.readyState !== socket.OPEN) {
            try {
                await waitForOpenConnection(socket);
                socket.send(msg);
            } catch (err) { config.debug && console.error(err) }
        } else {
            socket.send(msg);
        }
    }

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    const connectWs = (ws) => {
        var connectInterval;
        if(sessionStorage.getItem("user.id")) {
            //ws = new WebSocket(`${config.wsHost}/?id=${sessionStorage.getItem("user.id")}`);
            config.debug && console.log("Tentative de connexion avec le serveur...");

            // OnOpen Listener
            ws.onopen = () => {
                config.debug && console.log("Connexion avec le serveur réussie.");

                setTimeout(250); // reset timer to 250 on open of websocket connection 
                clearTimeout(connectInterval); // clear Interval on on open of websocket connection
            };

            // OnClose Listenener
            ws.onclose = e => {
                config.debug && console.log(
                    `Connexion perdue avec le serveur... Nouvelle tentative de connexion dans ${Math.min(
                        10000 / 1000,
                        (timeout + timeout) / 1000
                    )} seconde(s).`,
                    e.reason
                );

                setTimeout(timeout + timeout); //increment retry interval
                connectInterval = setTimeout(check(ws), Math.min(10000, timeout)); //call check function after timeout
            };

            // OnMessage Listener
            ws.onmessage = msg => {
                config.debug && console.log("Nouveau message socket: ", JSON.parse(msg.data));
                dispatchMessage(JSON.parse(msg.data));
            };

            // OnError Listener
            ws.onerror = err => {
                config.debug && console.error(
                    "Erreur WS : ",
                    err.message,
                    "Fermeture de la socket !"
                );

                ws.close();
            };

        }

    };

    /**
     * Vérifier si la connexion websocket est fermée, et retenter une connexion le cas échéant
     */
    const check = (ws) => {
        if (!ws || ws.readyState === WebSocket.CLOSED) connectWs(ws); //check if websocket instance is closed, if so call `connect` function.
    };


    /**
     * Gestionnaire d'envoi de messages
     */
    const handleSubmitMsg = (event) => {
        event.preventDefault();

        if(sessionStorage.getItem("receiver") && event.target.msg_text.value !== ""){
            var msg = {
                text: event.target.msg_text.value,
                created_by: sessionStorage.getItem("user.id"),
                sender_username: sessionStorage.getItem("user.username"),
                receiver: sessionStorage.getItem("receiver"),
                created_at: Date.now()
            };

            // Envoi du message au destinataire
            sendMessage(ws, JSON.stringify(msg));
            dispatchMessage(msg);
            event.target.msg_text.value = "";

            // Enregistrement du message en base de données
            axios.post(`${config.host}/room/messages/create`, 
                {
                    "user_id": sessionStorage.getItem("user.id"),
                    "room_id": props.currentRoom.id,
                    "message": msg.text,
                    "created_at": (new Date(msg.created_at)).getTime()
                },
                {
                    headers: {
                        "X-ACCESS-TOKEN": sessionStorage.getItem("token"),
                        "Content-Type": "application/json",
                    }
            }).then(response => {
                config.debug && console.log(response);
            });
        }
    }

    const renderMessages = () => {
        let i = 0;
        let messages = props.messages;
        let messageCount = messages.length;
        let tempMessages = [];

        while (i < messageCount) {
            let previous = messages[i - 1];
            let current = messages[i];
            let next = messages[i + 1];
            let isMine = current.author === MY_USER_ID;
            let currentMoment = moment(current.timestamp);
            let prevBySameAuthor = false;
            let nextBySameAuthor = false;
            let startsSequence = true;
            let endsSequence = true;
            let showTimestamp = true;

            if (previous) {
                let previousMoment = moment(previous.timestamp);
                let previousDuration = moment.duration(currentMoment.diff(previousMoment));
                prevBySameAuthor = previous.author === current.author;
                
                if (prevBySameAuthor && previousDuration.as('hours') < 1) {
                    startsSequence = false;
                }

                if (previousDuration.as('hours') < 1) {
                    showTimestamp = false;
                }
            }

            if (next) {
                let nextMoment = moment(next.timestamp);
                let nextDuration = moment.duration(nextMoment.diff(currentMoment));
                nextBySameAuthor = next.author === current.author;

                if (nextBySameAuthor && nextDuration.as('hours') < 1) {
                    endsSequence = false;
                }
            }

            tempMessages.push(
                <Message
                    key={i}
                    isMine={isMine}
                    startsSequence={startsSequence}
                    endsSequence={endsSequence}
                    showTimestamp={showTimestamp}
                    data={current}
                />
            );

            
            i += 1;
        }

        return tempMessages;
    }

    return(
        <div className="message-list">
            <Toolbar
                title={props.currentRoom.name ?? "Sélectionnez une discussion"}
                rightItems={[
                    /*<ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
                    <ToolbarButton key="video" icon="ion-ios-videocam" />,
                    <ToolbarButton key="phone" icon="ion-ios-call" />*/
                ]}
            />

            <div className="message-list-container">{renderMessages()}</div>

            <Compose handleSubmitMsg={handleSubmitMsg} rightItems={[
                <ToolbarButton key="photo" type="submit" icon="ion-send" />
            ]}/>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        messages: state.messageReducer.messages,
        currentRoom: state.conversationReducer.currentRoom
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);