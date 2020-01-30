import { IUser } from "../interfaces/IToken";
import { ILogged } from "../interfaces/ILogged";

interface ISetToken {
  type: "SET_TOKEN";
  payload: IUser;
}

interface ISetLogged {
  type: "SET_LOGGED";
  payload: ILogged;
}

export type TAction = ISetToken | ISetLogged;
