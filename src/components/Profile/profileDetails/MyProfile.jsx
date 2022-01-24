import React, { useEffect } from "react";

import { connect } from "react-redux";
import { useHistory } from "react-router";
import { Link } from 'react-router-dom';

import "../profile.css";
import { loadProfile, resetprofileUpdated } from "actions/editProfile";
import { urls } from "constants/urls";


const MyProfile = (props) => {
    const { profileData, loadProfile, resetprofileUpdated, user } = props;
    const history = useHistory();
    const id = localStorage.getItem("id");

    useEffect(() => {
        id && loadProfile(id);
        resetprofileUpdated();
        if (!id) {
            history.push(urls.root);
        }
    }, []);

    useEffect(() => {
        if (!id) {
            history.push(urls.root);
        }
    }, [id])

    return (
        <div className="my-profile">
            <div className='user-details'>
                <div>
                    <div>Email:</div>
                    <input className="input" value={profileData.email} readOnly />
                </div>
                <div>
                    <div>First Name:</div>
                    <input className="input" value={profileData.firstName} readOnly />
                </div>
                <div>
                    <div>Last Name:</div>
                    <input className="input" value={profileData.lastName} readOnly />
                </div>
            </div>
            <Link to={urls.EDIT_PROFILE}>
                <button className="button">
                    Edit Profile
                </button>
            </Link>
            <Link to={urls.FETCH_JIRA_TOKEN}>
                <button className="active-games button">Jira Token</button>
            </Link>
        </div>
    );
};

const mapStateToProps = (state) => ({
    profileData: state.loadProfileReducer,
    user: state.authReducers.user,
});

const mapDispatchToProps = (dispatch) => ({
    resetprofileUpdated: () => {
        dispatch(resetprofileUpdated());
    },
    loadProfile: (id) => {
        dispatch(loadProfile(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
