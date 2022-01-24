import { JIRA_TICKETS, JIRA_TOKEN } from "actions/jira";
import { ALERT_TYPES } from "constants/actionTypes";

const initialState = {
    jiraTokenSave: false,
    jiraTicketsSave: false,
    backendTicketsUpdated: false,
};

const alertReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALERT_TYPES.RESET_ALERT:
            return {
                initialState
            }
        case JIRA_TOKEN.SUCCESS_SAVE:
        case JIRA_TOKEN.SUCCESS_UPDATE:
            return {
                ...state,
                jiraTokenSave: true,
            };
        case JIRA_TOKEN.FAILED_UPDATE:
        case JIRA_TOKEN.FAILED_SAVE:
            return {
                ...state,
                jiraTokenSave: false,
            };
        case JIRA_TICKETS.SUCCESS_SAVE:
            return {
                ...state,
                jiraTicketsSave: true,
            };
        case JIRA_TICKETS.FAILED_SAVE:
            return {
                ...state,
                jiraTicketsSave: false,
            };
        default:
            return state;
    }
};

export default alertReducer;