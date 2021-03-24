import config from '../../config';
import states from '../States/states';

const initialState = { messages: [] }

function updateMessages(state = initialState, action) {
    let nextState;
    switch (action.type) {
        case states.ADD_MESSAGE:
            nextState = {
                ...state,
                messages: [
                    ...state.messages,
                    action.payload
                ]
            }

            config.debug && console.log(nextState);

            return nextState;
        case states.SET_MESSAGES:
            nextState = {
                ...state,
                messages: [...action.payload]
            }

            return nextState;
    default:
        return state;
    }
}

export default updateMessages;