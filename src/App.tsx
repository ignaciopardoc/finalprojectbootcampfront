import React, { Profiler } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Provider from "react";
import { Switch, Route } from "react-router-dom";
import BusinessRegister from "./components/BusinessRegister/BusinessRegister";
import Profile from "./components/Profile/Profile";
import { setLoggedAction, setTokenAction } from "./redux/actions";

import { ILogged } from "./interfaces/ILogged";
import { IStore } from "./interfaces/IStore";
import { connect } from "react-redux";
import { IUser } from "./interfaces/IToken";
import Home from "./components/Home/Home";

interface IGlobalProps {
  
}

interface IProps {
  setLogged(logged: ILogged): void;
  setToken(token: IUser): void
}

type TProps = IGlobalProps & IProps;

class App extends React.PureComponent<TProps, any> {
  componentDidMount() {
    let token = localStorage.getItem("token")
    if(token){
      this.props.setLogged({logged: true})
      this.props.setToken({token})
    }
  }



  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/"><Home /></Route>
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
  setToken: setTokenAction
};

export default connect(null, mapDispatchToProps)(App);
