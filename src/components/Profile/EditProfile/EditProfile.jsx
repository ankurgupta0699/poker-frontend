import React, { useEffect, useState } from "react";

import { connect } from "react-redux";

import { editProfile, loadProfile } from "actions/editProfile";
import { PROFILE_MESSAGES } from "constants/messages";
import { resetAlert } from "actions/alert";
import { urls } from "constants/urls";
import { Link, useHistory } from "react-router-dom";

const EditProfile = (props) => {
  const {
    alert,
    editProfile,
    profileData,
    profileUpdated,
    resetAlert,
    loadProfile,
    user,
  } = props;
  const history = useHistory();
  const [userDetails, setUserDetails] = useState({
    id: profileData.id,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
  });
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    update: "",
  });
  const id = localStorage.getItem("id");

  const onChangeHandler = (event) => {
    setUserDetails({ ...userDetails, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError({});
    const errors = {};
    if (
      profileData.firstName === userDetails.firstName &&
      profileData.lastName === userDetails.lastName
    ) {
      errors.update = PROFILE_MESSAGES.EDIT_DETAILS;
    }
    if (Object.keys(errors).length === 0) {
      editProfile(userDetails);
    } else {
      setError(errors);
    }
  };

  useEffect(() => {
    if (alert.length > 0) {
      setTimeout(() => {
        resetAlert();
      }, 3000);
    }
  }, [alert]);

  useEffect(() => {
    resetAlert();
    loadProfile(id);
    if (!id) {
      history.push(urls.root);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      history.push(urls.root);
    }
  }, [id]);

  useEffect(() => {
    setUserDetails(() => ({ ...profileData }));
  }, [profileData]);

  useEffect(() => {
    if (profileUpdated) {
      history.push(urls.MY_PROFILE);
    }
  }, [profileUpdated]);

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={userDetails.firstName}
            className="input"
            onChange={onChangeHandler}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={userDetails.lastName}
            className="input"
            onChange={onChangeHandler}
          />
        </label>
        <button type="submit" className="button">
          Update
        </button>

      <Link to={urls.RESET_PASSWORD}>
        <button className="button">
          Reset Password
        </button>
      </Link>
      </form>
      {error.update && <h2>{error.update}</h2>}
      {alert && <h2 className="alert">{alert}</h2>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.authReducers.user,
  profileData: state.loadProfileReducer,
  alert: state.alertReducer.alert,
  profileUpdated: state.loadProfileReducer.profileUpdated,
});

const mapDispatchToProps = (dispatch) => ({
  editProfile: (state) => {
    dispatch(editProfile(state));
  },
  loadProfile: (id) => {
    dispatch(loadProfile(id));
  },
  resetAlert: () => {
    dispatch(resetAlert());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
