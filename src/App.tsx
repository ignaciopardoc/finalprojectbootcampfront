import React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Provider from "react";
import { Switch, Route } from "react-router-dom";
import BusinessRegister from "./components/BusinessRegister/BusinessRegister";

class App extends React.PureComponent<any, any> {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/register/business/">
            <BusinessRegister />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
