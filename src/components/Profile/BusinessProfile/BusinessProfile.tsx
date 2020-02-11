import React from "react";
import "./style.css";
import BusinessPage from "./BusinessPage/BusinessPage";

import { Route, Link } from "react-router-dom";
import EditBusiness from "./BusinessPage/EditBusiness/EditBusiness";
import BusinessOwnerInfo from "./UserInfo/BusinessOwnerInfo";
import ManageEvents from "./ManageEvents/ManageEvents";
import { connect } from "react-redux";
import { IStore } from "../../../interfaces/IStore";
import { IUser } from "../../../interfaces/IToken";
import Swal from "sweetalert2";

interface IState {
  selectedNavbar: number;
  selectedSelection: number;
}

interface IGlobalProps {
  isPremium: boolean;
}

interface IProps {}

type TProps = IGlobalProps & IProps;

class BusinessProfile extends React.PureComponent<TProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = { selectedNavbar: 0, selectedSelection: 0 };
  }

  render() {
    const { isPremium } = this.props;
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
          <hr />
          {isPremium ? (
            <Link to="/profile/manageEvents">
              <div className="row">Eventos</div>
            </Link>
          ) : (
            <div
              onClick={() => {
                Swal.fire({
                  title: "Opción solo disponible para usuarios Premium",
                  icon: "warning"
                });
              }}
            >
              <Link to="/profile/manageEvents" className="notEnabled">
                <div className="row notEnabled">Eventos</div>
              </Link>
            </div>
          )}
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
          <Route exact path="/profile/manageEvents">
            <ManageEvents />
          </Route>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ isPremium }: IStore): IGlobalProps => ({
  isPremium
});
export default connect(mapStateToProps)(BusinessProfile);
