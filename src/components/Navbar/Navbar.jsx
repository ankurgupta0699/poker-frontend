import React from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./Navbar.css";
import { logoutUser } from "actions/auth";
import { urls } from "constants/urls";


const Navbar = (props) => {
    let { logoutUser, isAuthenticate, atWelcome } = props;

    const handleLogout = (event) => {
        event.preventDefault();
        logoutUser();
    };

    return (
        <div className="navbar">
            {
                isAuthenticate ? (
                    <Link to={urls.home}>
                        <div className="title">Poker Planner</div>
                    </Link>
                ) : (
                    <Link to={urls.root}>
                        <div className="title">Poker Planner</div>
                    </Link>
                )
            }

            {!isAuthenticate && atWelcome && (
                <Link to="/signin">
                    <div className="signin-button button">Signin</div>
                </Link>
            )}

            {!isAuthenticate && atWelcome && (
                <Link to="/verify">
                    <div className="signup-button button">Signup</div>
                </Link>
            )}


            {isAuthenticate && (
                <Link to={urls.MY_PROFILE}>
                    <button className="button my-profile-button">My Profile</button>
                </Link>
            )}

            {isAuthenticate && (
                <button
                    onClick={handleLogout}
                    className="signin-button button signout-button"
                >
                    Signout
                </button>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticate: state.authReducers.isAuthenticate,
    atWelcome: state.navbar.atWelcome,
});

const mapDispatchToProps = (dispatch) => ({
    logoutUser: () => {
        dispatch(logoutUser());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
