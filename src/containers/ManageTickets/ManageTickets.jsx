import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';

import './ManageTickets.css';
import ManageTicketItems from './ManageTicketItems';
import { errorMessage, resetAlert } from "actions/alert";
import { JIRA_TICKETS } from 'actions/jira';
import ErrorAlert from 'components/Alert/ErrorAlert';
import SuccessAlert from 'components/Alert/SuccessAlert';
import { attributesMsg, AUTH_MESSAGES, toastErrorMsg } from "constants/messages";
import { BACKEND_URLS, JIRA_URLS, urls } from "constants/urls";
import { FETCH_TICKETS_METHOD } from 'constants/values';
import { validIntegerList } from 'utils/validators';


const ManageTickets = (props) => {
    const { resetAlert, errorAlert, match: { params: { id } }, ticketActions, backendTickets, ticketsUpdateSuccessAlert, savedJiraTickets, jiraTicketWarnings } = props;

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userJiraToken = JSON.parse(localStorage.getItem("userJiraToken"));
    const history = useHistory();
    const { addToast } = useToasts();

    useEffect(() => {
        resetAlert();
        handleLoadTickets();
    }, []);

    useEffect(() => {
        if (!currentUser) {
            history.push(urls.root);
        }
    }, [currentUser]);

    useEffect(() => {
        // console.log(backendTickets);
        backendTickets && handleFetchIssues();
    }, [backendTickets]);

    useEffect(() => {
        console.log(savedJiraTickets);
    }, [savedJiraTickets]);

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

    const handleLoadTickets = () => {
        const requestConfig = {
            method: 'GET',
            url: BACKEND_URLS.JIRA_TICKETS_BY_POKERBOARD_ID(id),
        };

        const actionInitial = JIRA_TICKETS.INITIALISE_LOAD
        const actionSuccess = JIRA_TICKETS.SUCCESS_LOAD;
        const actionFail = JIRA_TICKETS.FAILED_LOAD;
        ticketActions(requestConfig, actionInitial, actionSuccess, actionFail);
    }

    const handleFetchIssues = (event) => {
        resetAlert();
        let ticketIDs = [];
        backendTickets.forEach(ticket => {
            ticketIDs.push(ticket.ticket_id);
        })

        const requestConfig = {
            method: 'GET',
            url: JIRA_URLS.FETCH_ISSUE_BY_ID("ankurguptajtg", ticketIDs),
            withCredentials: true,
            auth: {
                username: currentUser.email,
                password: userJiraToken.jira_token
            }
        };

        const actionInitial = JIRA_TICKETS.INITIALISE_SAVED_FETCH
        const actionSuccess = JIRA_TICKETS.SUCCESS_SAVED_FETCH;
        const actionFail = JIRA_TICKETS.FAILED_SAVED_FETCH;
        ticketActions(requestConfig, actionInitial, actionSuccess, actionFail);
    }

    const handleUpdateJiraTickets = () => {
        resetAlert();
        // let dataList = [];
        // jiraTickets.forEach(ticket => {
        //     dataList.push({
        //         "ticket_id": parseInt(ticket.id),
        //         "pokerboard": parseInt(id)
        //     });
        // });

        // // console.log(dataList);
        // const requestConfig = {
        //     method: 'patch',
        //     url: `${BACKEND_URLS.JIRA_TICKET}`,
        //     data: dataList,
        // };
        // const actionInitial = JIRA_TICKETS.INITIALISE_SAVE;
        // const actionSuccess = JIRA_TICKETS.SUCCESS_SAVE;
        // const actionFail = JIRA_TICKETS.FAILED_SAVE;
        // ticketActions(requestConfig, actionInitial, actionSuccess, actionFail, "Error! Either some tickets already exist or some other problem occured.");
    }

    return (
        <div className="manage-tickets fetch-jira-tickets content-flex-column">
            <header>Manage Tickets</header>

            {
                savedJiraTickets &&
                <div className="backend-ticket-items content-flex-column">
                    {savedJiraTickets.map(ticket => <ManageTicketItems ticket={ticket} key={ticket.id} pokerboardId={id} />)}
                </div>
            }

            {
                savedJiraTickets && savedJiraTickets.length > 0 &&
                <button className="button" onClick={handleUpdateJiraTickets}>
                    Update Order
                </button>
            }

            {errorAlert && <ErrorAlert alert={errorAlert} />}
            {ticketsUpdateSuccessAlert && <SuccessAlert alert="Tickets Saved!" />}

        </div>
    );
};

const mapStateToProps = (state) => ({
    errorAlert: state.alertReducer.alert,
    backendTickets: state.jira.backendTickets,
    savedJiraTickets: state.jira.savedJiraTickets,
    jiraTicketWarnings: state.jira.jiraTicketWarnings,
    ticketsUpdateSuccessAlert: state.successAlert.backendTicketsUpdated,
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageTickets);
