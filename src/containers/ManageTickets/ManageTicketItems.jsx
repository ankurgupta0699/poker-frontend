import { faCaretSquareDown, faCaretSquareUp, faLongArrowAltDown, faLongArrowAltUp, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import './ManageTickets.css';
import { JIRA_TICKETS } from 'actions/jira';
import { AUTH_MESSAGES } from 'constants/messages';
import { BACKEND_URLS, urls } from "constants/urls";


const ManageTicketItems = (props) => {
    const { ticket, pokerboardId, ticketActions } = props;

    const history = useHistory();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!currentUser) {
            history.push(urls.root);
        }
    }, [currentUser]);

    const handleDeleteTicket = (event) => {
        // removeTicket(ticket.id);
        const requestConfig = {
            method: 'DELETE',
            url: BACKEND_URLS.JIRA_TICKETS_BY_JIRA_TICKET_ID(pokerboardId, ticket.id),
        };
        const actionInitial = JIRA_TICKETS.INITIALISE_DELETE;
        const actionSuccess = JIRA_TICKETS.SUCCESS_DELETE;
        const actionFail = JIRA_TICKETS.FAILED_DELETE;
        ticketActions(requestConfig, actionInitial, actionSuccess, actionFail, ticket.id);
    }

    return (
        <div className="manage-ticket-item content-flex-row">
            <div className="jira-ticket card">
                <div className="top-row">
                    <div className="ticket-id">{ticket.id}</div>
                    <button className="font-awesome-button" onClick={handleDeleteTicket}>
                        <FontAwesomeIcon icon={faTrashAlt} size="2x" title="Remove" />
                    </button>
                </div>
                <div className="ticket-summary">{ticket.fields.summary}</div>
                <div className="bottom-row">
                    <div className="ticket-description">
                        <div className="header">Description</div>
                        {ticket.fields.description}
                    </div>
                    <div className="ticket-status">
                        <div className="header">Status</div>
                        {ticket.fields.status.name}
                    </div>
                </div>
            </div>
            <div className="ticket-order">
                <div className="content-flex-column">
                    <button className="font-awesome-button">
                        <FontAwesomeIcon icon={faCaretSquareUp} size="2x" title="Move-up" />
                    </button>
                    <button className="font-awesome-button">
                        <FontAwesomeIcon icon={faCaretSquareDown} size="2x" title="Move-down" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    ticketActions: (requestConfig, actionInitial, actionSuccess, actionFail, ticketId, errorMsg = "") => {
        dispatch({
            type: actionInitial,
        });
        axios(requestConfig)
            .then((res) => {
                dispatch({
                    type: actionSuccess,
                    payload: ticketId,
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

export default connect(null, mapDispatchToProps)(ManageTicketItems);
