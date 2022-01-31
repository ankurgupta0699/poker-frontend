import React from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import InviteUsers from "components/InviteUsers/InviteUsers";

const OwnedPokerboardsItems = (props) => {
  const { id, name, manager, estimate_type, deck, duration } = props;
  const history = useHistory();

  const onClickHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="owned-group-item">
      <div className="owned-group-title">
        <Link
          to={{
            pathname: `/pokeboard/${id}`,
            pokerDetails: { ...props },
          }}
        >
          {name}
        </Link>
        {/* <button
          type="button"
          className="button-style-2"
          onClick={onClickHandler}
        >
          Delete Pokerboard
        </button> */}
      </div>
    </div>
  );
};

export default OwnedPokerboardsItems;
