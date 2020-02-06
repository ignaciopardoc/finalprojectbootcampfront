import React from "react";
import "./style.css";

// import UserInfo from "./UserInfo/UserInfo";
// import BusinessPage from "./BusinessPage/BusinessPage";

import { Route, match, Link } from "react-router-dom";
import DogsPage from "./DogsPage/DogsPage";
import EditDog from "./DogsPage/EditDog/EditDog";
import OwnerInfo from "./UserProfile/DogOwnerInfo";
import DogOwnerInfo from "./UserProfile/DogOwnerInfo";
// import EditBusiness from "./BusinessPage/EditBusiness/EditBusiness";

interface IState {
  selectedNavbar: number;
  selectedSelection: number;
}

class OwnerProfile extends React.PureComponent<any, IState> {
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
          <Link to="/profile/dogsPage">
          <div
            className="row"
          >
            Perros
          </div>
          </Link>
        </div>
        <div className="col-11">
            <Route exact path={"/profile"}><DogOwnerInfo /></Route>
            <Route exact path={"/profile/dogsPage"}> <DogsPage /> </Route>
            <Route exact path={"/profile/editDog/:dog_id"}>
              <EditDog/>
            </Route> 
        </div>
      </div>
    );
  }
}

export default OwnerProfile;
