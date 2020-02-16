import React from "react";
import "./style.css";
import BusinessPage from "./BusinessPage/BusinessPage";

import { Route, Link } from "react-router-dom";
import EditBusiness from "./BusinessPage/EditBusiness/EditBusiness";
import BusinessOwnerInfo from "./UserInfo/BusinessOwnerInfo";
import ManageEvents from "./ManageEvents/ManageEvents";
import { connect } from "react-redux";
import { IStore } from "../../../interfaces/IStore";
import Swal from "sweetalert2";
import EditEvents from "./ManageEvents/EditEvents/EditEvents";

interface IState {
  selectedItem: number;
}

interface IGlobalProps {
  isPremium: boolean;
}

interface IProps {}

type TProps = IGlobalProps & IProps;

class BusinessProfile extends React.PureComponent<TProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = { selectedItem: 0 };
  }

  setNavbar = (selected: number) => {
    this.setState({ selectedItem: selected });
  };

  render() {
    const { isPremium } = this.props;
    return (
      <div className="row navbarLeft">
        <div className="col-md-1 col-12"></div>{" "}
        <div className="col-md-1 col-12 profileNavbar">
          <Link to="/profile">
            <div
              className={`row ${
                this.state.selectedItem === 0 ? `selectedItem` : null
              }`}
            >
              Información de usuario
            </div>
          </Link>
          <Link to="/profile/businessPage">
            <div
              className={`row ${
                this.state.selectedItem === 1 ? `selectedItem` : null
              }`}
            >
              Tus negocios
            </div>
          </Link>
          {isPremium ? (
            <Link to="/profile/manageEvents">
              <div
                className={`row ${
                  this.state.selectedItem === 2 ? `selectedItem` : null
                }`}
              >
                Eventos
              </div>
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
            <BusinessOwnerInfo setNavbar={this.setNavbar} />
          </Route>
          <Route exact path={"/profile/businessPage"}>
            {" "}
            <BusinessPage setNavbar={this.setNavbar} />{" "}
          </Route>
          <Route exact path={"/profile/editBusiness/:business_id"}>
            <EditBusiness setNavbar={this.setNavbar} />
          </Route>
          <Route exact path="/profile/manageEvents">
            <ManageEvents setNavbar={this.setNavbar} />
          </Route>
          <Route exact path="/profile/editEvent/:eventId">
            <EditEvents setNavbar={this.setNavbar} />
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
