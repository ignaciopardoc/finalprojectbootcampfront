import React from "react";
import "./style.css";
import BusinessPage from "./BusinessPage/BusinessPage";

import { Route, Link } from "react-router-dom";
import EditBusiness from "./BusinessPage/EditBusiness/EditBusiness";
import BusinessOwnerInfo from "./UserInfo/BusinessOwnerInfo";

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
        <div className="col-1"></div>{" "}
        <div className="col-1 profileNavbar">
          <Link to="/profile">
            <div className="row">Información de usuario</div>
          </Link>
          <hr />
          <Link to="/profile/businessPage">
            <div className="row">Tus negocios</div>
          </Link>
        </div>
        <div className="col-11">
          <Route exact path={"/profile"}>
            <BusinessOwnerInfo />
          </Route>
          <Route exact path={"/profile/businessPage"}>
            {" "}
            <BusinessPage />{" "}
          </Route>
          <Route exact path={"/profile/editBusiness/:business_id"}>
            <EditBusiness />
          </Route>
        </div>
      </div>
    );
  }
}

export default BusinessProfile;
