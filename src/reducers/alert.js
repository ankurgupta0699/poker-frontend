import { ALERT_TYPES } from "constants/actionTypes.js";

const initialState = {
  alert: "",
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALERT_TYPES.RESET_ALERT:
      return {
        ...state,
        alert: "",
      };
    case ALERT_TYPES.SUCCESS_ALERT:
      return {
        ...state,
        alert: action.payload.msg,
      };
    case ALERT_TYPES.ERROR_ALERT:
      return {
        ...state,
        alert: action.payload.msg,
      };
    default:
      return state;
  }
};

export default alertReducer;
