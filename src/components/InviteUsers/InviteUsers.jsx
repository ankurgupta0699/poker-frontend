import React, { useState } from "react";

import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";

import "./InviteUsers.css";
import { INVITATION_PURPOSE } from "constants/values";
import { sendInvitation } from "actions/group";
import { toastErrorMsg } from "constants/messages";

const InviteUsers = (props) => {
  const { groupId, sendInvitation } = props;
  const [email, setEmail] = useState("");
  const { addToast } = useToasts();

  const handleClick = (event) => {
    event.preventDefault();
    if (!email) {
      return addToast(toastErrorMsg.email, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    sendInvitation(groupId, email, INVITATION_PURPOSE.GROUP);
  };

  return (
    <div className="invite-users">
      <input
        placeholder="enter email to invite"
        value={email}
        type="text"
        className="input"
        onChange={(event) => setEmail(event.target.value)}
      ></input>
      <button className="button" onClick={handleClick}>
        Invite
      </button>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  sendInvitation: (groupId, email, purpose) => {
    dispatch(sendInvitation(groupId, email, purpose));
  },
});

export default connect(null, mapDispatchToProps)(InviteUsers);
