import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import { disconnect } from "cluster";
import AddBusiness from "./AddBusiness/AddBusiness";
import "./style.css"
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
  mainImagePath: string
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
              + ADD BUSINESS
            </button>
          )}
          {this.state.showAddBusiness && (
            <button
              className="btn btn-danger"
              onClick={() =>{
                this.getBusinessInfo()
                this.setState(({ showAddBusiness }) => ({
                  showAddBusiness: !showAddBusiness
                }))}
              }
            >
              CLOSE ADD BUSINESS
            </button>
          )}
        </div>
        {this.state.showAddBusiness && <AddBusiness />}
        {!this.state.showAddBusiness && <div className="row cardContainer">
          {this.state.business.map(b => (
            <div>
              <div className="card businessCard">
                <div className="card-img-top divimagetop" style={{backgroundImage: `url(http://localhost:3000/public/avatar/${b.mainImagePath})` }} />
                <div className="card-body">
                  <h5 className="card-title">{b.businessName}</h5>
                  <p className="card-text">{b.address}</p>
                  <p className="card-text">{b.city}</p>
                  <p className="card-text">{b.category}</p>
                  <a href="#" className="btn btn-primary">
                    Go somewhere
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>}
      </div>
    );
  }
}

const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessPage);
