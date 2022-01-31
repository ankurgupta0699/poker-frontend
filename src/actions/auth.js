import axios from "axios";

import { JIRA_TOKEN } from "./jira";
import { AUTH_MESSAGES, STATUS } from "constants/messages";
import { AUTH_TYPES } from "constants/actionTypes";
import { BACKEND_URLS, BASE_URL, urls } from "constants/urls";
import { errorMessage, successMessage } from "actions/alert";
import { INVITATION_PURPOSE, RESPONSE_STATUS } from "constants/values";

const loginUser = (email, password) => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.LOGIN}`;
  const body = {
    email,
    password,
  };
  return axios
    .post(url, body)
    .then((res) => {
      const user = res.data.user;
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("id", user.id);
      dispatch({
        type: AUTH_TYPES.LOGIN_USER,
        payload: {
          user,
          token,
        },
      });
      dispatch(successMessage(AUTH_MESSAGES.LOGIN_SUCCESS_MESSAGE));
      return axios.get(`${BASE_URL}${BACKEND_URLS.USER_JIRA_TOKEN}`)
    })
    .then ((res) => {
      const userJiraToken = res.data.length > 0 ? res.data[0] : null;
      localStorage.setItem('userJiraToken', JSON.stringify(userJiraToken));
      dispatch({
          type: JIRA_TOKEN.SUCCESS_LOAD,
          payload: res.data,
      });
    })
    .catch((err) => {
      let message = '';
      if(err.response && err.response.data && err.response.data.non_field_errors && err.response.data.non_field_errors[0]) {
        message = err.response.data.non_field_errors[0];
      } else{
        message = AUTH_MESSAGES.LOGIN_FAILED_MESSAGE;
      }
      dispatch(errorMessage(message));
    });
};

const signupUser =
  (email, password, firstName, lastName = "", token) =>
  (dispatch) => {
    const url = `${BASE_URL}${BACKEND_URLS.SIGNUP}`;
    const body = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      token,
    };
    return axios
      .post(url, body)
      .then((res) => {
        dispatch(successMessage(AUTH_MESSAGES.SIGNUP_SUCCESS_MESSAGE));
        const loginUrl = `${BASE_URL}${BACKEND_URLS.LOGIN}`;
        const loginBody = {
          email,
          password,
        };
        axios
          .post(loginUrl, loginBody)
          .then((res) => {
            const user = res.data.user;
            const token = res.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("user", user);
            localStorage.setItem("id", user.id);
            dispatch({
              type: AUTH_TYPES.LOGIN_USER,
              payload: {
                user,
                token,
              },
            });
            dispatch(successMessage(AUTH_MESSAGES.LOGIN_SUCCESS_MESSAGE));
            return axios.get(`${BASE_URL}${BACKEND_URLS.USER_JIRA_TOKEN}`)
            })
          .then ((res) => {
            const userJiraToken = res.data.length > 0 ? res.data[0] : null;
            localStorage.setItem('userJiraToken', JSON.stringify(userJiraToken));
            dispatch({
                type: JIRA_TOKEN.SUCCESS_LOAD,
                payload: res.data,
            });
          })
          .catch(() => {
            let message = '';
            if(err.response && err.response.data && err.response.data.non_field_errors && err.response.data.non_field_errors[0]) {
              message = err.response.data.non_field_errors[0];
            } else{
              message = AUTH_MESSAGES.LOGIN_FAILED_MESSAGE;
            }
            dispatch(errorMessage(message));
          });
      })
      .catch((err) => {
        const response = err.response;
        if (response.status === RESPONSE_STATUS.ERROR) {
          if (response.data.email) {
            dispatch(errorMessage(response.data.email));
          }
        } else {
          dispatch(errorMessage(AUTH_MESSAGES.SIGNUP_FAILED_MESSAGE));
        }
      });
  };

const logoutUser = () => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.LOGOUT}`;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  axios
    .post(url, {}, config)
    .then(() => {
      localStorage.clear();
      dispatch({
        type: AUTH_TYPES.LOGOUT_USER,
      });
      dispatch(successMessage(AUTH_MESSAGES.LOGOUT_SUCCESS_MESSAGE));
    })
    .catch((err) => {
      dispatch(errorMessage(AUTH_MESSAGES.LOGOUT_FAILED_MESSAGE));
    });
};

const verifyUser = (formData) => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.SENDTOKEN}`;
  const body = {
    email: formData.email,
    name: formData.name,
    purpose: INVITATION_PURPOSE.SIGNUP,
  };
  axios
    .post(url, body)
    .then((res) => {
      dispatch(successMessage(res.data.message));
    })
    .catch((err) => {
      const response = err.response;
      if (response && response.data.email) {
        dispatch(errorMessage(response.data.email));
      } else {
        dispatch(errorMessage(AUTH_MESSAGES.SOMETHING_WENT_WRONG));
      }
    });
};

const verifyToken = (token, history) => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.VERIFYTOKEN}`;
  const body = {
    token,
  };
  axios
    .post(url, body)
    .then((res) => {
      if (res.data.status == STATUS.HTTP_204_NO_CONTENT) {
        if (res.data.message) {
          dispatch(successMessage(res.data.message));
        } else {
          dispatch(successMessage(AUTH_MESSAGES.ALREADY_SIGNEUP));
        }
        history.push(urls.AFTER_VERIFICATION);
        return;
      }
      dispatch(successMessage(res.data.message));
      dispatch({
        type: AUTH_TYPES.VERIFY_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      let message = "";
      if (err.response.data && err.response.data.message) {
        message = err.response.data.message;
      } else {
        message = AUTH_MESSAGES.REQUEST_TOKEN;
      }
      history.push(urls.AFTER_VERIFICATION);
      dispatch(errorMessage(message));
    });
};

export { loginUser, logoutUser, signupUser, verifyToken, verifyUser };
