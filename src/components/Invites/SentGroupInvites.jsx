import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { loadSentGroupInvites } from "actions/invites";
import { resetAlert } from "actions/alert";
import SentGroupInvitesItems from "components/Invites/SentGroupInvitesItems";
import { urls } from "constants/urls";

const SentGroupInvites = (props) => {
  const { alert, sentGroupInvites, loadSentGroupInvites } = props;
  const history = useHistory();
  const id = localStorage.getItem("id");

  useEffect(() => {
    resetAlert();
    loadSentGroupInvites();
    if (!id) {
      history.push(urls.root);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      history.push(urls.root);
    }
  }, [id]);

  return (
    <div className="owned-groups">
      <h2>Invited Users</h2>
      <div>
        {(sentGroupInvites === undefined || sentGroupInvites.length === 0) && (
          <p className="error-msg">No Invites Sent</p>
        )}
      </div>
      <div>
        {sentGroupInvites && sentGroupInvites.length !== 0 && (
          <h3>
            {"Total Sent Invites: - "}
            {sentGroupInvites.length}
          </h3>
        )}
        {sentGroupInvites &&
          sentGroupInvites.map((elem) => <SentGroupInvitesItems {...elem} />)}
      </div>
      {alert && <h3>{alert}</h3>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  alert: state.alertReducer.alert,
  user: state.authReducers.user,
  sentGroupInvites: state.invitesReducer.groupInvitedUsers,
});

const mapDispatchToProps = (dispatch) => ({
  resetAlert: () => {
    dispatch(resetAlert());
  },
  loadSentGroupInvites: () => {
    dispatch(loadSentGroupInvites());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SentGroupInvites);
