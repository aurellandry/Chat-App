import config from '../../config';
import states from '../States/states';

const initialState = { rooms: [], currentRoom: "" }

function updateConversations(state = initialState, action) {
    let nextState;
    switch (action.type) {
        case states.ADD_ROOM:
            nextState = {
                ...state,
                rooms: [
                    ...state.rooms,
                    action.payload
                ]
            }

            config.debug && console.log(nextState);

            return nextState;
        case states.SET_ROOMS:
            nextState = {
                ...state,
                rooms: action.payload
            }

            return nextState;
        case states.SET_CURRENT_ROOM:
            nextState = {
                ...state,
                currentRoom: action.payload
            }

            return nextState;
    default:
        return state;
    }
}

export default updateConversations;