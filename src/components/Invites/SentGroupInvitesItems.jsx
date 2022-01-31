import React, { useEffect } from "react";
import { connect } from "react-redux";

import { cancelInvite } from "actions/invites";
import { GROUP_INVITATION_STATUS, GROUP_INVITE_STATUS } from "constants/values";
import { resetAlert } from "actions/alert";

const SentGroupInvitesItems = (props) => {
  const { alert, cancelInvite, group, id, resetAlert, status, verification } =
    props;

  const clickHandler = (event) => {
    event.preventDefault();
    cancelInvite(id);
  };

  useEffect(() => {
    resetAlert();
  }, []);

  return (
    <div className="owned-group-item">
      <div className="owned-group-title">{group.title}</div>
      <div>
        <h3>{"User - "}</h3>
        {verification.email}
      </div>
      <div>
        <h3>{"Status - "}</h3>
        {GROUP_INVITE_STATUS[status]}
        {status === GROUP_INVITATION_STATUS.PENDING && (
          <button onClick={clickHandler}>Cancel Invite</button>
        )}
      </div>
      {alert && alert.length >= 0 && <h3>{alert}</h3>}
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
  cancelInvite: (id) => {
    dispatch(cancelInvite(id));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SentGroupInvitesItems);
