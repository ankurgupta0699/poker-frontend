import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';

import './FetchJiraTickets.css';
import FetchedJiraTicketItems from './FetchedJiraTicketItems';
import { errorMessage, resetAlert } from "actions/alert";
import { JIRA_TICKETS } from 'actions/jira';
import ErrorAlert from 'components/Alert/ErrorAlert';
import SuccessAlert from 'components/Alert/SuccessAlert';
import { attributesMsg, AUTH_MESSAGES, toastErrorMsg } from "constants/messages";
import { BACKEND_URLS, JIRA_URLS, urls } from "constants/urls";
import { FETCH_TICKETS_METHOD } from 'constants/values';
import { validIntegerList } from 'utils/validators';


const FetchJiraTickets = (props) => {
    const { resetAlert, errorAlert, match: { params: { id } }, ticketActions, jiraTickets, jiraTicketWarnings, ticketsSaveSuccessAlert } = props;
    const [domainName, setDomainName] = useState("ankurguptajtg");
    const [fetchTicketsMethod, setFetchTicktesMethod] = useState(FETCH_TICKETS_METHOD.ISSUE);
    const [ticketsInputField, setTicketsInputField] = useState("10003, 10009, 10005, 10002");

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userJiraToken = JSON.parse(localStorage.getItem("userJiraToken"));
    const history = useHistory();
    const { addToast } = useToasts();

    // console.log(id);

    useEffect(() => {
        resetAlert();
    }, []);

    useEffect(() => {
        if (!currentUser) {
            history.push(urls.root);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!userJiraToken) {
            history.push(urls.FETCH_JIRA_TOKEN);
            return addToast(toastErrorMsg.PROVIDE_JIRA_TOKEN, {
                appearance: "error",
                autoDismiss: true,
            });
        }
    }, [userJiraToken]);

    useEffect(() => {
        if (jiraTicketWarnings) {
            // console.log(jiraTickets.warningMessages);
            jiraTicketWarnings.map(warning =>
                addToast(warning, {
                    appearance: "info",
                    autoDismiss: true,
                })
            );
        }
    }, [jiraTicketWarnings]);
    // console.log(jiraTickets);

    const handleFetchIssues = (event) => {
        event.preventDefault();
        resetAlert();

        if (fetchTicketsMethod !== FETCH_TICKETS_METHOD.JQL) {
            if (!validIntegerList(ticketsInputField.split(',').map(Number))) {
                return addToast(toastErrorMsg.INVALID_INTEGER_LIST, {
                    appearance: "error",
                    autoDismiss: true,
                });
            }
        }

        let url;
        switch (fetchTicketsMethod) {
            case FETCH_TICKETS_METHOD.ISSUE:
                url = JIRA_URLS.FETCH_ISSUE_BY_ID(domainName, ticketsInputField);
                break;
            case FETCH_TICKETS_METHOD.SPRINT:
                url = JIRA_URLS.FETCH_ISSUE_BY_SPRINT(domainName, ticketsInputField);
                break;
            case FETCH_TICKETS_METHOD.JQL:
                url = JIRA_URLS.FETCH_ISSUE_BY_JQL(domainName, ticketsInputField);
                break;
            default:
                break;
        }

        const requestConfig = {
            method: 'GET',
            url: url,
            withCredentials: true,
            auth: {
                username: currentUser.email,
                password: userJiraToken.jira_token
            }
        };

        const actionInitial = JIRA_TICKETS.INITIALISE_FETCH
        const actionSuccess = JIRA_TICKETS.SUCCESS_FETCH;
        const actionFail = JIRA_TICKETS.FAILED_FETCH;
        ticketActions(requestConfig, actionInitial, actionSuccess, actionFail, "Query Failed! Please check input.");
    }

    const handleSaveJiraTickets = () => {
        resetAlert();
        let dataList = [];
        jiraTickets.forEach(ticket => {
            dataList.push({
                "ticket_id": parseInt(ticket.id),
                "pokerboard": parseInt(id)
            });
        });

        // console.log(dataList);
        const requestConfig = {
            method: 'post',
            url: BACKEND_URLS.JIRA_TICKET,
            data: dataList,
        };
        const actionInitial = JIRA_TICKETS.INITIALISE_SAVE;
        const actionSuccess = JIRA_TICKETS.SUCCESS_SAVE;
        const actionFail = JIRA_TICKETS.FAILED_SAVE;
        ticketActions(requestConfig, actionInitial, actionSuccess, actionFail, "Error! Either some tickets already exist or some other problem occured.");
    }

    return (
        <div className="fetch-jira-tickets content-flex-column">
            <header>Jira Tickets</header>
            <form onSubmit={handleFetchIssues}>
                <label>
                    <div>Domain-name * </div>
                    <input
                        className="input"
                        type="text"
                        placeholder={attributesMsg.JIRA_DOMAIN_NAME}
                        value={domainName}
                        onChange={(event) => {
                            setDomainName(event.target.value);
                        }}
                        required
                    />
                </label>
                <label>
                    Import Tickets by *
                    <select
                        className="input"
                        name="fetch-tickets-method"
                        value={fetchTicketsMethod}
                        onChange={(event) => {
                            setFetchTicktesMethod(event.target.value);
                        }}
                    >
                        <option value={FETCH_TICKETS_METHOD.ISSUE}>Issue IDs</option>
                        <option value={FETCH_TICKETS_METHOD.SPRINT}>Sprint IDs</option>
                        <option value={FETCH_TICKETS_METHOD.JQL}>JQL</option>
                    </select>
                </label>
                <label>
                    <div>
                        {
                            (() => {
                                switch (fetchTicketsMethod) {
                                    case FETCH_TICKETS_METHOD.ISSUE:
                                        return "Issue ID list *";
                                    case FETCH_TICKETS_METHOD.SPRINT:
                                        return "Sprint ID list *";
                                    case FETCH_TICKETS_METHOD.JQL:
                                        return "JQL *";
                                    default:
                                        break;
                                }
                            })()
                        }
                    </div>
                    <input
                        className="input"
                        type="text"
                        placeholder={
                            (() => {
                                switch (fetchTicketsMethod) {
                                    case FETCH_TICKETS_METHOD.ISSUE:
                                        return attributesMsg.ISSUE_ID_FIELD;
                                    case FETCH_TICKETS_METHOD.SPRINT:
                                        return attributesMsg.SPRINT_ID_FIELD;
                                    case FETCH_TICKETS_METHOD.JQL:
                                        return attributesMsg.JQL_FIELD;
                                    default:
                                        break;
                                }
                            })()
                        }
                        value={ticketsInputField}
                        onChange={(event) => {
                            setTicketsInputField(event.target.value);
                        }}
                        required
                    />
                </label>
                <button className="button" type="submit">Fetch</button>
            </form>

            {
                jiraTickets &&
                <div className="jira-ticket-items grid-container">
                    {jiraTickets.map(ticket => <FetchedJiraTicketItems ticket={ticket} key={ticket.id} />)}
                </div>
            }

            {
                jiraTickets && jiraTickets.length > 0 &&
                <button className="font-awesome-button" onClick={handleSaveJiraTickets}>
                    <FontAwesomeIcon icon={faSave} size="5x" title="Save" />
                </button>
            }

            {errorAlert && <ErrorAlert alert={errorAlert} />}
            {ticketsSaveSuccessAlert && <SuccessAlert alert="Tickets Saved!" />}

        </div>
    );
};

const mapStateToProps = (state) => ({
    errorAlert: state.alertReducer.alert,
    jiraTickets: state.jira.jiraTickets,
    jiraTicketWarnings: state.jira.jiraTicketWarnings,
    ticketsSaveSuccessAlert: state.successAlert.jiraTicketsSave,
});

const mapDispatchToProps = (dispatch) => ({
    resetAlert: () => {
        dispatch(resetAlert());
    },
    ticketActions: (requestConfig, actionInitial, actionSuccess, actionFail, errorMsg = "") => {
        dispatch({
            type: actionInitial,
        });
        axios(requestConfig)
            .then((res) => {
                dispatch({
                    type: actionSuccess,
                    payload: res.data,
                });
            })
            .catch((err) => {
                dispatch({
                    type: actionFail,
                });
                dispatch(errorMessage(errorMsg || AUTH_MESSAGES.SOMETHING_WENT_WRONG));
            });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FetchJiraTickets);
