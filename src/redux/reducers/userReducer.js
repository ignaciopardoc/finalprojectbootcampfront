var initialState = {
    token: ""
};
export default (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case "SET_TOKEN":
            return action.payload;
        default:
            return state;
    }
});
