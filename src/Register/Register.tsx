import React from "react";
import "./style.css";

interface IProps {}

interface IState {
  email: string;
  repeatEmail: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

class Register extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      email: "",
      repeatEmail: "",
      username: "",
      password: "",
      passwordConfirm: ""
    };
  }

  render() {
    console.log(this.state.email);
    return (
      <div className="row login">
        <div className="col-6 "></div>
        <div className="col-6">
          <h1 className="">¡Regístrate!</h1>
          <form action="">
            <div className="row">
              <div className="col">
                <input
                  value={this.state.email}
                  onChange={e => this.setState({ email: e.target.value })}
                  type="email"
                  className="form-control"
                  placeholder="Correo"
                />
              </div>
              <div className="col">
                <input
                  value={this.state.repeatEmail}
                  onChange={e => this.setState({ repeatEmail: e.target.value })}
                  type="email"
                  className="form-control"
                  placeholder="Repite el correo"
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <input
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                />
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
            <button className="btn btn-success">Enviar</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
