import { IUser } from "../interfaces/IToken";
import { ILogged } from "../interfaces/ILogged";
import { IUserInfo } from "../interfaces/IUserInfo";

interface ISetToken {
  type: "SET_TOKEN";
  payload: IUser;
}

interface ISetLogged {
  type: "SET_LOGGED";
  payload: ILogged;
}

interface ISetUser {
  type: "SET_INFO";
  payload: IUserInfo;
}

interface ISetPremium {
  type: "SET_PREMIUM";
  payload: boolean;
}

export type TAction = ISetToken | ISetLogged | ISetUser | ISetPremium;
