import { TAction } from "../types"


const initialState = {
    logged: false
}

export default(state = initialState, action: TAction) => {
    switch (action.type) {
        case "SET_LOGGED": 
           return action.payload
           default:
            return state
    }
    
}