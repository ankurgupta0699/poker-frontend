import { ALERT_TYPES } from "constants/actionTypes";

export const resetAlert = () => ({
  type: ALERT_TYPES.RESET_ALERT,
});

export const successMessage = (msg) => ({
  type: ALERT_TYPES.SUCCESS_ALERT,
  payload: { msg },
});

export const errorMessage = (msg) => ({
  type: ALERT_TYPES.ERROR_ALERT,
  payload: { msg },
});
