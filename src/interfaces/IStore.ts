import { IUser } from "./IToken";
import { ILogged } from "./ILogged";
import { IUserInfo } from "./IUserInfo";

export interface IStore {
  token: IUser;
  logged: ILogged;
  userInfo: IUserInfo;
  isPremium: boolean;
}
