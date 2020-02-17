import React, { Fragment } from "react";
import AddDog from "./AddDog/AddDog";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import "./style.css";
import { Link } from "react-router-dom";

const URL_GET_DOG = "http://localhost:3000/dog/getDogInfo";

interface IProps {
  setNavbar(selected: number): void;
}

interface IGlobalProps {
  token: IUser;
}

interface IDogsDB {
  name: string;
  description: string;
  photo: string;
  breed: string;
  id: number;
}

type TProps = IProps & IGlobalProps;

interface IState {
  showAddDogs: boolean;
  dogs: IDogsDB[];
}

class DogsPage extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      showAddDogs: false,
      dogs: []
    };
  }

  getDogInfo = async () => {
    const token = this.props.token.token;

    const response = await fetch(URL_GET_DOG, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      })
    });

    const json = await response.json();

    this.setState({ dogs: json });
  };

  componentDidMount() {
    setTimeout(() => {
      this.getDogInfo();
    }, 1);
    this.props.setNavbar(1);
  }

  render() {
    return (
      <Fragment>
        {!this.state.showAddDogs && (
          <button
            onClick={() =>
              this.setState(({ showAddDogs }) => ({
                showAddDogs: !showAddDogs
              }))
            }
            className="customButton greenButton"
          >
            Añadir mascota
          </button>
        )}
        {this.state.showAddDogs && (
          <button
            onClick={() =>
              this.setState(({ showAddDogs }) => ({
                showAddDogs: !showAddDogs
              }))
            }
            className="customButton customButton-danger"
          >
            Cerrar
          </button>
        )}

        {this.state.showAddDogs && (
          <div className="col-11">
            <AddDog />
          </div>
        )}

        {!this.state.showAddDogs && (
          <div className="row cardContainer">
            {this.state.dogs.map(d => (
              <div className="col-md-3 col-12" key={d.id}>
                <div className="card dogCard">
                  <div
                    className="card-img-top dogImage"
                    style={{
                      backgroundImage: `url(http://localhost:3000/public/dogPhoto/${d.photo})`
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{d.name}</h5>
                    <p className="card-text">{d.description}</p>
                    <Link to={`/profile/editDog/${d.id}`}>
                      <p className="customButton greenButton bottomButton float-center text-center">
                        Editar
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DogsPage);
