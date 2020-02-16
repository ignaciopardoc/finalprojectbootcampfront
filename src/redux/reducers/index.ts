import { combineReducers } from "redux";
import { IStore } from "../../interfaces/IStore";
import token from "./userReducer";
import logged from "./loggedReducer";
import userInfo from "./UserInfo";
import isPremium from "./premiumReducer";

export default combineReducers<IStore>({
  token,
  logged,
  userInfo,
  isPremium
});
