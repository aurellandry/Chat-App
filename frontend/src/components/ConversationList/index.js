import React, {useEffect} from 'react';
import ConversationSearch from '../ConversationSearch/index';
import ConversationListItem from '../ConversationListItem/index';
import Toolbar from '../Toolbar/index';
import ToolbarButton from '../ToolbarButton/index';
import axios from 'axios';
import { connect } from 'react-redux';
import config from '../../config';
import states from '../../Store/States/states';

import './ConversationList.css';

function ConversationList(props) {
    useEffect(() => {
        getConversations();
    }, [props.messages]);

    const setMessages = (messages) => {
        var msgArray = [];

        messages.forEach(element => {
            var msg = {
                id: props.messages.length+1,
                author: element.created_by,
                message: element.text,
                timestamp: (new Date(element.created_at)).getTime()
            }

            msgArray.push(msg);
        });

        const action = { type: states.SET_MESSAGES, payload: msgArray }
        props.dispatch(action);
    }

    const setConversations = (rooms) => {
        const action = { type: states.SET_ROOMS, payload: rooms }
        props.dispatch(action);
    }

    const handleConvClick = (conv_id, recv_id) => {
        sessionStorage.setItem("receiver", recv_id);
        var currentRoom;
        props.rooms.forEach((room) => {
            if(room.id === conv_id) {
                currentRoom = room;
                return;
            };
        });

        props.dispatch({ type: states.SET_CURRENT_ROOM, payload: currentRoom });
        setMessages(currentRoom.messages);
    }

    const getRoomName = (room) => {
        var userId = sessionStorage.getItem("user.id");
        if(room.name === "") {
            return (room.users[0].id === userId) ? `${room.users[1].first_name} ${room.users[1].name}` : `${room.users[0].first_name} ${room.users[0].name}`
        }

        return room.name;
    }

    const getConversations = () => {
        var currUserId = sessionStorage.getItem("user.id");

        axios.get(`http://${config.host}/room`, {
            params: {
                "user_id": sessionStorage.getItem("user.id")
            },
            headers: {
                "Content-Type": "application/json",
                "x-access-token": sessionStorage.getItem("token")
            }
        }).then(response => {
            let newConversations = response.data.rooms.map(result => {
                return {
                    id: result._id,
                    receiver: (result.users[0].id === currUserId) ? result.users[1].id : result.users[0].id,
                    photo: "https://randomuser.me/api/portraits/men/31.jpg",
                    name: getRoomName(result),
                    text: (result.messages.length > 0) ? result.messages[result.messages.length - 1].text : "",
                    messages: [...result.messages]
                }
            });

            setConversations(newConversations);
        });
    }

    return (
        <div className="conversation-list">
            <Toolbar
                title="Messenger"
                leftItems={[
                    <ToolbarButton key="cog" icon="ion-ios-cog" />
                ]}
                rightItems={[
                    <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
                ]}
            />
            <ConversationSearch />
            {
                props.rooms.map(conversation =>
                    <ConversationListItem
                        key={conversation.name}
                        data={conversation}
                        onClick={() => handleConvClick(conversation.id, conversation.receiver)}
                    />
                )
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        messages: state.messageReducer.messages,
        rooms: state.conversationReducer.rooms
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationList);