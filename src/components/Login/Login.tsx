import React from "react";
import "./style.css";
import { connect } from "react-redux";
import {
  setTokenAction,
  setLoggedAction,
  setUserInfoAction,
  setPremiumAction
} from "../../redux/actions";
import { IUser } from "../../interfaces/IToken";
import Swal from "sweetalert2";
import { ILogged } from "../../interfaces/ILogged";
import { IStore } from "../../interfaces/IStore";
import history from "../../utils/history";
import jwt from "jsonwebtoken";
import { IUserInfo } from "../../interfaces/IUserInfo";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000/auth/auth";

interface IProps {
  setToken(token: IUser): void;
  setLogged(logged: ILogged): void;
  setInfo(UserInfo: IUserInfo): void;
  setPremium(isPremium: boolean): void;
}

interface IGlobalProps {
  logged: ILogged;
}

type TProps = IProps & IGlobalProps;

interface IState {
  username: string;
  password: string;
}

interface IToken {
  name: string;
  username: string;
  profilePicture: string;
  isPremium: boolean;
}

class Login extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  login = async () => {
    const { username, password } = this.state;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    if (response.status === 403) {
      Swal.fire({ icon: "error", title: "Usuario o contraseña no válidos" });
    } else if (response.status === 200) {
      const json = await response.json();
      const { name, username, profilePicture, isPremium } = jwt.decode(
        json
      ) as IToken;
      console.log(name, username, profilePicture);
      this.props.setInfo({
        name: name,
        username: username,
        photo: profilePicture
      });
      this.props.setPremium(isPremium);
      localStorage.setItem("token", json);
      this.props.setToken({ token: json });
      this.props.setLogged({ logged: true });
      history.push("/");
      Swal.fire({ icon: "success", title: "Logueado correctamente" });
    }
  };

  render() {
    if (this.props.logged.logged) {
      history.push("/");
    }
    return (
      <div className="row login">
        <div className="col-6"></div>
        <div className="col-4">
          <h1>¡Bienvenido de nuevo!</h1>

          <p>Usuario o email</p>
          <input
            placeholder="Nombre de usuario o email"
            className="form-control"
            type="text"
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <p>Contraseña</p>
          <input
            placeholder="Contraseña"
            className="form-control"
            type="password"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button
            onClick={this.login}
            className="customButton customButton-lg greenButton"
          >
            Enviar
          </button>
          <Link to="/register">
            <label className="ml-5">¿No tienes una cuenta? ¡Regístrate!</label>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ logged }: IStore): IGlobalProps => ({
  logged
});

const mapDispatchToProps = {
  setToken: setTokenAction,
  setLogged: setLoggedAction,
  setInfo: setUserInfoAction,
  setPremium: setPremiumAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
