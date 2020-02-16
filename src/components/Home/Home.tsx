import React, { Fragment } from "react";
import HomeWithMap from "./HomeWithMap/HomeWithMap";
import HomeEventList from "./HomeEventList/HomeEventList";

interface IProps {}

interface IState {
  selectedOptionHome: number;
}

class Home extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedOptionHome: 0
    };
  }
  render() {
    return (
      <Fragment>
        <div className="container containerHome">
          <h1 className=" pt-3">
            Descubre los mejores lugares para perros de tu ciudad
          </h1>
          <div className="row d-flex justify-content-center mt-3">
            <button
              className={`mr-5 btn ${
                this.state.selectedOptionHome === 0
                  ? `btn-success`
                  : `btn-light`
              }`}
              onClick={() => this.setState({ selectedOptionHome: 0 })}
            >
              Mapa
            </button>
            <button
              className={`ml-5 btn ${
                this.state.selectedOptionHome === 1
                  ? `btn-success`
                  : `btn-light`
              }`}
              onClick={() => this.setState({ selectedOptionHome: 1 })}
            >
              Próximos eventos
            </button>
          </div>
          {this.state.selectedOptionHome === 0 && <HomeWithMap />}
          {this.state.selectedOptionHome === 1 && <HomeEventList />}
        </div>
      </Fragment>
    );
  }
}

export default Home;
