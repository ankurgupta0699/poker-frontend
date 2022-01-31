import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import "./Groups.css";
import { loadGroup, resetGroupCreated } from "actions/group";
import OwnedGroupItems from "components/Groups/OwnedGroupsItems";
import { resetAlert } from "actions/alert";
import { urls } from "constants/urls";


const OwnedGroups = (props) => {
  const { alert, loadGroup, ownedGroups, resetAlert, resetGroupCreated, user } = props;
  const history = useHistory();
  const id = localStorage.getItem("id");

  useEffect(() => {
    resetGroupCreated();
    resetAlert();
    loadGroup();
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
      <h2>Owned Groups</h2>
      <div>
        {(ownedGroups === undefined || ownedGroups.length === 0) && (
          <p className="error-msg">No Group Owned</p>
        )}
      </div>
      <div>
        {ownedGroups && ownedGroups.length!==0 && (
          <h3>
            {"Total Groups: - "}
            {ownedGroups.length}
          </h3>
        )}
        {ownedGroups &&
          ownedGroups.map((elem) => <OwnedGroupItems {...elem} />)}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.authReducers.user,
  alert: state.alertReducer.alert,
  ownedGroups: state.groupReducer.ownedGroups,
});

const mapDispatchToProps = (dispatch) => ({
  resetGroupCreated: () => {
    dispatch(resetGroupCreated());
  },
  loadGroup: () => {
    dispatch(loadGroup());
  },
  resetAlert: () => {
    dispatch(resetAlert());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OwnedGroups);
