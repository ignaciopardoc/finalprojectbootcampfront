var initialState = {
    logged: false
};
export default (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case "SET_LOGGED":
            return action.payload;
        default:
            return state;
    }
});
