import React from "react";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import { connect } from "react-redux";
const API_URL = "http://localhost:3000/auth/getInfoUser";

interface IGlobalProps {
  token: IUser;
}

interface IUserDB {
  id: number | null;
  email: string;
  username: string;
}

interface IState {
  user: IUserDB;
}

interface IProps {}

type TProps = IGlobalProps & IProps;

class UserInfo extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      user: {
        id: null,
        email: "",
        username: ""
      }
    };
  }
  getuserinfo = async () => {
    const token = this.props.token.token;
    const response = await fetch(API_URL, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      })
    });
    const json = await response.json();
   
    this.setState({ ...this.state, user: json });
    
    
  };
  componentWillMount() {
    setTimeout(() => {
      this.getuserinfo();
    }, 1);
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <p>{this.state.user.id}</p>
            <p>{this.state.user.username}</p>
            <p>{this.state.user.email}</p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
