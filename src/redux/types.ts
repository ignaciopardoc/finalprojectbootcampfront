import { IToken } from "../interfaces/IToken";

interface ISetToken {
    type: "SET_TOKEN";
    payload: IToken;
}




export type TAction = ISetToken