import React, { Fragment } from "react";
import HomeMap from "./HomeMap/HomeMap";

const URL_GET_MAP = "http://localhost:3000/business/getBusinessMap";

interface businessDB {
  id: number;
  businessName: string;
  description: string;
  category: string;
  address: string;
  city: string;
  postcode: string;
  lat: number;
  lon: number;
  telephone: string;
  email: string;
  instagram: string;
  mainImagePath: string;
  user_id: number;
}

interface IState {
  businessOnMap: businessDB[];
  latBottom: number | null;
  latTop: number | null;
  lonRight: number | null;
  lonLeft: number | null;
  lastCall: number | null;
}

class Home extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      businessOnMap: [],
      latBottom: null,
      latTop: null,
      lonRight: null,
      lonLeft: null,
      lastCall: null
    };
  }

  // getBusinessesByCoord = async () => {
  //   const {latBottom,
  //     latTop,
  //     lonLeft,
  //     lonRight} = this.state
  //   await fetch(URL_GET_MAP, {
  //     method: "POST",
  //     headers: new Headers({
  //       "Content-Type": "application/json"
  //     }),
  //     body: JSON.stringify({
  //       latBottom,
  //       latTop,
  //       lonLeft,
  //       lonRight
  //     })
  //   }).then(async response => {
  //     const json = await response.json();
  //     this.setState({ businessOnMap: json });
  //   });
  // };

  getBusinessesByCoord = async (
    latBottom: number,
    latTop: number,
    lonLeft: number,
    lonRight: number
  ) => {
    await fetch(URL_GET_MAP, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        latBottom,
        latTop,
        lonLeft,
        lonRight
      })
    }).then(async response => {
      const json = await response.json();
      this.setState({...this.state, businessOnMap: json });
    });
  };

  render() {
    
    return (
      <Fragment>
        <HomeMap businessOnMap={this.state.businessOnMap} getBusinessesByCoord={this.getBusinessesByCoord}/>
      </Fragment>
    );
  }
}

export default Home;
