import React, { Fragment } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../../interfaces/IStore";
import { IUser } from "../../../../../interfaces/IToken";
import Swal from "sweetalert2";

const URL_UPDATE_PASSWORD = "http://localhost:3000/auth/updatePassword";

interface IGlobalProps {
  token: IUser;
}

interface IProps {
  passwordChanged(): void;
}

type TProps = IGlobalProps & IProps;
interface IState {
  password: string;
  confirmPassword: string;
  isFilled: boolean;
  isSame: boolean;
  isValidPassword: boolean;
  allOk: boolean;
}

class PasswordForm extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      password: "",
      confirmPassword: "",
      isFilled: false,
      isSame: false,
      allOk: false,
      isValidPassword: false
    };
  }

  changePassword = async () => {
    const token = this.props.token.token;
    const { password } = this.state;

    try {
      await fetch(`${URL_UPDATE_PASSWORD}`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({
          password
        })
      }).then(response => {
        if (response.status === 200) {
          this.props.passwordChanged();
          Swal.fire({
            title: "Contraseña actualizada correctamente",
            icon: "success"
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  checkPassword = () => {
    if (
      this.state.password.length !== 0 &&
      this.state.confirmPassword.length !== 0
    ) {
      this.setState({ isFilled: true });
    } else {
      this.setState({ isFilled: false });
    }

    if (this.state.password === this.state.confirmPassword) {
      this.setState({ isSame: true });
    } else {
      this.setState({ isSame: false });
    }

    if (
      this.state.isFilled &&
      this.state.isSame &&
      this.state.isValidPassword
    ) {
      this.setState({ allOk: true });
    } else {
      this.setState({ allOk: false });
    }
  };

  render() {
    this.checkPassword();
    console.log(this.state);
    let mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})");
    return (
      <Fragment>
        <h5>Intruduzca su nueva contraseña</h5>
        <input
          type="password"
          className="form-control"
          onChange={e => {
            this.setState({
              isValidPassword: mediumRegex.test(this.state.password)
            });
            this.setState({ password: e.target.value });
          }}
        />
        {!this.state.isValidPassword && (
          <span>
            La contraseña debe contener mayúsculas, minúsculas, números y ser
            mayor de 8 caracteres
          </span>
        )}
        <h5>Repita la contraseña</h5>
        <input
          type="password"
          className="form-control"
          onChange={e => this.setState({ confirmPassword: e.target.value })}
        />
        {!this.state.isSame &&
          this.state.password.length > 0 &&
          this.state.confirmPassword.length > 0 &&
          this.state.password.length <= this.state.confirmPassword.length && (
            <span>La contraseña no coincide</span>
          )}
        <div className="row">
          <button
            disabled={!this.state.allOk}
            onClick={() => this.changePassword()}
            className="btn btn-success mt-2"
          >
            Cambiar contraseña
          </button>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordForm);
