import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "./redux/reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { Router } from "react-router-dom";
import history from "./utils/history";
import { StripeProvider } from "react-stripe-elements";

const store = createStore(reducers, composeWithDevTools());

ReactDOM.render(
  <StripeProvider apiKey="pk_test_ewML3768pkuurTdZcznx0yY500oOvdSHV2">
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
  </StripeProvider>,
  document.getElementById("root")
);
