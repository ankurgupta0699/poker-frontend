import { arrivalAtWelcomePage, departFromWelcomePage } from '../constants/actionTypes';

const initialState = {
    atWelcome: true
};

const navbar = (state=initialState, action) => {
    switch(action.type) {
        case departFromWelcomePage:
            return {
                atWelcome: false
            };
        case arrivalAtWelcomePage:
            return {
                atWelcome: true,
            };
        default:
            return state;
    }
};

export default navbar;
