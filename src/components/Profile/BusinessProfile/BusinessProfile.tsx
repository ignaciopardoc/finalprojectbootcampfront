import React from "react";
import "./style.css";
import { throws } from "assert";
import UserInfo from "./UserInfo/UserInfo";
import BusinessPage from "./BusinessPage/BusinessPage";
import { Route, match, Link } from "react-router-dom";

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
          <Link to="/profile">
          <div
            className="row"
            
          >
            Información de usuario
          </div>
          </Link>
          <hr/>
          <Link to="/profile/businessPage">
          <div
            className="row"
          >
            BusinessPage
          </div>
          </Link>
        </div>
        <div className="col-11">
            <Route exact path={"/profile"}><UserInfo /></Route>
            <Route exact path={"/profile/businessPage"}> <BusinessPage /> </Route>
        </div>
      </div>
    );
  }
}

export default BusinessProfile;
