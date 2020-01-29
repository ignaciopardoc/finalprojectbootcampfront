import React from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Provider from "react";
import { Router, Switch, Route } from "react-router-dom";

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/register">
            <Register />
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
