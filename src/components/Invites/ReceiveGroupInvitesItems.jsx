import React, { useEffect } from "react";

import { connect } from "react-redux";

import { GROUP_INVITATION_STATUS, GROUP_INVITE_STATUS } from "constants/values";
import { acceptInvite, declineInvite } from "actions/invites";
import { resetAlert } from "actions/alert";

const ReceiveGroupInvitesItems = (props) => {
  const { acceptInvite, alert, declineInvite, group, id, resetAlert, status } =
    props;

  useEffect(() => {
    resetAlert();
  }, []);

  const clickHandler = (event) => {
    event.preventDefault();
    acceptInvite(id);
  };

  const declineClickHandler = (event) => {
    event.preventDefault();
    declineInvite(id);
  };

  return (
    <div className="owned-group-item">
      <div className="owned-group-title">{group.title}</div>
      <div>
        <h3>{"Owner - "}</h3>
        {group.admin.email}
      </div>
      <div>
        <h3>{"Status - "}</h3>
        {GROUP_INVITE_STATUS[status]}
        {status === GROUP_INVITATION_STATUS.PENDING && (
          <button onClick={clickHandler}>Accept Invite</button>
        )}
        {status === GROUP_INVITATION_STATUS.PENDING && (
          <button onClick={declineClickHandler}>Decline Invite</button>
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
  acceptInvite: (id) => {
    dispatch(acceptInvite(id));
  },
  declineInvite: (id) => {
    dispatch(declineInvite(id));
  },
  resetAlert: () => {
    dispatch(resetAlert());
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiveGroupInvitesItems);
