import { JIRA_TICKETS, JIRA_TOKEN } from "actions/jira";


const InitialState = {
    userJiraToken: null,
    jiraCurrentUser: null,
    jiraTickets: [],
    ticketIdSet: new Set(),
    jiraTicketWarnings: null,
    backendTickets: null,
    savedJiraTickets: [],
    // savedTicketIdSet: new Set(),
};

const jira = (state = InitialState, action) => {
    switch (action.type) {
        case JIRA_TOKEN.SUCCESS_LOAD:
            return {
                ...state,
                userJiraToken: action.payload[0],
            };
        case JIRA_TOKEN.SUCCESS_SAVE:
        case JIRA_TOKEN.SUCCESS_UPDATE:
            return {
                ...state,
                userJiraToken: action.payload,
            };
        case JIRA_TOKEN.SUCCESS_VERIFY:
            return {
                ...state,
                jiraCurrentUser: action.payload,
            };
        case JIRA_TICKETS.SUCCESS_FETCH:
            const union = (setA, setB) => setB.forEach(issue => setA.add(issue.id)) || setA;

            let newJiraTickets = [...state.jiraTickets];
            action.payload.issues.forEach(issue => !state.ticketIdSet.has(issue.id) && newJiraTickets.push(issue));

            return {
                ...state,
                jiraTickets: newJiraTickets,
                ticketIdSet: union(new Set(state.ticketIdSet), new Set(action.payload.issues)),
                jiraTicketWarnings: action.payload.warningMessages,
            };
        case JIRA_TICKETS.REMOVE_TICKET:
            const newTicketIdSet = new Set(state.ticketIdSet);
            newTicketIdSet.delete(action.payload);
            return {
                ...state,
                jiraTickets: state.jiraTickets.filter(ticket => ticket.id!=action.payload),
                ticketIdSet: newTicketIdSet,
            };
        case JIRA_TICKETS.SUCCESS_SAVE:
            return {
                ...state,
                jiraTickets: [],
                ticketIdSet: new Set(),
                jiraTicketWarnings: null,
            }
        case JIRA_TICKETS.SUCCESS_LOAD:
            return {
                ...state,
                backendTickets: action.payload,
            }
        case JIRA_TICKETS.SUCCESS_SAVED_FETCH:
            // const union1 = (setA, setB) => setB.forEach(issue => setA.add(issue.id)) || setA;

            // let newSavedJiraTickets = [...state.savedJiraTickets];
            // action.payload.issues.forEach(issue => !state.savedTicketIdSet.has(issue.id) && newSavedJiraTickets.push(issue));

            return {
                ...state,
                // savedJiraTickets: newSavedJiraTickets,
                savedJiraTickets: action.payload.issues,
                // savedTicketIdSet: union(new Set(state.savedTicketIdSet), new Set(action.payload.issues)),
                jiraTicketWarnings: action.payload.warningMessages,
            };
        case JIRA_TICKETS.SUCCESS_DELETE:
            // const TicketIdSetAfterDelete = new Set(state.savedTicketIdSet);
            // TicketIdSetAfterDelete.delete(action.payload);
            return {
                ...state,
                savedJiraTickets: state.savedJiraTickets.filter(ticket => ticket.id!=action.payload),
                // savedTicketIdSet: TicketIdSetAfterDelete,
            };
        default:
            return state;
    };
};

export default jira;
