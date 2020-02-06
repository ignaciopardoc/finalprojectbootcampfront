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

interface IGlobalProps {
  logged: ILogged;
}

interface IProps {
  setLogged(logged: ILogged): void;
}

type TProps = IGlobalProps & IProps;

class Navbar extends React.PureComponent<TProps> {
  logout = () => {
    this.props.setLogged({ logged: false });
    localStorage.removeItem("token");
    history.push("/");
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src={logo} height="50" alt="" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link to="/">
                  <a className="nav-link">
                    Home <span className="sr-only">(current)</span>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Link
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Dropdown
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="#">
                  Disabled
                </a>
              </li>
            </ul>
            <form className="form-inline my-2 my-lg-0 linknavbar">
              {!this.props.logged.logged && (
                <div>
                  <Link to="/register">
                    <a> Registro</a>
                  </Link>

                  <Link to="/login">
                    {" "}
                    <a>Login</a>
                  </Link>
                </div>
              )}

              {this.props.logged.logged && (
                <div>
                  <Link to="/profile">
                    <a>Perfil</a>
                  </Link>
                  <img
                    className="logoutIcon"
                    src={logoutIcon}
                    onClick={this.logout}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ logged }: IStore): IGlobalProps => ({
  logged
});

const mapDispatchToProps = {
  setLogged: setLoggedAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
