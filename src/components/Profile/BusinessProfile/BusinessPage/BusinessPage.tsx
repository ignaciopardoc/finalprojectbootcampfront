import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import { disconnect } from "cluster";
import AddBusiness from "./AddBusiness/AddBusiness";
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
    const token = this.props.token.token
    
    const response = await fetch(API_URL, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      })
    });
    const json = await response.json();
    this.setState({...this.state, business: json });
  };

  componentDidMount() {
    setTimeout(() => {
      this.getBusinessInfo();
    }, 1);
  }

  render() {
    console.log(this.props.token.token)
    return (
      <div>
        <div className="row">
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
            <button className="btn btn-danger"
              onClick={() =>
                this.setState(({ showAddBusiness }) => ({
                  showAddBusiness: !showAddBusiness
                }))
              }
            >
              CLOSE ADD BUSINESS
            </button>
          )}
          
        </div>
        {this.state.showAddBusiness && <AddBusiness />}
        <div className="row">
          {this.state.business.map(b => (
            <div>
              <div className="col">{b.businessName}</div>
              <div className="col">{b.address}</div>
              <div className="col">{b.city}</div>
              <div className="col">{b.category}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessPage);
