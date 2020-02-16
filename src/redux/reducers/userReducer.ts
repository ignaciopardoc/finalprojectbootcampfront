import { TAction } from "../types";

const initialState = {
  token: ""
};

export default (state = initialState, action: TAction) => {
  switch (action.type) {
    case "SET_TOKEN":
      return action.payload;
    default:
      return state;
  }
};
