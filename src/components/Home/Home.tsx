import React, { Fragment } from "react";
import HomeMap from "./HomeMap/HomeMap";
import CardSection from "../CardSection/CardSection ";
import "./style.css";
import Swal from "sweetalert2";

const API_CATEGORIES = "http://localhost:3000/business/getCategories";

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
  searchInput: string;
  latlon: number[];
  zoom: number | null;
  categories: [];
  category: string;
}

class Home extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      businessOnMap: [],
      latBottom: 0,
      latTop: 0,
      lonRight: 0,
      lonLeft: 0,
      searchInput: "",
      latlon: [],
      zoom: null,
      categories: [],
      category: ""
    };
  }

  searchByAdress = async () => {
    fetch(
      `https://nominatim.openstreetmap.org/search/${this.state.searchInput}?format=json&addressdetails=1&limit=1&polygon_svg=1`
    ).then(async response => {
      const json = await response.json();
      console.log(json);
      if (json !== undefined) {
        //Separate second length to avoid crash of the app
        if (json.length) {
          //Result is only used for the map
          console.log(json);
          this.setState({ latlon: [json[0].lat, json[0].lon], zoom: 15 });
        } else {
          Swal.fire({
            title: "No se ha encontrado ninguna dirección",
            text: "Inténtelo de nuevo",
            icon: "warning"
          });
        }
      }
    });
  };

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

  getCategories = async () => {
    const response = await fetch(API_CATEGORIES);
    const json = await response.json();
    this.setState({ categories: json });
  };

  getBusinessesByCoord = async (
    latBottom: number,
    latTop: number,
    lonLeft: number,
    lonRight: number
  ) => {
    this.setState({ latBottom, latTop, lonLeft, lonRight });
    const { category } = this.state;
    await fetch(URL_GET_MAP, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        latBottom,
        latTop,
        lonLeft,
        lonRight,
        category
      })
    }).then(async response => {
      const json = await response.json();
      this.setState({ ...this.state, businessOnMap: json });
    });
  };

  getBusinessesByCoordAndCategory = async () => {
    const { latBottom, lonLeft, latTop, lonRight, category } = this.state;
    await fetch(URL_GET_MAP, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        latBottom,
        latTop,
        lonLeft,
        lonRight,
        category
      })
    }).then(async response => {
      const json = await response.json();
      this.setState({ ...this.state, businessOnMap: json });
    });
  };

  componentDidMount() {
    this.getCategories();
  }

  render() {
    return (
      <Fragment>
        <div className="container containerHome">
          <h1 className="text-center pt-3">Descubre los mejores lugares para perros de tu ciudad</h1>
          <div className="row">
            <div className="col-9">
              <input
                type="text"
                className="form-control inputHome"
                onChange={e => this.setState({ searchInput: e.target.value })}
                value={this.state.searchInput}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    this.searchByAdress();
                  }
                }}
                placeholder="Buscar por dirección"
              />
            </div>
            <div className="col-3">
              <select
                className="custom-select inputHome"
                onChange={e => {
                  this.setState({ category: e.target.value });
                  setTimeout(() => {
                    this.getBusinessesByCoordAndCategory();
                  }, 20);
                }}
              >
                <option value="null">Filtrar por categoría</option>
                {this.state.categories.map((c, i) => (
                  <option value={c} key={i}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <HomeMap
            businessOnMap={this.state.businessOnMap}
            getBusinessesByCoord={this.getBusinessesByCoord}
            latlon={this.state.latlon}
            zoom={this.state.zoom}
          />
          



          {/* <CardSection  /> */}
        </div>
      </Fragment>
    );
  }
}

export default Home;
