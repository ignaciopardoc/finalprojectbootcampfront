import { TAction } from "../types"


const initialState = {
    photo: "",
    name: "",
    username: ""
}

export default(state = initialState, action: TAction) => {
    switch (action.type) {
        case "SET_INFO": 
           return action.payload
           default:
            return state
    }
    
}