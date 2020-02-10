import { TAction } from "./types";
import { IUser } from "../interfaces/IToken";
import { ILogged } from "../interfaces/ILogged";
import { IUserInfo } from "../interfaces/IUserInfo";
import { TableHTMLAttributes } from "react";


export const setTokenAction = (token: IUser): TAction => ({
    type: "SET_TOKEN" ,
    payload: token
})

export const setLoggedAction = (logged: ILogged): TAction => ({
    type: "SET_LOGGED",
    payload: logged
})

export const setUserInfoAction = (UserInfo: IUserInfo): TAction => ({
    type: "SET_INFO",
    payload: UserInfo
})

export const setPremiumAction = (isPremium: boolean): TAction => ({
    type: "SET_PREMIUM",
    payload: isPremium
})