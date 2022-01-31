import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import './FetchJiraToken.css';
import { errorMessage, resetAlert } from "actions/alert";
import { attributesMsg, AUTH_MESSAGES } from "constants/messages";
import { BACKEND_URLS, BASE_URL, JIRA_DOMAIN_BASE_URL, JIRA_URLS, urls } from "constants/urls";
import { JIRA_TOKEN } from "actions/jira";
import SuccessAlert from 'components/Alert/SuccessAlert';
import ErrorAlert from 'components/Alert/ErrorAlert';


const FetchJiraToken = (props) => {
    const { resetAlert, jiraTokenActions, backendUserJiraToken, jiraCurrentUser, saveSuccessAlert, errorAlert } = props;
    const [jiraToken, setJiraToken] = useState("");
    const [domainName, setDomainName] = useState("");
    const [localUserJiraToken, setLocalUserJiraToken] = useState(JSON.parse(localStorage.getItem('userJiraToken')));

    const history = useHistory();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        resetAlert();
    }, []);

    useEffect(() => {
        if (!currentUser) {
            history.push(urls.root);
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('userJiraToken', JSON.stringify(localUserJiraToken));
    }, [localUserJiraToken])

    useEffect(() => {
        if (backendUserJiraToken) {
            setLocalUserJiraToken(backendUserJiraToken);
        }
    }, [backendUserJiraToken]);

    useEffect(() => {
        if (jiraToken && jiraCurrentUser && jiraCurrentUser.emailAddress.localeCompare(currentUser.email) === 0) {
            if (localUserJiraToken) handleUpdateJiraToken();
            else handleSaveJiraToken();
        }
    }, [jiraCurrentUser]);

    // console.log(localUserJiraToken, jiraCurrentUser);

    const handleSaveJiraToken = () => {
        const requestConfig = {
            method: 'post',
            url: `${BACKEND_URLS.USER_JIRA_TOKEN}`,
            data: {
                'jira_token': jiraToken
            }
        };
        const actionSuccess = JIRA_TOKEN.SUCCESS_SAVE;
        const actionFail = JIRA_TOKEN.FAILED_SAVE;
        jiraTokenActions(requestConfig, actionSuccess, actionFail);
    }

    const handleUpdateJiraToken = () => {
        const requestConfig = {
            method: 'patch',
            url: BACKEND_URLS.USER_JIRA_TOKEN_ID_URL(localUserJiraToken.id),
            data: {
                'jira_token': jiraToken
            }
        };
        const actionSuccess = JIRA_TOKEN.SUCCESS_UPDATE;
        const actionFail = JIRA_TOKEN.FAILED_UPDATE;
        jiraTokenActions(requestConfig, actionSuccess, actionFail);
    }

    const handleVerifyJiraToken = (event) => {
        const requestConfig = {
            method: 'GET',
            url: `${JIRA_DOMAIN_BASE_URL(domainName)}${JIRA_URLS.CURRENT_USER}`,
            withCredentials: true,
            auth: {
                username: currentUser.email,
                password: jiraToken
            },
        };
        const actionSuccess = JIRA_TOKEN.SUCCESS_VERIFY;
        const actionFail = JIRA_TOKEN.FAILED_VERIFY;
        jiraTokenActions(requestConfig, actionSuccess, actionFail, "Invalid Token or Domain-name! Please update.");
    }
    
    const handleSubmitJiraToken = (event) => {
        event.preventDefault();
        resetAlert();

        handleVerifyJiraToken();
    }
    
    return (
        <div>
            <div className="fetch-jira-token content-flex-column">
                <h2>Jira Token</h2>

                <form onSubmit={handleSubmitJiraToken}>
                    <div className="info">
                        {
                            localUserJiraToken ?
                                "You have provided a Jira token. Still, you can update if you want." :
                                "Please provide your domain name & Jira token."
                        }
                    </div>
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
                        <div>Jira Token * </div>
                        <input
                            className="input"
                            type="text"
                            placeholder={attributesMsg.JIRA_TOKEN_PLACEHOLDER}
                            onChange={(event) => {
                                setJiraToken(event.target.value);
                            }}
                            required
                        />
                    </label>
                    <button className="font-awesome-button" type="submit">
                        <FontAwesomeIcon icon={faSave} size="7x" title="Verify and Save" />
                    </button>

                </form>
            </div>
            {errorAlert && <ErrorAlert alert={errorAlert} />}
            {saveSuccessAlert && <SuccessAlert alert="Token Saved!" />}
        </div>
    );
};

const mapStateToProps = (state) => ({
    errorAlert: state.alertReducer.alert,
    saveSuccessAlert: state.successAlert.jiraTokenSave,
    backendUserJiraToken: state.jira.userJiraToken,
    jiraCurrentUser: state.jira.jiraCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
    resetAlert: () => {
        dispatch(resetAlert());
    },
    jiraTokenActions: (requestConfig, actionSuccess, actionFail, errorMsg = "") => {
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

export default connect(mapStateToProps, mapDispatchToProps)(FetchJiraToken);
