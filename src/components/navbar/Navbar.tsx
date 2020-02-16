import logo from "../../images/logo.png";
import "./style.css";
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { ILogged } from "../../interfaces/ILogged";
import { setLoggedAction } from "../../redux/actions";
import logoutIcon from "../../icons/logout.svg";
import history from "../../utils/history";
import { IUser } from "../../interfaces/IToken";
import { IUserInfo } from "../../interfaces/IUserInfo";

const API_GET_USER = "http://localhost:3000/auth/getInfoUser/";

interface IGlobalProps {
  logged: ILogged;
  token: IUser;
  userInfo: IUserInfo;
}

interface IProps {
  setLogged(logged: ILogged): void;
}

type TProps = IGlobalProps & IProps;

interface IState {
  profilePicture: string;
  name: string;
}

class Navbar extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      name: "",
      profilePicture: ""
    };
  }

  logout = () => {
    this.props.setLogged({ logged: false });
    localStorage.removeItem("token");
    history.push("/");
  };

  getuserinfo = async () => {
    const token = this.props.token.token;
    const response = await fetch(API_GET_USER, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      })
    });
    const json = await response.json();
    console.log(json);

    if (json.name) {
      this.setState({ ...this.state, name: json.name });
    } else {
      this.setState({ name: json.username });
    }

    if (json.profilePicture) {
      this.setState({ ...this.state, profilePicture: json.profilePicture });
    } else {
      this.setState({ ...this.state, profilePicture: "noAvatar.svg" });
    }
  };

  componentDidMount() {
    setTimeout(() => {
      if (this.props.logged.logged) {
        this.getuserinfo();
      }
    }, 1);
  }

  render() {
    console.log(this.state);
    return (
      <nav className="navbar navbar-expand-lg navbar-light navbarPersonalized sticky-top">
        <div className="container-fluid">
          <div className="d-flex flex-grow-1">
            <span className="w-100 d-lg-none d-block"></span>
            <Link to="/">
              <p className="navbar-brand">
                <img src={logo} height="50" alt="Doggies in Town" />
              </p>
            </Link>
            <div className="w-100 text-right">
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#myNavbar7"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>
          <div
            className="collapse navbar-collapse flex-grow-1 text-right"
            id="myNavbar7"
          >
            {/* Right part when logged */}
            {this.props.logged.logged && (
              <ul className="navbar-nav ml-auto flex-nowrap">
                <li className="nav-item mr-2">
                  <p className="nav-link">{`¡Hola, ${
                    this.props.userInfo.name
                      ? this.props.userInfo.name
                      : this.props.userInfo.username
                  }!`}</p>
                </li>
                <li className="nav-item mr-2">
                  <div
                    style={{
                      backgroundImage: `url(http://localhost:3000/public/userAvatar/${
                        this.props.userInfo.photo
                          ? this.props.userInfo.photo
                          : `noAvatar.svg`
                      })`
                    }}
                    className="logoutIcon navbarImage"
                  />
                </li>
                <li className="nav-item mr-2">
                  <p className="nav-link">
                    <Link to="/profile">Perfil</Link>
                  </p>
                </li>
                <li className="nav-item">
                  <p className="nav-link">
                    <img
                      className="logoutIcon"
                      src={logoutIcon}
                      onClick={this.logout}
                      alt="Logout"
                    />
                  </p>
                </li>
              </ul>
            )}
            {/* Right not logged */}
            {!this.props.logged.logged && (
              <ul className="navbar-nav ml-auto flex-nowrap">
                <li className="nav-item mr-3">
                  <Link to="/register">
                    <p> Registro</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login">
                    {" "}
                    <p>Login</p>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({
  logged,
  token,
  userInfo
}: IStore): IGlobalProps => ({
  logged,
  token,
  userInfo
});

const mapDispatchToProps = {
  setLogged: setLoggedAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
