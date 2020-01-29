import React from "react";
import "./style.css";
import { connect } from "react-redux";
import { setTokenAction } from "../../redux/actions";
import { IToken } from "../../interfaces/IToken";
import Swal from "sweetalert2";
const API_URL = "http://localhost:3000/auth/auth";

interface IProps {
  setToken(token: IToken): void;
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
    if (response.status === 403) {
      Swal.fire({ icon: "error", title: "Usuario o contraseña no válidos" });
    } else if (response.status === 200) {
      Swal.fire({ icon: "success", title: "Logueado correctamente" });
      const json = await response.json();
      localStorage.setItem("token", json);
      this.props.setToken(json);
    }
    console.log(response);
  };

  render() {
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

const mapStateToProps = () => ({});

const mapDispatchToProps = { setToken: setTokenAction };

export default connect(mapStateToProps, mapDispatchToProps)(Login);
