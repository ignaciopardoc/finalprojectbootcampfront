import React, { Fragment, createRef } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import "./style.css";
import { myFetchFiles } from "../../../../utils/MyFetch";
import PasswordForm from "./PasswordForm/PasswordForm";
import Swal4 from "sweetalert2";
import jwt from "jsonwebtoken";
import Swal from "sweetalert2";

import IBAN from "iban";
import {
  setUserInfoAction,
  setPremiumAction,
  setTokenAction
} from "../../../../redux/actions";
import { IUserInfo } from "../../../../interfaces/IUserInfo";
const API_GET_USER = "http://localhost:3000/auth/getInfoUser/";
const API_UPDATE_PERSONAL =
  "http://localhost:3000/auth/addPersonalInformation/";
const API_SET_IBAN = "http://localhost:3000/auth/makePremium";
const API_GET_TOKEN = "http://localhost:3000/auth/auth";

interface IGlobalProps {
  token: IUser;
  isPremium: boolean;
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
  showPremium: boolean;
  acceptedTerms: boolean;
  iban: string;
  correctIban: boolean;
  password: string;
}

interface IProps {
  setInfo(userInfo: IUserInfo): void;
  setPremium(isPremium: boolean): void;
  setToken(token: IUser): void;
}

type TProps = IGlobalProps & IProps;

class BusinessOwnerInfo extends React.PureComponent<TProps, IState> {
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
      editPersonalInfo: false,
      showPremium: false,
      acceptedTerms: false,
      iban: "",
      correctIban: false,
      password: ""
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
        .then(async () => {
          await this.getuserinfo();
          this.props.setInfo({
            photo: this.state.user.profilePicture,
            username: this.state.user.username,
            name: this.state.user.name
          });
        })
        .then(() => {
          if (this.avatar.current !== null) {
            this.avatar.current.value = "";
          }
        });
    }
  };

  getNewToken = async () => {
    const { password } = this.state;
    const { username } = this.state.user;
    await fetch(API_GET_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(async response => {
      const token = await response.json();
      localStorage.setItem("token", token);
      this.props.setToken(token);
    });
  };

  // Make send iban after check it
  makePremium = async () => {
    const token = this.props.token.token;
    const { iban, password } = this.state;
    const { username } = this.state.user;

    try {
      await fetch(API_GET_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }).then(async response => {
        console.log(response);
        if (response.status === 200) {
          await fetch(API_SET_IBAN, {
            method: "POST",
            headers: new Headers({
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }),
            body: JSON.stringify({
              iban
            })
          }).then(response2 => {
            console.log(response2);
            this.props.setPremium(true);
            this.getNewToken();
          });
        } else {
          Swal.fire({ title: "Contraseña incorrecta", icon: "error" });
        }
      });
    } catch (error) {
      console.log(error);
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
      }).then(async response => {
        if (response.status === 200) {
          Swal4.fire({
            title: "Datos actualizados correctamente",
            icon: "success"
          });
          this.setState({ editPersonalInfo: false });
          await this.getuserinfo();
          this.props.setInfo({
            photo: this.state.user.profilePicture,
            username: this.state.user.username,
            name: this.state.user.name
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  checkUserInfo = async () => {
    const { name, surname, address, city, postcode } = this.state.user;

    const token = jwt.decode(this.props.token.token) as IToken;
    
    {
      token.isBusiness &&
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
  };

  componentDidMount() {
    setTimeout(() => {
      this.getuserinfo();
    }, 1);

    setTimeout(() => {
      this.checkUserInfo();
    }, 500);
  }
  render() {
    const { name, surname, address, city, postcode } = this.state.user;
    return (
      <Fragment>
        <div className="container-fluid">
          <div className="row pb-4 pt-4 mt-3">
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
                  Calcelar
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
              </div>

              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="customFile"
                  ref={this.avatar}
                />
                <label className="custom-file-label">Elija una foto</label>
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
        </div>

        {!this.state.showPremium && !this.props.isPremium && (
          <div
            onClick={async () => {
              await this.checkUserInfo().then(() => {
                if (!this.state.editPersonalInfo) {
                  this.setState({ showPremium: true });
                }
              });
            }}
            className="container shadow pb-3"
          >
            <div className="row mt-3 pt-3">
              <div className="col-4">
                <h1>Hazte Premium:</h1>
              </div>
              <div className="col-md-6 col-12 ">
                <h1>Añade eventos</h1>
                <h1>Destaca tu negocio</h1>
                <h1>Y mucho más</h1>
                <h1>Todo por solo 29,99€/mes</h1>
              </div>
            </div>
          </div>
        )}

        {this.state.showPremium && !this.props.isPremium && (
          <div className="container shadow pb-3">
            <div className="row mt-3 pt-3">
              <div className="col-4">
                <h1>Hazte Premium:</h1>
              </div>
              <div className="col-md-6 col-12 ">
                <h1>¡Estás a un solo paso!</h1>
                <input
                  type="text"
                  name=""
                  className="form-control"
                  placeholder="Introduce tu IBAN"
                  onChange={e => {
                    this.setState({
                      iban: e.target.value.toUpperCase()
                    });
                    const validatedIban = IBAN.isValid(
                      e.target.value as string
                    );
                    console.log(validatedIban);
                    this.setState({ correctIban: validatedIban });
                  }}
                  value={this.state.iban}
                  id=""
                />
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={this.state.acceptedTerms}
                    onClick={() =>
                      this.setState(({ acceptedTerms }) => ({
                        acceptedTerms: !acceptedTerms
                      }))
                    }
                  />{" "}
                  <label>Acepto los términos y condiciones</label>
                </div>
                <label>Introduzca su contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
                />

                <button
                  onClick={() => this.makePremium()}
                  disabled={
                    !this.state.acceptedTerms ||
                    !this.state.correctIban ||
                    !this.state.password
                  }
                  className="btn btn-success"
                >
                  Enviar
                </button>
                <button
                  className="btn btn-danger ml-3"
                  onClick={() => this.setState({ showPremium: false })}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = ({ token, isPremium }: IStore): IGlobalProps => ({
  token,
  isPremium
});

const mapDispatchToProps = {
  setInfo: setUserInfoAction,
  setPremium: setPremiumAction,
  setToken: setTokenAction
};
export default connect(mapStateToProps, mapDispatchToProps)(BusinessOwnerInfo);
