import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import { disconnect } from "cluster";
import AddBusiness from "./AddBusiness/AddBusiness";
import "./style.css";
import { Link } from "react-router-dom";
const API_URL = "http://localhost:3000/business/getInfoUserBusiness";

interface IGlobalProps {
  token: IUser;
}

interface IProps {}

type TProps = IGlobalProps & IProps;

interface IBusinessDB {
  businessName: string;
  address: string;
  city: string;
  category: string;
  mainImagePath: string;
  id: number;
}

interface IState {
  business: IBusinessDB[];
  showAddBusiness: boolean;
}

class BusinessPage extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      business: [],
      showAddBusiness: false
    };
  }
  getBusinessInfo = async () => {
    const token = this.props.token.token;

    const response = await fetch(API_URL, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      })
    });
    const json = await response.json();
    this.setState({ ...this.state, business: json });
  };

  componentDidMount() {
    setTimeout(() => {
      this.getBusinessInfo();
    }, 1);
  }

  businessCreated = () =>{
    this.setState((showAddBusiness) => ({showAddBusiness: !showAddBusiness}))
    this.getBusinessInfo()
  }

  render() {
    console.log(this.props.token.token);
    return (
      <div>
        <div className="row mainContainer">
          {!this.state.showAddBusiness && (
            <button
              className="btn btn-success"
              onClick={() =>
                this.setState(({ showAddBusiness }) => ({
                  showAddBusiness: !showAddBusiness
                }))
              }
            >
              Añadir empresa
            </button>
          )}
          {this.state.showAddBusiness && (
            <button
              className="btn btn-danger"
              onClick={() => {
                this.getBusinessInfo();
                this.setState(({ showAddBusiness }) => ({
                  showAddBusiness: !showAddBusiness
                }));
              }}
            >
              Cerrar
            </button>
          )}
        </div>
        {this.state.showAddBusiness && <AddBusiness businessCreated={this.businessCreated} />}
        {!this.state.showAddBusiness && (
          <div className="row cardContainer">
            {this.state.business.map(b => (
              <div className="col-2">
                <div className="card businessCard">
                  <div
                    className="card-img-top divimagetop"
                    style={{
                      backgroundImage: `url(http://localhost:3000/public/avatar/${b.mainImagePath})`
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{b.businessName}</h5>
                    <p className="card-text">{b.address}</p>
                    <p className="card-text">{b.city}</p>
                    <p className="card-text">{b.category}</p>
                    <Link to={`/profile/editBusiness/${b.id}`}>
                      <a className="btn btn-primary">Editar</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessPage);
