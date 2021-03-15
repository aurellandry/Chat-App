import { combineReducers, createStore } from 'redux';
import messageReducer from './Reducers/messageReducer';
import conversationReducer from './Reducers/conversationReducer';

function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch(e) {
        console.error(e);
    }
}

function loadState() {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch(e) {
        console.error(e);
        return undefined;
    }
}

const rootReducer = combineReducers({
    messageReducer,
    conversationReducer
});

const persistedState = loadState();

const store = createStore(rootReducer, persistedState);

store.subscribe(() => saveState(store.getState()));

export default store;