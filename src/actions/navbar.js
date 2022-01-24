import {
  arrivalAtWelcomePage,
  departFromWelcomePage,
} from "constants/actionTypes";

export const departFromWelcomePageAC = () => {
  return {
    type: departFromWelcomePage,
  };
};

export const arrivalAtWelcomePageAC = () => {
  return {
    type: arrivalAtWelcomePage,
  };
};
