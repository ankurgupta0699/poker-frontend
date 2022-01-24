import axios from "axios";

import { AUTH_MESSAGES, GROUP_MESSAGES } from "constants/messages";
import { BACKEND_URLS, BASE_URL, urls } from "../constants/urls";
import { errorMessage, successMessage } from "actions/alert";
import { GROUP_TYPES } from "constants/actionTypes";
import { INVITATION_PURPOSE } from "constants/values";

const resetGroupCreated = () => ({
  type: GROUP_TYPES.RESET_GROUP_CREATED,
});

const createGroup =
  (title, description = "") =>
  (dispatch) => {
    const url = `${BASE_URL}${BACKEND_URLS.GROUP_CRUD}`;
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const body = {
      title: title,
      description: description,
      users: [id],
      admin: id,
    };
    axios
      .post(url, body, config)
      .then((res) => {
        dispatch(successMessage(GROUP_MESSAGES.GROUP_CREATED));
        dispatch({
          type: GROUP_TYPES.GROUP_CREATED,
        });
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.title) {
          dispatch(errorMessage(err.response.data.title));
        } else {
          dispatch(errorMessage(AUTH_MESSAGES.SOMETHING_WENT_WRONG));
        }
      });
  };

const loadGroup = () => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.GROUP_CRUD}`;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  axios
    .get(url, config)
    .then((res) => {
      dispatch({
        type: GROUP_TYPES.GROUPS_LOADED,
        payload: {
          loadedGroups: res.data,
        },
      });
    })
    .catch((err) => {
      dispatch(errorMessage(GROUP_MESSAGES.GROUPS_LOADED_FAILED));
    });
};

const sendInvitation =
  (id, email, purpose, role = "") =>
  (dispatch) => {
    let url;
    if (purpose == INVITATION_PURPOSE.POKERBOARD) {
      url = `${BASE_URL}${BACKEND_URLS.ACCOUNTS}${BACKEND_URLS.SEND_INVITATION}?role=${role}`;
    } else {
      url = `${BASE_URL}${BACKEND_URLS.ACCOUNTS}${BACKEND_URLS.SEND_INVITATION}`;
    }
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const body = {
      email: email,
      purpose: purpose,
      id: id,
    };
    console.log(url);
    console.log(body);
    axios
      .post(url, body, config)
      .then((res) => {
        dispatch(successMessage(res.data.message));
      })
      .catch((err) => {
        let message = "";
        if (err.response.data) {
          message = err.response.data[0];
        } else {
          message = AUTH_MESSAGES.SOMETHING_WENT_WRONG;
        }
        dispatch(errorMessage(message));
      });
  };

const deleteGroup = (id) => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.GROUP_CRUD}${id}`;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  axios
    .delete(url, config)
    .then((res) => {
      dispatch({
        type: GROUP_TYPES.DELETE_GROUP,
        payload: {
          id,
        },
      });
    })
    .catch((err) => {
      dispatch(errorMessage(GROUP_MESSAGES.SOMETHING_WENT_WRONG));
    });
};

const removeUser = (id, user) => (dispatch) => {
  const url = `${BASE_URL}${BACKEND_URLS.GROUP_CRUD}${id}/`;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      users: [user],
    },
  };
  axios
    .delete(url, config)
    .then((res) => {
      let message = "";
      if (res.data.message) {
        message = res.data.message;
      } else {
        message = "success";
      }
      dispatch({
        type: GROUP_TYPES.REMOVE_USER,
        payload: {
          id,
          user,
        },
      });
      dispatch(successMessage(message));
    })
    .catch((err) => {
      const message = AUTH_MESSAGES.SOMETHING_WENT_WRONG;
      dispatch(errorMessage(message));
    });
};

export {
  createGroup,
  deleteGroup,
  loadGroup,
  removeUser,
  resetGroupCreated,
  sendInvitation,
};
