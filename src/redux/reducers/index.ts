import { combineReducers } from "redux";
import { IStore } from "../../interfaces/IStore";
import token from "./userReducer"
import logged from "./loggedReducer"

export default combineReducers<IStore>({
    token, logged
})