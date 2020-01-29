import { combineReducers } from "redux";
import { IStore } from "../../interfaces/IStore";
import token from "./userReducer"

export default combineReducers<IStore>({
    token
})