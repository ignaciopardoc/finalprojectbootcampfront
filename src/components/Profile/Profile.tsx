import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { ILogged } from "../../interfaces/ILogged";
import history from "../../utils/history";
import "./style.css";
import BusinessProfile from "./BusinessProfile/BusinessProfile";
import { setTokenAction } from "../../redux/actions";
import { IUser } from "../../interfaces/IToken";
import jwt from "jsonwebtoken";
import OwnerProfile from "./OwnerProfile/DogOwnerProfile";


interface IGlobalProps {
  logged: ILogged;
  token: IUser;
}



interface IProps {}

type TProps = IGlobalProps & IProps;

interface IState {
  isBusiness: boolean | null;
}

class Profile extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      isBusiness: null
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (!this.props.logged.logged) {
        history.push("/login");
      }
      let token = localStorage.getItem("token")
      
      if(token){
        const {isBusiness}: any = jwt.decode(token)
        this.setState({isBusiness: isBusiness})
          
      }
    }, 1);
  }
  render() {
    console.log(`isBusiness: ${this.state.isBusiness}`)
    return (
     <div>
       {!this.state.isBusiness && <OwnerProfile />}
       {this.state.isBusiness && <BusinessProfile />}
     </div>
    )
  }
}

const mapStateToProps = ({ logged, token }: IStore): IGlobalProps => ({
  logged,
  token
});

const mapDispatchToProps = {
  setToken: setTokenAction
};

export default connect(mapStateToProps)(Profile);
