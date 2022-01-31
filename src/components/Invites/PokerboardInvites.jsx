import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import './Invites.css';
import PokerboardInviteItems from './PokerboardInviteItems';
import { errorMessage, resetAlert } from "actions/alert";
import { POKER_INVITES_ACTION } from "actions/pokerboardInvites";
import { BACKEND_URLS, BASE_URL, urls } from "constants/urls";
import { GROUP_INVITATION_STATUS, POKER_INVITES_CATEGORY, POKER_INVITES_SUBCATEGORY } from "constants/values";


const PokerboardInvites = (props) => {
    const { loadPokerboardInvites, alert, resetAlert, pokerInvitesData } = props;
    const [invitesCategory, setInvitesCategory] = useState(POKER_INVITES_CATEGORY.ALL);
    const [invitesSubcategory, setInvitesSubcategory] = useState(POKER_INVITES_SUBCATEGORY.ALL);
    const [filteredPokerInvitesData, setFilteredPokerInvitesData] = useState(pokerInvitesData);

    const history = useHistory();
    const current_user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        resetAlert();

        const url = `${BASE_URL}${BACKEND_URLS.POKER_INVITES}`;
        const successAction = POKER_INVITES_ACTION.SUCCESS;
        const errorAction = errorMessage(POKER_INVITES_ACTION.FAILED);
        loadPokerboardInvites(url, successAction, errorAction);
    }, []);

    useEffect(() => {
        if (!current_user) {
            history.push(urls.root);
        }
    }, [current_user]);

    useEffect(() => {
        setFilteredPokerInvitesData(filterData(pokerInvitesData));
    }, [pokerInvitesData, invitesCategory, invitesSubcategory]);


    const filterData = (pokerInvitesData) => {
        switch (invitesCategory) {
            case POKER_INVITES_CATEGORY.ALL:
                return pokerInvitesData;

            case POKER_INVITES_CATEGORY.SENT:
                const subcategoryData = pokerInvitesData.filter((data) => data.pokerboard.manager.id == current_user.id);
                switch (invitesSubcategory) {
                    case POKER_INVITES_SUBCATEGORY.ALL:
                        return subcategoryData;
                    case POKER_INVITES_SUBCATEGORY.PENDING:
                        return subcategoryData.filter((data) => data.status == GROUP_INVITATION_STATUS.PENDING);
                    case POKER_INVITES_SUBCATEGORY.ACCEPTED:
                        return subcategoryData.filter((data) => data.status == GROUP_INVITATION_STATUS.ACCEPTED);
                    case POKER_INVITES_SUBCATEGORY.CANCELLED:
                        return subcategoryData.filter((data) => data.status == GROUP_INVITATION_STATUS.CANCELLED);
                    default:
                        return;
                }
            case POKER_INVITES_CATEGORY.RECEIVED:
                const subcategoryData2 = pokerInvitesData.filter((data) => data.pokerboard.manager.id != current_user.id);
                switch (invitesSubcategory) {
                    case POKER_INVITES_SUBCATEGORY.ALL:
                        return subcategoryData2;
                    case POKER_INVITES_SUBCATEGORY.PENDING:
                        return subcategoryData2.filter((data) => data.status == GROUP_INVITATION_STATUS.PENDING);
                    case POKER_INVITES_SUBCATEGORY.ACCEPTED:
                        return subcategoryData2.filter((data) => data.status == GROUP_INVITATION_STATUS.ACCEPTED);
                    case POKER_INVITES_SUBCATEGORY.DECLINED:
                        return subcategoryData2.filter((data) => data.status == GROUP_INVITATION_STATUS.DECLINED);
                    default:
                        return;
                }

            default:
                return pokerInvitesData;
        }
    };

    const handleInvitesCategory = (event) => {
        setInvitesCategory(event.target.value);
    };

    const handleInvitesSubcategory = (event) => {
        setInvitesSubcategory(event.target.value);
    };

    return (
        <div className="pokerboard-invites owned-groups">
            <h2>Pokerboard Invitations</h2>

            <select
                className="invites-category input"
                name="invites-category"
                value={invitesCategory}
                onChange={handleInvitesCategory}
            >
                <option value={POKER_INVITES_CATEGORY.ALL}>All</option>
                <option value={POKER_INVITES_CATEGORY.SENT}>Sent</option>
                <option value={POKER_INVITES_CATEGORY.RECEIVED}>Received</option>
            </select>

            {
                invitesCategory != POKER_INVITES_CATEGORY.ALL && (
                    <form className="invites-subcategory" onInput={handleInvitesSubcategory}>
                        <label>
                            <input
                                type="radio"
                                name="poker-invite-subcategory"
                                value={POKER_INVITES_SUBCATEGORY.ALL}
                                className="poker-invite-subcategory-all"
                                defaultChecked
                            />
                            All
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="poker-invite-subcategory"
                                value={POKER_INVITES_SUBCATEGORY.PENDING}
                            />
                            Pending
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="poker-invite-subcategory"
                                value={POKER_INVITES_SUBCATEGORY.ACCEPTED}

                            />
                            Accepted
                        </label>
                        {
                            invitesCategory == POKER_INVITES_CATEGORY.SENT
                                ?
                                <label>
                                    <input
                                        type="radio"
                                        name="poker-invite-subcategory"
                                        value={POKER_INVITES_SUBCATEGORY.CANCELLED}
                                    />
                                    Cancelled
                                </label>
                                :
                                <label>
                                    <input
                                        type="radio"
                                        name="poker-invite-subcategory"
                                        value={POKER_INVITES_SUBCATEGORY.DECLINED}
                                    />
                                    Declined
                                </label>
                        }
                    </form>
                )
            }

            {
                (filteredPokerInvitesData && filteredPokerInvitesData.length != 0)
                    ?
                    <div>
                        <h3>Items: {filteredPokerInvitesData.length}</h3>
                        {
                            filteredPokerInvitesData.map((data) =>
                                <PokerboardInviteItems {...data} current_user={current_user} key={data.id} />)
                        }
                    </div>
                    :
                    <p className="error-msg">No Invites</p>

            }
            {alert && <h3 className="error-msg">{alert}</h3>}
        </div>
    );
};

const mapStateToProps = (state) => ({
    alert: state.alertReducer.alert,
    pokerInvitesData: state.pokerboardInvites.pokerInvitesData,
});

const mapDispatchToProps = (dispatch) => ({
    resetAlert: () => {
        dispatch(resetAlert());
    },
    loadPokerboardInvites: (url, successAction, errorAction) => {
        axios.get(url)
            .then((res) => {
                dispatch({
                    type: successAction,
                    payload: res.data,
                });
            })
            .catch((err) =>
                dispatch(errorAction)
            );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PokerboardInvites);
