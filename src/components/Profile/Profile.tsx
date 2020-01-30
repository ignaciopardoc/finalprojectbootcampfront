import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { ILogged } from "../../interfaces/ILogged";
import history from "../../utils/history";
import "./style.css"
import BusinessProfile from "./BusinessProfile/BusinessProfile";

interface IGlobalProps {
  logged: ILogged;
}

interface IProps {}

type TProps = IGlobalProps & IProps;

class Profile extends React.PureComponent<TProps> {
  componentDidMount() {
    if (!this.props.logged.logged) {
      history.push("/login");
    }
  }
  render() {
    return (
      <BusinessProfile />
    );
  }
}

const mapStateToProps = ({ logged }: IStore): IGlobalProps => ({
  logged
});

export default connect(mapStateToProps)(Profile);
