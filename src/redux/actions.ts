import { TAction } from "./types";
import { IUser } from "../interfaces/IToken";
import { ILogged } from "../interfaces/ILogged";


export const setTokenAction = (token: IUser): TAction => ({
    type: "SET_TOKEN" ,
    payload: token
})

export const setLoggedAction = (logged: ILogged): TAction => ({
    type: "SET_LOGGED",
    payload: logged
})