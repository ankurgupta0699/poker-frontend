import axios from "axios";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import './Invites.css';
import { errorMessage } from "actions/alert";
import { POKER_INVITES_ACTION } from "actions/pokerboardInvites";
import { AUTH_MESSAGES } from "constants/messages";
import { BACKEND_URLS, urls } from "constants/urls";
import { GROUP_INVITATION_STATUS, GROUP_INVITE_STATUS, USER_ROLE1 } from "constants/values";


const PokerboardInviteItems = (props) => {
    // 'id' below is the pokerboard invitation id.
    const { id, user, status, role, pokerboard, verification, current_user, pokerInviteUserActions } = props;
    const history = useHistory();

    useEffect(() => {
        if (!current_user) {
            history.push(urls.root);
        }
    }, [current_user]);

    // if Invite is sent, then isInviteSent will be true; else if received, it will be false
    const isInviteSent = current_user && (pokerboard.manager.id == current_user.id);

    const acceptClickHandler = (event) => {
        event.preventDefault();
        pokerInviteUserActions(id, { status: GROUP_INVITATION_STATUS.ACCEPTED }, POKER_INVITES_ACTION.ACCEPT);
    };

    const declineClickHandler = (event) => {
        event.preventDefault();
        pokerInviteUserActions(id, { status: GROUP_INVITATION_STATUS.DECLINED }, POKER_INVITES_ACTION.DECLINE);
    };

    const cancelClickHandler = (event) => {
        event.preventDefault();
        pokerInviteUserActions(id, { status: GROUP_INVITATION_STATUS.CANCELLED }, POKER_INVITES_ACTION.CANCEL);
    };

    return (
        <div className="poker-invites owned-group-item">
            <div className="poker-invite-name owned-group-title">{pokerboard.name}</div>

            <div className="poker-invite-status">{GROUP_INVITE_STATUS[status]}</div>

            <div className="poker-invite-user">
                <div>{isInviteSent ? "Invitee" : "Invitor"}</div>
                <div>{isInviteSent ? verification.email : pokerboard.manager.email}</div>
            </div>

            <div className="poker-invite-bottom">
                <div className="poker-invite-role">{USER_ROLE1[role]}</div>
                {
                    status === GROUP_INVITATION_STATUS.PENDING && (
                        <div className="poker-invite-action-buttons">
                            {
                                isInviteSent
                                    ?
                                    <button className="button" onClick={cancelClickHandler}>Cancel</button>
                                    :
                                    <div>
                                        <button className="button" onClick={acceptClickHandler}>Accept</button>
                                        <button className="button" onClick={declineClickHandler}>Decline</button>
                                    </div>
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    pokerInviteUserActions: (pokerInviteID, body, actionType) => {
        const url = BACKEND_URLS.POKER_INVITE_ID_URL(pokerInviteID);
        axios.patch(url, body).then((res) => {
            dispatch({
                type: actionType,
                payload: res.data
            });
        }).catch((err) => {
            dispatch(errorMessage(AUTH_MESSAGES.SOMETHING_WENT_WRONG));
        });
    },
});

export default connect(null, mapDispatchToProps)(PokerboardInviteItems);
