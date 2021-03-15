const initialState = { messages: [] }

function updateMessages(state = initialState, action) {
    let nextState;
    switch (action.type) {
        case 'ADD_MESSAGE':
            nextState = {
                ...state,
                messages: [
                    ...state.messages,
                    action.payload
                ]
            }

            console.log(nextState);

            return nextState;
        case 'SET_MESSAGES':
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