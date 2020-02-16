import React, { Fragment, createRef } from "react";
import "./style.css";
import MapExample from "./Map/Map";
import { connect } from "react-redux";
import { IStore } from "../../../../../interfaces/IStore";
import { IUser } from "../../../../../interfaces/IToken";
import { myFetchFiles } from "../../../../../utils/MyFetch";
const API_URL = "http://localhost:3000/business/getCategories";
const API_URL2 = "http://localhost:3000/business/insertBusiness";

interface IGlobalProps {
  token: IUser;
}

interface IProps {
  businessCreated(): void;
}

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
  zoom: number | null;
  latlon: number[];
  lat: number;
  lon: number;
  completeAddress: string;
  postcode: string;
  allFilled: boolean;
}

class AddBusiness extends React.PureComponent<TProps, IState> {
  avatar: React.RefObject<HTMLInputElement>;
  constructor(props: TProps) {
    super(props);

    this.avatar = createRef();

    this.state = {
      businessName: "",
      address: "",
      completeAddress: "",
      city: "",
      description: "",
      category: "",
      telephone: "",
      instagram: "",
      email: "",
      categories: [],
     
      latlon: [],
      zoom: null,
      lat: 0,
      lon: 0,
      postcode: "",
      allFilled: false
    };
  }
  //Send information to the database
  createBusiness = async () => {
    const token = this.props.token.token;

    const {
      businessName,
      address,
      description,
      category,
      telephone,
      email,
      lat,
      lon,
      city,
      postcode,
      instagram
    } = this.state;
    console.log(businessName);
    try {
      const response = await fetch(API_URL2, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({
          businessName,
          address,
          description,
          category,
          telephone,
          email,
          lat,
          lon,
          city,
          postcode,
          instagram
        })
      });

      const { insertId } = await response.json();
      this.uploadMain(insertId);

      this.props.businessCreated();
    } catch (e) {
      console.log(e);
    }
  };

  uploadMain(business_id: string) {
    if (this.avatar.current?.files) {
      const formData = new FormData();
      const path = this.avatar.current.files[0];

      console.log(path);
      formData.append("avatar", path);
      myFetchFiles({
        method: "POST",
        path: `business/setMainPhoto/${business_id}`,
        formData
      }).then(json => {
        if (json) {
          console.log(json);
        }
      });
    }
  }

  //Change address acording to the click the user does on the map
  changelatlng = async (lat: number, lon: number) => {
    const latlng = [lat, lon];
    this.setState({ latlon: latlng });
    this.setState({ lon: lon, lat: lat });
    await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    ).then(async response => {
      const json = await response.json();
      console.log(json);
      
      if (this.state.zoom !== null && this.state.zoom < 17) {
        this.setState({ zoom: 17 });
      }
      if (json.address.pedestrian) {
        this.setState({
          address: `${json.address.pedestrian}${
            json.address.house_number ? `, ${json.address.house_number}` : ""
          }`
        });
      } else if (json.address.road) {
        this.setState({
          address: `${json.address.road}${
            json.address.house_number ? `, ${json.address.house_number}` : ""
          }`
        });
      }

      this.setState({
        city: json.address.city ? json.address.city : this.state.city
      });
      this.setState({
        postcode:
          json.address.postcode !== undefined
            ? json.address.postcode
            : this.state.postcode
      });
    });
  };

  //Search addres by the input the user insert on input fields
  searchByAdress = async () => {
    const address = `${this.state.address} ${this.state.city} ${this.state.postcode}`;
    console.log(address);
    fetch(
      `https://nominatim.openstreetmap.org/search/${address}?format=json&addressdetails=1&limit=1&polygon_svg=1`
    ).then(async response => {
      const json = await response.json();
      console.log(json);
      if (json !== undefined) {
        //Separate second length to avoid crash of the app
        if (json.length) {
          //Result is only used for the map
          this.setState({ lat: json[0].lat, lon: json[0].lon });
          this.setState({ latlon: [json[0].lat, json[0].lon] });
          this.setState({ zoom: 17 });
          if (json[0].address.pedestrian) {
            this.setState({
              address: `${json[0].address.pedestrian}${
                json[0].address.house_number
                  ? `, ${json[0].address.house_number}`
                  : ""
              }`
            });
          }

          if (json[0].address.road) {
            this.setState({
              address: `${json[0].address.road}${
                json[0].address.house_number
                  ? `, ${json[0].address.house_number}`
                  : ""
              }`
            });
          }
          this.setState({
            city:
              json[0].address.city !== undefined
                ? json[0].address.city
                : this.state.city
          });
          this.setState({ postcode: json[0].address.postcode });
        }
      }
    });
  };

 

  //Get the categories from the enum on the DB
  getCategories = async () => {
    const response = await fetch(API_URL);
    const json = await response.json();
    this.setState({ categories: json });
  };

  componentDidMount() {
    this.getCategories();
  }

  render() {
    console.log(this.state);

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
            <label>Foto principal de su negocio</label>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                ref={this.avatar}
              />
              <label className="custom-file-label">Elija una foto</label>
            </div>
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
                  maxLength={100}
                  type="email"
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
                <label>Redes sociales</label>
                <div className="form-group">
                  <input
                    maxLength={400}
                    type="text"
                    className="form-control instagramInput"
                    value={this.state.instagram}
                    onChange={e => {
                      this.setState({ instagram: e.target.value });
                    }}
                    placeholder=" Perfil de instagram"
                  />
                </div>
                <div className="form-group mapInput">
                  <div className="row">
                    <label>Dirección de tu empresa</label>
                    <span>
                      Esta es la dirección que aparecerá sobre tu empresa,
                      revisa que esté correcta
                    </span>
                    <input
                      onChange={e => {
                        this.setState({ address: e.target.value });
                      }}
                      value={this.state.address}
                      type="text"
                      className="form-control"
                      placeholder="Calle y número"
                    />
                    <input
                      onChange={async e => {
                        this.setState({ city: e.target.value });
                      }}
                      value={this.state.city}
                      type="text"
                      className="form-control"
                      placeholder="Ciudad"
                    />
                    <input
                      onChange={e => {
                        this.setState({ postcode: e.target.value });
                      }}
                      value={this.state.postcode}
                      type="text"
                      className="form-control"
                      placeholder="Código postal"
                    />
                  </div>
                  <button
                    onClick={() => this.searchByAdress()}
                    className="btn btn-success"
                  >
                    {" "}
                    Buscar en el mapa
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Map column */}
          <div className="col-6">
          {this.state.zoom &&
            <MapExample
              changelatlng={this.changelatlng}
              zoom={this.state.zoom}
              latlon={this.state.latlon}
            />}
          </div>
          <button
            onClick={() => this.createBusiness()}
            className="btn btn-primary"
          >
            Añadir empresa
          </button>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddBusiness);
