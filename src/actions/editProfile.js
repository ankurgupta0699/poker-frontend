import axios from "axios";

import { BACKEND_URLS, BASE_URL } from "constants/urls";
import { errorMessage, successMessage } from "actions/alert";
import { AUTH_MESSAGES, PROFILE_MESSAGES } from "constants/messages";
import { PROFILE_TYPES } from "constants/actionTypes";

const resetprofileUpdated = () => ({
  type: PROFILE_TYPES.RESET_PROFILE_UPDATED,
});

const loadProfile = (id) => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.USER_CRUD}${id}/`;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  return axios
    .get(url, config)
    .then((res) => {
      dispatch({
        type: PROFILE_TYPES.LOAD_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(errorMessage(PROFILE_MESSAGES.LOAD_PROFILE_FAILED_MESSAGE));
    });
};

const editProfile = (data) => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.USER_CRUD}${data.id}/`;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const body = {
    first_name: data.firstName,
    last_name: data.lastName,
  };
  axios
    .patch(url, body, config)
    .then((res) => {
      dispatch({
        type: PROFILE_TYPES.PROFILE_UPDATED,
      });
      dispatch(successMessage(PROFILE_MESSAGES.UPDATE_USER_SUCCESS_MESSAGE));
      dispatch({
        type: PROFILE_TYPES.LOAD_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(errorMessage(PROFILE_MESSAGES.UPDATE_USER_FAILED_MESSAGE));
    });
};

const updatePassword = (data) => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.UPDATE_PASSWORD}${data.id}/`;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const body = {
    old_password: data.currentPassword,
    new_password: data.password,
  };
  axios
    .patch(url, body, config)
    .then((res) => {
      dispatch({
        type: PROFILE_TYPES.PROFILE_UPDATED,
      });
      dispatch(successMessage(res.data.message));
    })
    .catch((err) => {
      if (err.response.data && err.response.data.message) {
        dispatch(errorMessage(err.response.data.message));
      } else {
        dispatch(errorMessage(AUTH_MESSAGES.SOMETHING_WENT_WRONG));
      }
    });
};

export { editProfile, loadProfile, resetprofileUpdated, updatePassword };
