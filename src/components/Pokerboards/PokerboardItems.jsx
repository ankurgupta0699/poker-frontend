import { faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import "./Pokerboards.css";
import { POKERBOARD_TYPES } from "constants/actionTypes";
import { BACKEND_URLS, urls } from "constants/urls";


const PokerboardsItems = (props) => {
    // here 'id' is the id of UserPokerboard model
    const { id, user, role, pokerboard, current_user, actionOnPokerboard, parentCallback } = props;
    const history = useHistory();

    useEffect(() => {
        if (!current_user) {
            history.push(urls.root);
        }
    }, [current_user]);

    const deletePokerHandler = (event) => {
        event.preventDefault();
        const url = BACKEND_URLS.POKERBOARD_ID(pokerboard.id);
        const action = POKERBOARD_TYPES.DELETE;
        actionOnPokerboard(url, action);
        setTimeout(() => {
            parentCallback();
        }, 100);
    };

    const exitPokerHandler = (event) => {
        event.preventDefault();
        const url = BACKEND_URLS.USER_POKERBOARD_ID(id);
        const action = POKERBOARD_TYPES.EXIT;
        actionOnPokerboard(url, action);
        setTimeout(() => {
            parentCallback();
        }, 100);
    }

    return (
        <div className="pokerboard-items owned-group-item">
            <div className="owned-group-title">
                <Link
                    to={{
                        pathname: urls.DASHBOARD_PATH(pokerboard.id),
                    }}
                >
                    {pokerboard.name}
                </Link>
            </div>


            {current_user &&
                pokerboard.manager.id == current_user.id ?
                <button className="poker-action-button" onClick={deletePokerHandler}>
                    <FontAwesomeIcon icon={faTrashAlt} size="3x" title="Delete" />
                </button>
                :
                <button className="poker-action-button" onClick={exitPokerHandler}>
                    <FontAwesomeIcon icon={faTimes} size="3x" title="Exit" />
                </button>
            }
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    actionOnPokerboard: (url, action) => {
        axios
            .delete(url)
            .then((res) => {
                dispatch({
                    type: action,
                });
            })
            .catch((err) => {
                dispatch(errorMessage(AUTH_MESSAGES.SOMETHING_WENT_WRONG));
            });
    },
});

export default connect(null, mapDispatchToProps)(PokerboardsItems);
