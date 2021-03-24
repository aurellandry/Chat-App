import { combineReducers, createStore } from 'redux';
import messageReducer from './Reducers/messageReducer';
import conversationReducer from './Reducers/conversationReducer';
import wsReducer from './Reducers/wsReducer';
import config from '../config';

function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch(e) {
        config.debug && console.error(e);
    }
}

function loadState() {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch(e) {
        config.debug && console.error(e);
        return undefined;
    }
}

const rootReducer = combineReducers({
    messageReducer,
    conversationReducer,
    wsReducer
});

const persistedState = loadState();

const store = createStore(rootReducer, persistedState);

store.subscribe(() => saveState(store.getState()));

export default store;