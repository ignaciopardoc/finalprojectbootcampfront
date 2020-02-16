import React from "react";
import "./style.css";
import validate from "validate.js";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import history from "../../utils/history";

const API_URL = "http://localhost:3000/auth/register";

interface IProps {}

interface IState {
  email: string;
  repeatEmail: string;
  username: string;
  password: string;
  passwordConfirm: string;
  isEmailCorrect: boolean;
  isPasswordCorrect: boolean;
  isAllOk: boolean;
  isEmailFormat: boolean;
  isValidPassword: boolean;
}

class BusinessRegister extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      email: "",
      repeatEmail: "",
      username: "",
      password: "",
      passwordConfirm: "",
      isEmailCorrect: false,
      isPasswordCorrect: false,
      isAllOk: false,
      isEmailFormat: true,
      isValidPassword: false
    };
  }

  register = async (isBusiness: number) => {
    const { email, password, username } = this.state;
    try {
      let response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password,
          isBusiness
        })
      });
      if (response.status === 409) {
        Swal.fire({ icon: "error", title: "Usuario o email ya registrado" });
      } else {
        Swal.fire({
          icon: "success",
          title: "Registrado correctamente"
        });
        history.push("/")
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Error en el registro"
      });
    }
  };
  render() {
    const {
      password,
      passwordConfirm,
      email,
      repeatEmail,
      isEmailCorrect,
      isPasswordCorrect,
      username,
      isEmailFormat,
      isAllOk,
      isValidPassword
    } = this.state;

    //Check if the password is the same
    password === passwordConfirm &&
    password.length > 0 &&
    passwordConfirm.length > 0
      ? this.setState({ isPasswordCorrect: true })
      : this.setState({ isPasswordCorrect: false });

    //Check if the email is the same
    email === repeatEmail && email.length > 0 && repeatEmail.length > 0
      ? this.setState({ isEmailCorrect: true })
      : this.setState({ isEmailCorrect: false });

    //Check if the all is correct, included the username length
    isEmailCorrect && isPasswordCorrect && username.length > 0 && isEmailFormat
      ? this.setState({ isAllOk: true })
      : this.setState({ isAllOk: false });

    let constraints = {
      from: {
        email: true
      }
    };
    let mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})");
    return (
      <div className="container-fluid registerBusiness">
        <div className="row">
          <div className="col-5 ">
            <Link to={"/register/business"}>
              <button className="btn btn-danger">Soy empresa</button>
            </Link>
            <h1>¡Regístrate EMPRESA!</h1>
            <div className="formulario">
              <div className="row">
                <div className="col">
                  <input
                    value={this.state.email}
                    onChange={e => {
                      this.setState({ email: e.target.value });
                    }}
                    onBlur={() => {
                      const validation = validate(
                        { from: this.state.email },
                        constraints
                      );
                      if (validation !== undefined) {
                        this.setState({ isEmailFormat: false });
                      } else {
                        this.setState({ isEmailFormat: true });
                      }
                    }}
                    type="email"
                    className="form-control"
                    placeholder="Correo"
                  />
                  {!isEmailFormat && email.length > 0 && (
                    <span>El email no es correcto</span>
                  )}
                </div>
                <div className="col">
                  <input
                    value={this.state.repeatEmail}
                    onChange={e => {
                      this.setState({ repeatEmail: e.target.value });
                    }}
                    type="email"
                    className="form-control"
                    placeholder="Repite el correo"
                  />
                  {!isEmailCorrect &&
                    email.length > 0 &&
                    repeatEmail.length > 0 &&
                    email.length <= repeatEmail.length && (
                      <span>El email no coincide</span>
                    )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <input
                    value={this.state.password}
                    onChange={e => {
                      this.setState({ password: e.target.value });
                      this.setState({
                        isValidPassword: mediumRegex.test(password)
                      });
                    }}
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                  />
                  {!isValidPassword && (
                    <span>
                      La contraseña debe contener mayúsculas, minúsculas,
                      números y ser mayor de 8 caracteres
                    </span>
                  )}
                  {isValidPassword && <span>Contraseña buena</span>}
                </div>
                <div className="col">
                  <input
                    value={this.state.passwordConfirm}
                    onChange={e =>
                      this.setState({ passwordConfirm: e.target.value })
                    }
                    type="password"
                    className="form-control"
                    placeholder="Repite la contraseña"
                  />
                  {!isPasswordCorrect &&
                    password.length > 0 &&
                    passwordConfirm.length > 0 &&
                    password.length <= passwordConfirm.length && (
                      <span>La contraseña no coincide</span>
                    )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <input
                    value={this.state.username}
                    onChange={e => this.setState({ username: e.target.value })}
                    type="text"
                    className="form-control"
                    placeholder="Nombre de usuario"
                  />
                </div>
              </div>
              <button
                disabled={!isAllOk}
                className="btn-lg btn btn-success"
                onClick={() => this.register(1)}
              >
                Enviar
              </button>
            </div>
          </div>
          <div className="col-1"></div>
          <div className="col-5">
            <Link to={"/register/"}>
              <button className="btn btn-light">Tengo un perro</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessRegister;
