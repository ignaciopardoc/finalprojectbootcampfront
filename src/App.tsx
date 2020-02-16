import React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";

import { Switch, Route } from "react-router-dom";
import BusinessRegister from "./components/BusinessRegister/BusinessRegister";
import Profile from "./components/Profile/Profile";
import {
  setLoggedAction,
  setTokenAction,
  setUserInfoAction,
  setPremiumAction
} from "./redux/actions";
import jwt from "jsonwebtoken";

import { ILogged } from "./interfaces/ILogged";

import { connect } from "react-redux";
import { IUser } from "./interfaces/IToken";

import { IUserInfo } from "./interfaces/IUserInfo";
import Home from "./components/Home/Home";

interface IToken {
  name: string;
  username: string;
  profilePicture: string;
  isPremium: boolean;
}

interface IGlobalProps {}

interface IProps {
  setLogged(logged: ILogged): void;
  setToken(token: IUser): void;
  setInfo(userInfo: IUserInfo): void;
  setPremiun(isPremium: boolean): void;
}

type TProps = IGlobalProps & IProps;

class App extends React.PureComponent<TProps, any> {
  componentDidMount() {
    let token = localStorage.getItem("token");

    if (token) {
      const { name, username, profilePicture, isPremium } = jwt.decode(
        token
      ) as IToken;
      this.props.setInfo({
        name: name,
        username: username,
        photo: profilePicture
      });
      this.props.setPremiun(isPremium);
      this.props.setLogged({ logged: true });
      this.props.setToken({ token });
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/register/business/">
            <BusinessRegister />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setLogged: setLoggedAction,
  setToken: setTokenAction,
  setInfo: setUserInfoAction,
  setPremiun: setPremiumAction
};

export default connect(null, mapDispatchToProps)(App);
