import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import './FetchJiraTickets.css';
import { JIRA_TICKETS } from 'actions/jira';
import { urls } from "constants/urls";


const FetchedJiraTicketItems = (props) => {
    const { ticket, ticketActions, removeTicket } = props;

    const history = useHistory();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!currentUser) {
            history.push(urls.root);
        }
    }, [currentUser]);

    const handleRemoveTicket = (event) => {
        event.preventDefault();
        removeTicket(ticket.id);
    }

    return (
        <div className="jira-ticket card">
            <div className="top-row">
                <div className="ticket-id">{ticket.id}</div>
                <button className="font-awesome-button" onClick={handleRemoveTicket}>
                    <FontAwesomeIcon icon={faEraser} size="2x" title="Remove" />
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
    );
};

const mapDispatchToProps = (dispatch) => ({
    removeTicket: (ticketId) => {
        dispatch({
            type: JIRA_TICKETS.REMOVE_TICKET,
            payload: ticketId,
        });
    },
});

export default connect(null, mapDispatchToProps)(FetchedJiraTicketItems);
