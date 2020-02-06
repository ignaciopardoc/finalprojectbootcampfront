import React, { Fragment, createRef } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import "./style.css";
import { myFetchFiles } from "../../../../utils/MyFetch";
import PasswordForm from "./PasswordForm/PasswordForm";
import Swal from "sweetalert2";
import jwt from "jsonwebtoken";
const API_GET_USER = "http://localhost:3000/auth/getInfoUser/";
const API_UPDATE_PERSONAL =
  "http://localhost:3000/auth/addPersonalInformation/";

interface IGlobalProps {
  token: IUser;
}

interface IToken {
  isBusiness: boolean;
}

interface IUserDB {
  id: number | null;
  email: string;
  username: string;
  name: string;
  surname: string;
  profilePicture: string;
  address: string;
  city: string;
  postcode: string;
}

interface IState {
  user: IUserDB;
  editPassword: boolean;
  editPersonalInfo: boolean;
}

interface IProps {}

type TProps = IGlobalProps & IProps;

class DogOwnerInfo extends React.PureComponent<TProps, IState> {
  avatar: React.RefObject<HTMLInputElement>;
  constructor(props: TProps) {
    super(props);
    this.avatar = createRef();
    this.state = {
      user: {
        id: null,
        email: "",
        username: "",
        name: "",
        surname: "",
        profilePicture: "",
        address: "",
        city: "",
        postcode: ""
      },
      editPassword: false,
      editPersonalInfo: false
    };
  }

  passwordChanged = () => {
    this.setState({ editPassword: false });
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
    this.setState({ ...this.state, user: json });
  };

  setPhoto = async (userId: number) => {
    if (this.avatar.current?.files) {
      const formData = new FormData();
      const path = this.avatar.current.files[0];

      console.log(path);
      formData.append("avatar", path);
      await myFetchFiles({
        method: "POST",
        path: `auth/uploadAvatar/${userId}`,
        formData
      })
        .then(() => {
          this.getuserinfo();
        })
        .then(() => {
          if (this.avatar.current !== null) {
            this.avatar.current.value = "";
          }
        });
    }
  };

  addPersonalInfo = async () => {
    const token = this.props.token.token;
    const { name, surname, address, city, postcode } = this.state.user;

    try {
      await fetch(`${API_UPDATE_PERSONAL}`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({
          name,
          surname,
          address,
          city,
          postcode
        })
      }).then(response => {
        if (response.status === 200) {
          Swal.fire({
            title: "Datos actualizados correctamente",
            icon: "success"
          });
          this.setState({ editPersonalInfo: false });
          this.getuserinfo();
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.getuserinfo();
    }, 1);
    setTimeout(() => {
      const { name, surname, address, city, postcode } = this.state.user;

      const token = jwt.decode(this.props.token.token) as IToken;
      {
        !token.isBusiness &&
          !name &&
          !surname &&
          !address &&
          !city &&
          !postcode &&
          Swal.fire({
            title: "Por favor, complete su perfil",
            icon: "warning"
          }) &&
          this.setState({ editPersonalInfo: true });
      }
    }, 500);
  }
  render() {
    const {name, surname, address, city, postcode } = this.state.user
    return (
      <Fragment>
        <div className="row shadow-lg pb-4 pt-4 mt-5">
          {/* Primera columna */}
          <div className="col-md-4 col-12 shadow pb-3 pt-3 ml-3 mr-3">
            <h4>Email</h4>
            <p>{this.state.user.email}</p>
            <h4>Nombre de usuario</h4>
            <p>{this.state.user.username}</p>
            {!this.state.editPassword && (
              <button
                className="btn btn-warning"
                onClick={() => this.setState({ editPassword: true })}
              >
                Editar contraseña
              </button>
            )}
            {this.state.editPassword && (
              <button
                className="btn btn-danger"
                onClick={() => this.setState({ editPassword: false })}
              >
                Cancelar
              </button>
            )}
            {this.state.editPassword && (
              <PasswordForm passwordChanged={this.passwordChanged} />
            )}
          </div>

          {/* Segunda columna */}

          {/* Text information */}
          {!this.state.editPersonalInfo && (
            <div className="col-md-3 col-12 shadow pb-3 pt-3 mr-3">
              <h4>Nombre</h4>
              <p>{this.state.user.name}</p>
              <h4>Apellidos</h4>
              <p>{this.state.user.surname}</p>
              <h4>Dirección</h4>
              <h5>Calle</h5>
              <p>{this.state.user.address}</p>
              <h5>Ciudad</h5>
              <p>{this.state.user.city}</p>
              <h5>Código postal</h5>
              <p>{this.state.user.postcode}</p>
              <button
                className="btn btn-warning mt-2"
                onClick={() => this.setState({ editPersonalInfo: true })}
              >
                Editar Información
              </button>
            </div>
          )}

          {/* Edit information */}
          {this.state.editPersonalInfo && (
            <div className="col-md-3 col-12 editPersonalInfoForm shadow pb-3 pt-3 mr-3">
              <h4>Nombre</h4>
              <input
                className="form-control"
                type="text"
                name=""
                id=""
                value={this.state.user.name}
                onChange={e => {
                  const newValue = e.target.value;
                  this.setState(state => ({
                    user: {
                      ...state.user,
                      name: newValue
                    }
                  }));
                }}
              />

              <h4>Apellidos</h4>
              <input
                className="form-control"
                type="text"
                name=""
                id=""
                value={this.state.user.surname}
                onChange={e => {
                  const newValue = e.target.value;
                  this.setState(state => ({
                    user: {
                      ...state.user,
                      surname: newValue
                    }
                  }));
                }}
              />
              <h4>Dirección</h4>
              <h5>Calle</h5>
              <input
                className="form-control"
                type="text"
                name=""
                id=""
                value={this.state.user.address}
                onChange={e => {
                  const newValue = e.target.value;
                  this.setState(state => ({
                    user: {
                      ...state.user,
                      address: newValue
                    }
                  }));
                }}
              />
              <h5>Ciudad</h5>
              <input
                className="form-control"
                type="text"
                name=""
                id=""
                value={this.state.user.city}
                onChange={e => {
                  const newValue = e.target.value;
                  this.setState(state => ({
                    user: {
                      ...state.user,
                      city: newValue
                    }
                  }));
                }}
              />
              <h5>Código postal</h5>
              <input
                className="form-control"
                type="text"
                name=""
                id=""
                value={this.state.user.postcode}
                onChange={e => {
                  const newValue = e.target.value;
                  this.setState(state => ({
                    user: {
                      ...state.user,
                      postcode: newValue
                    }
                  }));
                }}
              />
              <button
                className="btn btn-danger mt-2 mr-1"
                onClick={() => {
                  this.getuserinfo();
                  this.setState({ editPersonalInfo: false });
                }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-success mt-2 "
                onClick={() => this.addPersonalInfo()}
                disabled={!name || !surname || !address || !city || !postcode}
              >
                Guardar
              </button>
            </div>
          )}

          {/* Tercera columna */}
          <div className="col-md-4 avatarDiv col-12 shadow pb-3 pt-3 ">
            <div
              className="avatarImgDiv"
              style={{
                backgroundImage: this.state.user.profilePicture
                  ? `url(http://localhost:3000/public/userAvatar/${this.state.user.profilePicture})`
                  : `url(http://localhost:3000/public/userAvatar/noAvatar.svg)`
              }}
            ></div>
            <div className="row">
              <h3>Actualizar foto de perfil</h3>

              <input type="file" id="uploadInput" name="" ref={this.avatar} />
            </div>
            <div className="row">
              <button
                className="btn btn-success mt-2"
                onClick={() => this.setPhoto(Number(this.state.user.id))}
              >
                Cambiar avatar
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DogOwnerInfo);
