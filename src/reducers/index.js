import { combineReducers } from "redux";

import jira from "./jira";
import navbar from "./navbar";
import pokerboardInvites from "./pokerboardInvites";
import successAlert from "./successAlert";
import alertReducer from "reducers/alert";
import authReducers from "reducers/auth";
import loadProfileReducer from "reducers/editprofile";
import groupReducer from "reducers/group";
import invitesReducer from "reducers/invites";
import pokerboardReducer from "reducers/pokerboard";

export default combineReducers({
  /*
        combines the multiple reducers into one
    */
  navbar,
  authReducers,
  alertReducer,
  groupReducer,
  invitesReducer,
  jira,
  loadProfileReducer,
  pokerboardReducer,
  pokerboardInvites,
  successAlert,
});
