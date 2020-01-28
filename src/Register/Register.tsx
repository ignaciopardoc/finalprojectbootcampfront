import React from "react";
import "./style.css";
import validate from "validate.js";

const API_URL = "http://localhost:3000/user/register";

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

class Register extends React.PureComponent<IProps, IState> {
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

  register = async () => {
    const { email, password, username } = this.state;
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });
    } catch (e) {
      console.log(e);
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

    const {} = this.state;

    let constraints = {
      from: {
        email: true
      }
    };
    let mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})");
    return (
      <div className="container-fluid login">
        <div className="row">
          <div className="col-6 "></div>
          <div className="col-5">
            <h1 className="">¡Regístrate!</h1>
            <form onSubmit={this.register}>
              <div className="row">
                <div className="col">
                  <input
                    value={this.state.email}
                    onChange={e => {
                      this.setState({ email: e.target.value });
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
                      console.log(mediumRegex.test(password));
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
                type="submit"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
