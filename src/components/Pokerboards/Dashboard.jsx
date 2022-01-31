import React, { useEffect, useState } from "react";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";

import { ESTIMATE_TYPE, GAME_VALUES, validNumberList } from "constants/values";
import { Link, useHistory } from "react-router-dom";
import { loadPoker, updatePoker } from "actions/pokerBoard";
import { resetAlert } from "actions/alert";
import { toastErrorMsg } from "constants/messages.js";
import { urls } from "constants/urls";

const Dashboard = (props) => {
  const {
    alert,
    loadPoker,
    match: {
      params: { id },
    },
    poker,
    resetAlert,
    updatePoker,
  } = props;
  const [formData, setFormData] = useState({
    name: poker.name,
    duration: poker.duration,
    estimateType: poker.estimateType || "",
    deck: poker.deck,
  });
  const { addToast } = useToasts();
  const history = useHistory();
  const authId = localStorage.getItem("id");

  const onChangeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleInputSubmit = (event) => {
    event.preventDefault();
    if (
      formData.name.length < GAME_VALUES.MIN_SIZE ||
      formData.name.length > GAME_VALUES.MAX_NAME_SIZE
    ) {
      return addToast(toastErrorMsg.GAME_NAME, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (formData.deck.length === GAME_VALUES.MIN_SIZE) {
      return addToast(toastErrorMsg.DECK_SIZE, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    // if (!validNumberList(formData.deck)) {
    //   return addToast(toastErrorMsg.VALID_NUMBER_LIST, {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    // }
    // let array;
    // if (formData.deck === "string") {
    //   array = formData.deck.split(",");
    // }
    // if (new Set(array).size !== array.length) {
    //   return addToast(toastErrorMsg.DECK_DUPLICATE, {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    // }
    updatePoker(formData, id);
  };

  useEffect(() => {
    if (alert.length > 0) {
      setTimeout(() => {
        resetAlert();
      }, 3000);
    }
  }, [alert]);

  useEffect(() => {
    if (!authId) {
      history.push(urls.root);
    }
    resetAlert();
    loadPoker(id);
  }, []);

  useEffect(() => {
    if (!id) {
      history.push(urls.root);
    }
  }, [id]);

  useEffect(() => {
    setFormData(() => ({ ...poker }));
  }, [poker]);

  return (
    <div>
      <form onSubmit={handleInputSubmit}>
        <h2>Update PokerBoard</h2>
        <label>
          Name *
          <input
            type="text"
            name="name"
            placeholder="Enter Game name"
            onChange={onChangeHandler}
            value={formData.name}
            required
          />
        </label>
        <label>
          Duration
          <input
            type="string"
            name="duration"
            placeholder="Enter Game duration"
            onChange={onChangeHandler}
            value={formData.duration}
          />
        </label>
        <label>
          Deck *
          <input
            type="text"
            name="deck"
            placeholder="Enter deck of cards"
            onChange={onChangeHandler}
            value={formData.deck}
          />
        </label>
        <label>
          Estimate Type
          <FormControl style={{minWidth: 250}}>
            <Select
              name="estimateType"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.estimateType}
              label="Estimate Type"
              onChange={onChangeHandler}
            >
              <MenuItem value={ESTIMATE_TYPE.SERIAL}>Serial</MenuItem>
              <MenuItem value={ESTIMATE_TYPE.EVEN}>Even</MenuItem>
              <MenuItem value={ESTIMATE_TYPE.ODD}>Odd</MenuItem>
              <MenuItem value={ESTIMATE_TYPE.FIBONACCI}>Fibonacci</MenuItem>
              <MenuItem value={ESTIMATE_TYPE.CUSTOM}>Custom</MenuItem>
            </Select>
          </FormControl>
        </label>
        <Button type="submit" variant="contained">
          Update Settings
        </Button>
        {alert && <h2>{alert}</h2>}
      </form>
      <div>
        <Link
          to={{
            pathname: `/pokeboard/${id}/members`,
          }}
        >
          Users
        </Link>
      </div>
      <div className="jira-tickets-buttons">
        <Link 
          to={{ 
            pathname: urls.FETCH_JIRA_TICKETS_PATH(id), 
          }}
        >
          <button className="button">Fetch Jira Tickets</button>
        </Link>
        <Link 
          to={{ 
            pathname: urls.MANAGE_TICKETS_PATH(id), 
          }}
        >
          <button className="button">Manage Tickets</button>
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.authReducers.user,
  alert: state.alertReducer.alert,
  poker: state.pokerboardReducer.poker,
});

const mapDispatchToProps = (dispatch) => ({
  loadPoker: (id) => {
    dispatch(loadPoker(id));
  },
  resetAlert: () => {
    dispatch(resetAlert());
  },
  updatePoker: (body, id) => {
    dispatch(updatePoker(body, id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
