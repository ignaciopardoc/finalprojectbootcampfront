import React from "react";
import "./style.css";
import { throws } from "assert";
import UserInfo from "./UserInfo/UserInfo";
import BusinessPage from "./BusinessPage/BusinessPage";

interface IState {
  selectedNavbar: number;
  selectedSelection: number;
}

class BusinessProfile extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = { selectedNavbar: 0, selectedSelection: 0 };
  }

  render() {

    
    return (
      <div className="row">
        <div className="col-1 profileNavbar">
          <div
            className="row"
            onClick={() => this.setState({ selectedNavbar: 0 })}
          >
            Información de usuario
          </div>
          <hr/>
          <div
            className="row"
            onClick={() => this.setState({ selectedNavbar: 1 })}
          >
            BusinessPage
          </div>
          
        </div>
        <div className="col-11">
            {this.state.selectedNavbar === 0 && <UserInfo />}
            {this.state.selectedNavbar === 1 && <BusinessPage />}
        </div>
      </div>
    );
  }
}

export default BusinessProfile;
