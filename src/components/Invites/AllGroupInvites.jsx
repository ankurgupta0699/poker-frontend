import React from "react";

import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import { urls } from "constants/urls";

const AllGroupInvites = () => {
  return (
    <div className="owned-groups">
      <div className="owned-group-item">
        <Link to={urls.SENT_GROUP_INVITES}>
          <Button variant="contained" color="secondary">
            Sent Invitations
          </Button>
        </Link>
      </div>
      <div className="owned-group-item">
        <Link to={urls.RECEIVED_GROUP_INVITES}>
          <Button variant="contained" color="secondary">
            Received Invitations
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AllGroupInvites;
