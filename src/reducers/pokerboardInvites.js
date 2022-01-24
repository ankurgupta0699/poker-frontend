import { POKER_INVITES_ACTION } from "actions/pokerboardInvites";


const InitialState = {
    pokerInvitesData: [],
};

const pokerboardInvites = (state = InitialState, action) => {
    switch (action.type) {
        case POKER_INVITES_ACTION.SUCCESS:
            return {
                ...state,
                pokerInvitesData: action.payload,
            };
        case POKER_INVITES_ACTION.CANCEL:
        case POKER_INVITES_ACTION.ACCEPT:
        case POKER_INVITES_ACTION.DECLINE:
            const index = state.pokerInvitesData.findIndex(data => data.id === action.payload.id);
            state.pokerInvitesData.splice(index, 1);
            return {
                ...state,
                pokerInvitesData: [...state.pokerInvitesData, action.payload]
            };
        default:
            return state;
    };
};

export default pokerboardInvites;
