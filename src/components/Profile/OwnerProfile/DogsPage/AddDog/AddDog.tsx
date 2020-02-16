import React, { Fragment, createRef } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../../interfaces/IStore";
import { IUser } from "../../../../../interfaces/IToken";
import { myFetchFiles } from "../../../../../utils/MyFetch";
const URL_INSERT_DOG = "http://localhost:3000/dog/insertDog";

interface IState {
  name: string;
  sex: string;
  breed: string;
  description: string;
}

interface IProps {}

interface IGlobalProps {
  token: IUser;
}

type TProps = IProps & IGlobalProps;

class AddDog extends React.PureComponent<TProps, IState> {
  avatar: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    this.avatar = createRef();
    this.state = {
      name: "",
      sex: "",
      breed: "",
      description: ""
    };
  }

  addDog = async () => {
    const token = this.props.token.token;
    const { name, breed, sex } = this.state;
    const response = await fetch(`${URL_INSERT_DOG}`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        name,
        sex,
        breed
      })
    });

    const { insertId } = await response.json();

    this.setPhoto(insertId);
  };

  setPhoto = (dogId: number) => {
    if (this.avatar.current?.files) {
      const formData = new FormData();
      const path = this.avatar.current.files[0];

      formData.append("avatar", path);
      myFetchFiles({
        method: "POST",
        path: `dog/setMainPhoto/${dogId}`,
        formData
      }).then(json => {
        if (json) {
        }
      });
    }
  };

  render() {
    return (
      <Fragment>
        <div className="row mt-3">
          <div className="col-3">
            <p>Nombre de tu mascota</p>
            <input
              type="text"
              className="form-control"
              onChange={e => this.setState({ name: e.target.value })}
              value={this.state.name}
            />
            <p>Descripción</p>
            <input
              type="text"
              className="form-control"
              onChange={e => this.setState({ description: e.target.value })}
              value={this.state.description}
            />
            <p>Sexo de tu mascota</p>
            <select
              className="custom-select"
              onChange={e => this.setState({ sex: e.target.value })}
              value={this.state.sex}
            >
              <option value="null">Seleccione una opción</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
              <option value="Otro">Otro</option>
            </select>
            <p>Raza</p>
            <input
              type="text"
              className="form-control"
              onChange={e => this.setState({ breed: e.target.value })}
              value={this.state.breed}
            />
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                ref={this.avatar}
              />
              <label className="custom-file-label">Elija una foto</label>
            </div>{" "}
            <button
              className="btn btn-success mt-3"
              onClick={() => this.addDog()}
            >
              Añadir mascota
            </button>
          </div>

          <div className="row">
            <div className="col-2"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddDog);
