import { TAction } from "./types";
import { IToken } from "../interfaces/IToken";




export const setTokenAction = (token: IToken): TAction => ({
    type: "SET_TOKEN" ,
    payload: token
})