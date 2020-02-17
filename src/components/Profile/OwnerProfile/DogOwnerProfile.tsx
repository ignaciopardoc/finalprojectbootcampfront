import React from "react";
import "./style.css";

// import UserInfo from "./UserInfo/UserInfo";
// import BusinessPage from "./BusinessPage/BusinessPage";

import { Route, Link } from "react-router-dom";
import DogsPage from "./DogsPage/DogsPage";
import EditDog from "./DogsPage/EditDog/EditDog";
import DogOwnerInfo from "./UserProfile/DogOwnerInfo";
// import EditBusiness from "./BusinessPage/EditBusiness/EditBusiness";

interface IState {
  selectedItem: number
}

class OwnerProfile extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props)

    this.state={
      selectedItem: 0
    }
  }

  setNavbar = (selected: number) => {
    this.setState({ selectedItem: selected });
  };
  render() {
    return (
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1 "></div>
        <div className="col-12 col-sm-1 col-md-1 col-lg-1 col-xl-1 profileNavbar">
          <Link to="/profile">
            <div className={`row ${
                this.state.selectedItem === 0 ? `selectedItem` : null
              }`}>Información de usuario</div>
          </Link>
          <Link to="/profile/dogsPage">
            <div className={`row ${
                this.state.selectedItem === 1 ? `selectedItem` : null
              }`}>Tus perros</div>
          </Link>
        </div>
        <div className="col-11">
          <Route exact path={"/profile"}>
            <DogOwnerInfo setNavbar={this.setNavbar} />
          </Route>
          <Route exact path={"/profile/dogsPage"}>
            {" "}
            <DogsPage setNavbar={this.setNavbar} />{" "}
          </Route>
          <Route exact path={"/profile/editDog/:dog_id"}>
            <EditDog setNavbar={this.setNavbar} />
          </Route>
        </div>
      </div>
    );
  }
}

export default OwnerProfile;
