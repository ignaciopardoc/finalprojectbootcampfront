import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { ILogged } from "../../interfaces/ILogged";
import history from "../../utils/history";

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
      <div className="row">
        <div className="col-1 profileNavbar">NAVBAR</div>

        <div className="col-11">PROFILE</div>
      </div>
    );
  }
}

const mapStateToProps = ({ logged }: IStore): IGlobalProps => ({
  logged
});

export default connect(mapStateToProps)(Profile);
