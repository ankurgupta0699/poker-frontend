import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from 'reducers/index';


const configureStore = () => {
    /*
        created a store using an initial reducer state
        and passing middlewares :
        thunk : to call the action creators that return a function(thunk) which takes the store’s dispatch method as the argument and use it to dispatch the actions.
        logger : which logs actions in developer console
    */
    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, logger)));
    return store;
};

export default configureStore;
