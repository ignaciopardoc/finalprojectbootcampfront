import { IUser } from "./IToken";
import { ILogged } from "./ILogged";

export interface IStore {
    token: IUser
    logged: ILogged
}