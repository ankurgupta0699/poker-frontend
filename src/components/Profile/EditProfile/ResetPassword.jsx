import React from "react";

import { connect } from "react-redux";

import { resetAlert } from "actions/alert";
import { toastErrorMsg } from "constants/messages";
import { updatePassword } from "actions/editProfile";
import { urls } from "constants/urls";


class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    const id = localStorage.getItem("id");
    this.state = {
      id: id,
      currentPassword: "",
      password: "",
      confirmPassword: "",
      error: "",
      loading: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        error: toastErrorMsg.PASSWORD_AND_CONFIRM_PASSWORD_SHOULD_BE_SAME,
      });
      this.setState({ loading: false });
      return;
    }
    this.props.updatePassword(this.state);
    this.setState({ currentPassword: "", password: "", confirmPassword: "" });
    this.setState({ loading: false });
  }

  componentDidMount() {
    if (!this.state.id) {
      this.props.history.push(urls.root);
    }
    this.props.resetAlert();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.profileUpdated !== prevProps.profileUpdated &&
      this.props.profileUpdated
    ) {
      this.props.history.push(urls.MY_PROFILE);
    }
    if (
      this.props.isAuthenticate !== prevProps.isAuthenticate &&
      !this.props.isAuthenticate
    ) {
      this.props.history.push(urls.root);
    }
  }

  render() {
    return (
      <div className="reset-password">
        <form onSubmit={this.handleSubmit}>
          <label>
            *Current Password
            <input
              name="currentPassword"
              type="password"
              value={this.state.currentPassword}
              className="input"
              onChange={this.handleInputChange}
              required
            />
          </label>
          <label>
            *Password
            <input
              name="password"
              type="password"
              value={this.state.password}
              className="input"
              onChange={this.handleInputChange}
              required
            />
          </label>
          <label>
            *Confirm Password
            <input
              name="confirmPassword"
              type="password"
              value={this.state.confirmPassword}
              className="input"
              onChange={this.handleInputChange}
              required
            />
          </label>
          <button type="submit" className="button">
            Reset password
          </button>
        </form>
        {this.state.error && <h2 className="alert">{this.state.error}</h2>}
        {this.props.alert && <h2 className="alert">{this.props.alert}</h2>}
        {this.state.loading && <h2>Loading...!!</h2>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  alert: state.alertReducer.alert,
  profileUpdated: state.loadProfileReducer.profileUpdated,
  isAuthenticate: state.authReducers.isAuthenticate,
});

const mapDispatchToProps = (dispatch) => ({
  updatePassword: (body) => {
    dispatch(updatePassword(body));
  },
  resetAlert: () => {
    dispatch(resetAlert());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
