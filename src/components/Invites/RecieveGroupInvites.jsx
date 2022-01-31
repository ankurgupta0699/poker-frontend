import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { resetAlert } from "actions/alert";
import { loadProfile } from "actions/editProfile";
import { loadRecieveGroipInvites } from "actions/invites";
import ReceiveGroupInvitesItems from "components/Invites/ReceiveGroupInvitesItems";
import { urls } from "constants/urls";

const ReceiveGroupInvites = (props) => {
  const {
    alert,
    loadProfile,
    loadRecieveGroipInvites,
    profileData,
    recievedGroupInvites,
    resetAlert,
    user,
  } = props;

  const history = useHistory();
  const id = localStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      history.push(urls.root);
    }
    resetAlert();
    loadProfile(id);
  }, []);

  useEffect(() => {
    if (profileData.email) {
      loadRecieveGroipInvites(profileData.email);
    }
  }, [profileData]);

  useEffect(() => {
    if (!id) {
      history.push(urls.root);
    }
  }, [id]);

  return (
    <div className="owned-groups">
      <h2>Group Invitations</h2>
      <div className="owned-groups">
        {(recievedGroupInvites === undefined ||
          recievedGroupInvites.length === 0) && (
          <p className="error-msg">No Invitation</p>
        )}
      </div>
      <div>
        {recievedGroupInvites && recievedGroupInvites.length !== 0 && (
          <h3>
            {"Total Invitations: - "}
            {recievedGroupInvites.length}
          </h3>
        )}
        {recievedGroupInvites &&
          recievedGroupInvites.map((elem) => (
            <ReceiveGroupInvitesItems {...elem} />
          ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  alert: state.alertReducer.alert,
  user: state.authReducers.user,
  recievedGroupInvites: state.invitesReducer.recievedGroupInvites,
  profileData: state.loadProfileReducer,
});

const mapDispatchToProps = (dispatch) => ({
  resetAlert: () => {
    dispatch(resetAlert());
  },
  loadRecieveGroipInvites: (email) => {
    dispatch(loadRecieveGroipInvites(email));
  },
  loadProfile: (id) => {
    dispatch(loadProfile(id));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiveGroupInvites);
