import React, { Fragment, createRef } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../../interfaces/IStore";
import { IUser } from "../../../../../interfaces/IToken";
import { myFetchFiles } from "../../../../../utils/MyFetch";
import history from "../../../../../utils/history";


const URL_UPDATE_DOG = "http://localhost:3000/dog/updateDog/";
const API_GET_ONE = "http://localhost:3000/dog/getDogInfo/"

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

class EditDog extends React.PureComponent<TProps, IState> {
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

  getDogInfo = async () => {
    const businessId = history.location.pathname.split("/").slice(-1)[0]
    const response = await fetch(`${API_GET_ONE}${businessId}`)
    const json = await response.json()
    console.log(json)
    this.setState(this.state = json)
   }

   updateDog = async () => {
    const token = this.props.token.token;
    const id = history.location.pathname.split("/").slice(-1)[0];
    const { name, breed, description, sex } = this.state;

    try {
      await fetch(`${URL_UPDATE_DOG}${id}`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({
          name,
          breed,
          description,
          sex
        })
      });

      this.setPhoto(id);
      history.push("/profile/dogsPage");
    } catch (e) {
      console.log(e);
    }
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
          console.log(json);
        }
      });
    }
  };

  componentDidMount(){
      this.getDogInfo()
  }

  render() {
    return (
      <Fragment>
        <div className="row">
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
              name="sex"
              id=""
              className="custom-select"
              onChange={e => this.setState({ sex: e.target.value })}
              value={this.state.sex}
            >
              <option value="null" >Seleccione una opción</option>
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


            <input className="mt-3" type="file" name="" ref={this.avatar} id="" />
            <button className="btn btn-success mt-3" onClick={() => this.updateDog()}>Actualizar mascota</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditDog);
