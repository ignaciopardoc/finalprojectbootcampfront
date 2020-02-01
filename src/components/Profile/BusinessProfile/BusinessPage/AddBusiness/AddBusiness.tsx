import React, { Fragment } from "react";
import "./style.css";
import { Map, TileLayer, Marker, Popup } from "leaflet";
import SVGOverlayExample from "./Map/Map";
import SimpleExample from "./Map/Map";
import MapExample from "./Map/Map";

const API_URL = "http://localhost:3000/business/getCategories";

interface IGlobalProps {}

interface IProps {}

type TProps = IGlobalProps & IProps;

interface IState {
  businessName: string;
  address: string;
  city: string;
  category: string;
  description: string;
  telephone: string;
  instagram: string;
  email: string;
  categories: [];
  zoom: number;
  latlon: any,
  lat: number
  lon: number
}

class AddBusiness extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      businessName: "",
      address: "",
      city: "",
      description: "",
      category: "",
      telephone: "",
      instagram: "",
      email: "",
      categories: [],
      latlon: undefined,
      zoom: 0,
      lat: 0,
      lon: 0
    };
  }

  searchByAdress = async (address: string) => {
    fetch(
      `https://nominatim.openstreetmap.org/search/${address}?format=json&addressdetails=1&limit=1&polygon_svg=1`
    ).then( async (response) => {
       const json = await response.json()
      console.log(json)

        const result = [json[0].lat, json[0].lon];
        this.setState({lat: json[0].lat})
        this.setState({lon: json[0].lon})
        this.setState({latlon: result });
        this.setState({ zoom: 17 });
    })  
  };

  getCategories = async () => {
    const response = await fetch(API_URL);
    const json = await response.json();
    this.setState({ categories: json });
  };

  componentDidMount() {
    this.getCategories();
  }

  render() {
    console.log(this.state)
    return (
      <Fragment>
        <div className="row addBusinessContainer">
          {/* First column */}
          <div className="col-3">
            <div className="row">
              <div className="form-group">
                <label>Nombre de la empresa</label>
                <input
                  maxLength={45}
                  type="text"
                  className="form-control"
                  value={this.state.businessName}
                  onChange={e => {
                    this.setState({ businessName: e.target.value });
                  }}
                  placeholder="Nombre de la empresa"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  rows={5}
                  cols={50}
                  className="form-control"
                  value={this.state.description}
                  onChange={e => {
                    this.setState({ description: e.target.value });
                  }}
                  placeholder="Descripción"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Categoría</label>
                <select
                  className="custom-select"
                  onChange={e => this.setState({ category: e.target.value })}
                >
                  <option value="null">Seleccione Categoría</option>
                  {this.state.categories.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Añadir
            </button>
          </div>
          {/* Second Column */}
          <div className="col-3">
            <div className="row">
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  maxLength={12}
                  type="number"
                  className="form-control"
                  value={this.state.telephone}
                  onChange={e => {
                    this.setState({ telephone: e.target.value });
                  }}
                  placeholder="Teléfono de contacto"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Email</label>
                <input
                  maxLength={12}
                  type="number"
                  className="form-control"
                  value={this.state.email}
                  onChange={e => {
                    this.setState({ email: e.target.value });
                  }}
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Instagram</label>
                <input
                  maxLength={12}
                  type="text"
                  className="form-control instagramInput"
                  value={this.state.instagram}
                  onChange={e => {
                    this.setState({ instagram: e.target.value });
                  }}
                  placeholder="Instagram"
                />
              </div>
            </div>
          </div>
          <div className="col-6 leaflet-container">
            <MapExample searchByAdress={this.searchByAdress} zoom={this.state.zoom} latlon={this.state.latlon}/>
            
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AddBusiness;
