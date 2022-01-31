import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import queryString from "query-string";
import { useToasts } from "react-toast-notifications";

import { attributesMsg, toastErrorMsg } from "constants/messages.js";
import { REGEX } from "constants/values";
import { resetAlert } from "actions/alert";
import { signupUser, verifyToken } from "actions/auth";
import { urls } from "constants/urls.js";


const Signup = (props) => {
  const [firstName, setFirstName] = useState("");
  const [token, setToken] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();
  const { alert, resetAlert, signupUser, user, verifyToken, verifyState } = props;
  const { addToast } = useToasts();
  const id = localStorage.getItem('id');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      return addToast(toastErrorMsg.emailAndPassword, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (email) {
      if (!REGEX.test(email)) {
        return addToast(toastErrorMsg.VALID_EMAIL, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    if (firstName.length == 0) {
      return addToast(toastErrorMsg.FIRST_NAME_CANNOT_BE_EMPTY, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (password !== confirmPassword) {
      return addToast(
        toastErrorMsg.PASSWORD_AND_CONFIRM_PASSWORD_SHOULD_BE_SAME,
        {
          appearance: "error",
          autoDismiss: true,
        }
      );
    }
    signupUser(email, password, firstName, lastName, token);
  };

  useEffect(() => {
    resetAlert();
    const search = queryString.parse(props.location.search);
    if(!search.token) {
      history.push(urls.VERIFYEMAIL);
    }
    setToken(search.token);
  }, []);

  useEffect(() => {
    if (token && token.length !== 0) {
      verifyToken(token, history);
    }
  }, [token]);

  useEffect(() => {
    if (id) {
      history.push(urls.home);
    }
  }, [id]);

  useEffect(() => {
    if(verifyState.email) {
      setEmail(verifyState.email[0]);
      setFirstName(verifyState.name[0]);
    }
  }, [verifyState.email]);

  return (
    <div className="signin">
      <header>Register</header>
      {alert && <h3>{alert}</h3>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="first-name">
          <div>First Name *</div>
          &nbsp;
          <input
            id="first-name"
            className="input"
            type="text"
            placeholder={attributesMsg.firstNamePlaceholder}
            name="first-name"
            value={firstName}
            readOnly
            onChange={(event) => {
              setFirstName(event.currentTarget.value);
            }}
            required
          />
        </label>
        <label htmlFor="last-name">
          <div>Last Name</div>
          &nbsp;
          <input
            id="last-name"
            className="input"
            type="text"
            placeholder={attributesMsg.lastNamePlaceholder}
            name="last-name"
            onChange={(event) => {
              setLastName(event.currentTarget.value);
            }}
          />
        </label>
        <label htmlFor="email">
          <div>*Email</div>
          &nbsp;
          <input
            id="email"
            className="input"
            type="text"
            placeholder={attributesMsg.emailPlaceholder}
            name="email"
            value={email}
            readOnly
          />
        </label>

        <label htmlFor="password">
          <div>Password *</div>
          &nbsp;
          <input
            id="password"
            className="input"
            type="password"
            placeholder={attributesMsg.passwordPlacegolder}
            name="password"
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
            required
          />
        </label>

        <label htmlFor="confirmPassword">
          <div>Confirm Password *</div>
          &nbsp;
          <input
            id="confirm-password"
            className="input"
            type="password"
            placeholder={attributesMsg.CONFIRM_PASSWORD_PLACE_HOLDER}
            name="confirmPassword"
            onChange={(event) => {
              setConfirmPassword(event.currentTarget.value);
            }}
            required
          />
        </label>
        <input
          type="submit"
          value="Register"
          className="signin-button button"
        />
      </form>
      <div className="signin-after-form-link">
        <Link to="/signin">Back To Sign In</Link>
      </div>
      {alert && <h3>{ alert }</h3>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  verifyState: state.authReducers.verifyState,
  user: state.authReducers.user,
  alert: state.alertReducer.alert,
});

const mapDispatchToProps = (dispatch) => ({
  verifyToken: (token, history) => {
    dispatch(verifyToken(token, history));
  },
  signupUser: (email, password, firstName, lastName, token) => {
    dispatch(signupUser(email, password, firstName, lastName, token));
  },
  resetAlert: () => {
    dispatch(resetAlert());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
