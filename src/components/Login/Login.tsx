import React from "react";
import "./style.css";
import { connect } from "react-redux";
import { setTokenAction } from "../../redux/actions";
import { IToken } from "../../interfaces/IToken";
const API_URL = "http://localhost:3000/user/auth";

interface IProps {
  setToken(token: IToken): void
}

interface IState {
  username: string;
  password: string;
}

class Login extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
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
    const json = await response.json();
    console.log(json);
    localStorage.setItem("token", json);
    this.props.setToken(json)
  };

  render() {
    return (
      <div className="row login">
        <div className="col-6"></div>
        <div className="col-4">
          <h1>¡Bienvenido de nuevo!</h1>

          <p>Usuario</p>
          <input
            placeholder="Nombre de usuario"
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
            name=""
            id=""
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button onClick={this.login} className="btn btn-lg btn-success">
            Enviar
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = { setToken: setTokenAction}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
