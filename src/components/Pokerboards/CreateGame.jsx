import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import "./Pokerboards.css";
import { errorMessage, resetAlert, successMessage } from "actions/alert";
import { attributesMsg, AUTH_MESSAGES, POKER_MESSAGE, toastErrorMsg } from "constants/messages.js";
import { BACKEND_URLS, BASE_URL, urls } from "constants/urls";
import { ESTIMATE_TYPE } from "constants/values";
import { validDuration, validName, validNumberList, validRange } from "utils/validators";


const CreateGame = (props) => {
    const { alert, createGame, resetAlert } = props;

    const [name, setName] = useState("");
    const [duration, setDuration] = useState(1200);
    const [estimateType, setEstimateType] = useState(ESTIMATE_TYPE.FIBONACCI);
    const [from, setFrom] = useState(1);
    const [to, setTo] = useState(52);
    const [deck, setDeck] = useState("");

    const { addToast } = useToasts();
    const history = useHistory();
    const current_user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        resetAlert();
    }, []);

    useEffect(() => {
        if (!current_user) {
            history.push(urls.root);
        }
    }, [current_user]);

    const handleInputSubmit = (event) => {
        event.preventDefault();

        if (!validName(name)) {
            return addToast(toastErrorMsg.GAME_NAME, {
                appearance: "error",
                autoDismiss: true,
            });
        }

        const durationNumber = Number(duration);
        if (!validDuration(durationNumber)) {
            return addToast(toastErrorMsg.DURATION_INVALID, {
                appearance: "error",
                autoDismiss: true,
            });
        }

        const array = String(deck).split(',').map(Number).sort();
        if (!validNumberList(array)) {
            return addToast(toastErrorMsg.VALID_NUMBER_LIST, {
                appearance: "error",
                autoDismiss: true,
            });
        }

        const url = `${BASE_URL}${BACKEND_URLS.POKER_CRUD}`;
        const data = {
            name: name,
            duration: durationNumber,
            deck: array,
            estimate_type: estimateType,
        };
        createGame(url, data);
    };

    const generateDeck = () => {
        let f = parseInt(from);
        const t = parseInt(to);

        if (!validRange(f, t)) {
            return addToast(toastErrorMsg.FROM_AND_TO_INVALID, {
                appearance: "error",
                autoDismiss: true,
            });
        }

        let tdeck = [];

        if (estimateType == ESTIMATE_TYPE.SERIAL) {
            for (let i = f; i <= t; i++) {
                tdeck.push(i);
            }
        }
        else if (estimateType == ESTIMATE_TYPE.EVEN) {
            f = parseInt((f + 1) / 2) * 2;
            for (let i = f; i <= t; i += 2) {
                tdeck.push(i);
            }
        }
        else if (estimateType == ESTIMATE_TYPE.ODD) {
            f = (parseInt(f / 2) * 2) + 1;
            for (let i = f; i <= t; i += 2) {
                tdeck.push(i);
            }
        }
        else if (estimateType == ESTIMATE_TYPE.FIBONACCI) {
            let a = 1, b = 1;
            while (b <= t) {
                tdeck.push(b);

                const c = a + b;
                a = b;
                b = c;
            }
        }
        setDeck(String(tdeck));
    }

    return (
        <div className="create-game">
            <form onSubmit={handleInputSubmit}>
                <h2>Create PokerBoard</h2>
                <label>
                    Name *
                    <input
                        className="input"
                        type="text"
                        placeholder={attributesMsg.GAME_NAME_PLACEHOLDER}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                        required
                    />
                </label>
                <label>
                    Duration(sec.) *
                    <input
                        className="input"
                        type="number"
                        placeholder={attributesMsg.GAME_DURATION_PLACEHOLDER}
                        value={duration}
                        onChange={(event) => {
                            setDuration(event.target.value);
                        }}
                    />
                </label>
                <label>
                    Estimate Type *
                    <select
                        className="input"
                        name="estimate-type"
                        value={estimateType}
                        onChange={(event) => {
                            setEstimateType(event.target.value);
                        }}
                    >
                        <option value={ESTIMATE_TYPE.SERIAL}>Serial</option>
                        <option value={ESTIMATE_TYPE.EVEN}>Even</option>
                        <option value={ESTIMATE_TYPE.ODD}>Odd</option>
                        <option value={ESTIMATE_TYPE.FIBONACCI}>Fibonacci</option>
                        <option value={ESTIMATE_TYPE.CUSTOM}>Custom</option>
                    </select>
                </label>
                {
                    estimateType != ESTIMATE_TYPE.CUSTOM && (
                        <div>
                            <label>
                                From *
                                <input
                                    className="input"
                                    type="number"
                                    value={estimateType == ESTIMATE_TYPE.FIBONACCI ? 1 : from}
                                    onChange={(event) => {
                                        setFrom(event.target.value);
                                        setDeck('');
                                    }}
                                    disabled={estimateType == ESTIMATE_TYPE.FIBONACCI}
                                />
                            </label>
                            <label>
                                To *
                                <input
                                    className="input"
                                    type="number"
                                    value={to}
                                    onChange={(event) => {
                                        setTo(event.target.value);
                                        setDeck('');
                                    }}
                                />
                            </label>
                            <input className="button generate-deck-button" type="button" onClick={generateDeck} value="Generate Deck" />
                        </div>
                    )
                }
                <label>
                    <div>
                        Deck
                        {estimateType == ESTIMATE_TYPE.CUSTOM && <span> * </span>}
                    </div>
                    <input
                        className="input"
                        type="text"
                        placeholder={estimateType == ESTIMATE_TYPE.CUSTOM ? attributesMsg.CUSTOM_DECK_PLACEHOLDER : attributesMsg.DECK_PLACEHOLDER}
                        value={deck}
                        onChange={(event) => {
                            setDeck(event.target.value);
                        }}
                        disabled={estimateType != ESTIMATE_TYPE.CUSTOM}
                    />
                </label>
                <button className="button" type="submit">
                    Create Game
                </button>
            </form>
            {alert && <h2 className="error-msg">{alert}</h2>}
        </div>
    );
};

const mapStateToProps = (state) => ({
    alert: state.alertReducer.alert,
});

const mapDispatchToProps = (dispatch) => ({
    resetAlert: () => {
        dispatch(resetAlert());
    },
    createGame: (url, data) => {
        axios.post(url, data)
            .then((res) => {
                dispatch(successMessage(POKER_MESSAGE.GAME_CREATED));
            })
            .catch((err) => {
                let message = "";
                if (err.response && err.response.data && err.response.data.name) {
                    message = err.response.data.name[0];
                } else {
                    message = AUTH_MESSAGES.SOMETHING_WENT_WRONG;
                }
                dispatch(errorMessage(message));
            });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGame);
