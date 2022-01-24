import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import PokerboardItems from "./PokerboardItems";
import { errorMessage, resetAlert } from "actions/alert";
import { POKERBOARD_TYPES } from "constants/actionTypes";
import { AUTH_MESSAGES } from "constants/messages";
import { BACKEND_URLS, BASE_URL, urls } from "constants/urls";
import { POKER_CATEGORY } from "constants/values";


const Pokerboards = (props) => {
    const { alert, loadPokerboard, pokerboards, resetAlert } = props;
    const [pokerCategory, setPokerCategory] = useState(POKER_CATEGORY.OWNED);
    const [filteredPokerboards, setFilteredPokerboards] = useState(pokerboards);

    const history = useHistory();
    const current_user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        resetAlert();
        handleReloadPokerboard();
    }, []);

    useEffect(() => {
        if (!current_user) {
            history.push(urls.root);
        }
    }, [current_user]);

    useEffect(() => {
        setFilteredPokerboards(filterData(pokerboards));
    }, [pokerboards, pokerCategory]);

    const handleReloadPokerboard = () => {
        const url = `${BASE_URL}${BACKEND_URLS.POKER_USERS}`;
        const action = POKERBOARD_TYPES.LOAD_SUCCESSFUL;
        loadPokerboard(url, action);
    }

    const filterData = (pokerboards) => {
        switch (pokerCategory) {
            case POKER_CATEGORY.ALL:
                return pokerboards;
            case POKER_CATEGORY.OWNED:
                return pokerboards.filter((data) => data.pokerboard.manager.id == current_user.id);
            case POKER_CATEGORY.PARTICIPATING:
                return pokerboards.filter((data) => data.pokerboard.manager.id != current_user.id);
            default:
                return pokerboards;
        }
    }

    return (
        <div>
            <div className="owned-groups pokerboards">
                <h2>Pokerboards</h2>
                <select
                    className="pokerboards-input input"
                    name="poker-category"
                    value={pokerCategory}
                    onChange={(event) => {
                        setPokerCategory(event.target.value);
                    }}
                >
                    <option value={POKER_CATEGORY.ALL}>All</option>
                    <option value={POKER_CATEGORY.OWNED}>Owned</option>
                    <option value={POKER_CATEGORY.PARTICIPATING}>Participating</option>
                </select>
                <div>
                    {
                        (filteredPokerboards === undefined ||
                            filteredPokerboards.length === 0) && (
                            <p className="error-msg">No Pokerboard Owned</p>
                        )
                    }
                </div>
                <div>
                    {filteredPokerboards && filteredPokerboards.length !== 0 && (
                        <h3>{`Total - ${filteredPokerboards.length}`}</h3>
                    )}
                    {filteredPokerboards &&
                        filteredPokerboards.map((data) => (
                            <PokerboardItems {...data} current_user={current_user} key={data.id} parentCallback={handleReloadPokerboard} />
                        ))}
                </div>
            </div>
            {alert && <h3 className="error-msg">{alert}</h3>}
        </div>
    );
};

const mapStateToProps = (state) => ({
    alert: state.alertReducer.alert,
    pokerboards: state.pokerboardReducer.pokerboards,
});

const mapDispatchToProps = (dispatch) => ({
    resetAlert: () => {
        dispatch(resetAlert());
    },
    loadPokerboard: (url, action) => {
        axios
            .get(url)
            .then((res) => {
                dispatch({
                    type: action,
                    payload: res.data,
                });
            })
            .catch((err) => {
                dispatch(errorMessage(AUTH_MESSAGES.SOMETHING_WENT_WRONG));
            })
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Pokerboards);
