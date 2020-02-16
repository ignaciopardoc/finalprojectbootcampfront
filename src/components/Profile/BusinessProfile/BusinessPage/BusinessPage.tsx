import React, { Fragment } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import AddBusiness from "./AddBusiness/AddBusiness";
import "./style.css";
import { Link } from "react-router-dom";
import { businessDB } from "../../../../interfaces/businessDB";
const API_URL = "http://localhost:3000/business/getInfoUserBusiness";

interface IGlobalProps {
  token: IUser;
}

interface IProps {}

type TProps = IGlobalProps & IProps;



interface IState {
  business: businessDB[];
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

  businessCreated = () => {
    this.setState(showAddBusiness => ({ showAddBusiness: !showAddBusiness }));
    this.getBusinessInfo();
  };

  render() {
    return (
      <Fragment>
        <div className="row mainContainer pl-3">
          <div className="col-2">
            {!this.state.showAddBusiness && (
              <button
                className="buttonAddBusiness"
                onClick={() =>
                  this.setState(({ showAddBusiness }) => ({
                    showAddBusiness: !showAddBusiness
                  }))
                }
              >
                + Añadir empresa
              </button>
            )}

            {/* Button to close AddBusiness */}
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
        </div>

        {this.state.showAddBusiness && (
          <AddBusiness businessCreated={this.businessCreated} />
        )}

        {/* CARD container */}
        {!this.state.showAddBusiness && (
          <div className="row cardContainer container-fluid">
            {this.state.business.map(b => (
              <div className="col-2 mr-5 container-fluid" key={b.id}>
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
                      <p className="btn float-right editButton">Editar</p>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-2 justify-content-center">
              <div
                onClick={() =>
                  this.setState(({ showAddBusiness }) => ({
                    showAddBusiness: !showAddBusiness
                  }))
                }
                className="card card-body h-50 justify-content-center businessCard addBusinessCard"
              >
                <h1>+</h1>
              </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BusinessPage);
