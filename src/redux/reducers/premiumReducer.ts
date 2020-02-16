import { TAction } from "../types";

const initialState = false;

export default (state = initialState, action: TAction) => {
  switch (action.type) {
    case "SET_PREMIUM":
      return action.payload;
    default:
      return state;
  }
};
