import React, { Fragment, createRef } from "react";
import "./style.css";
import { Map, TileLayer, Marker, Popup } from "leaflet";
import SVGOverlayExample from "./Map/Map";
import SimpleExample from "./Map/Map";
import MapExample from "./Map/Map";
import { connect } from "react-redux";
import { IStore } from "../../../../../interfaces/IStore";
import { IUser } from "../../../../../interfaces/IToken";
import Swal from "sweetalert2";
import { myFetchFiles } from "../../../../../utils/MyFetch";
const API_URL = "http://localhost:3000/business/getCategories";
const API_URL2 = "http://localhost:3000/business/insertBusiness";
const GOOGLE_KEY = "AIzaSyB9kYRWo5-GTwGabX8aY33HmZ1NPjaVhkY";
const API_URL3 = "http://localhost:3000/business/caca";

interface IGlobalProps {
  token: IUser;
}

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
  latlon: any;
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
      // latlon: [40.41664, -3.70327],
      latlon: undefined,
      zoom: 6,
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

      const {insertId} = await response.json();
      this.uploadMain(insertId)

      //   if (this.avatar.current?.files) {
      //     console.log(response)
      //     const formData = new FormData();
      //     const path = this.avatar.current.files[0];
      //     const token = sessionStorage.getItem("token");
      //     console.log(path);
      //     formData.append("avatar", path);
      //     myFetchFiles({
      //       method: "POST",
      //       token: token as string,
      //       path: "business/setMainPhoto",
      //       formData
      //     }).then(json => {
      //       if (json) {
      //         console.log("aaaaaaaaaaaaa");
      //         console.log(json);
      //       }
      //     });
      //   }
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
      if (this.state.zoom < 17) {
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

  // searchByAdress = async (address: string) => {
  //   fetch(
  //     `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_KEY}`
  //   ).then(async response => {
  //     const json = await response.json();
  //     console.log(json);
  //     if (json.result[0].status !== -3) {
  //       //Result is only used for the map
  //       const result = [json.result[0].latitude, json.result[0].longitude];
  //       console.log(json);
  //       this.setState({ latlon: result });
  //       this.setState({ zoom: 17 });

  //       //This goes to the db
  //       this.setState({ lat: json.result[0].latitude });
  //       this.setState({ lon: json.result[0].longitude });
  //       this.setState({ completeAddress: `${json.result[0].road_name}, ${json.result[0].numpk_name}`    });

  //       this.setState({ postcode: json.result[0].zip });
  //       this.setState({ city: json.result[0].municipality });
  //     } else {
  //       Swal.fire({ icon: "error", title: "No se ha encontrado la dirección" });
  //     }
  //   });
  // };

  // searchByAdress = async (address: string) => {
  //   fetch(
  //     `http://www.cartociudad.es/CartoGeocoder/Geocode?address=${address}`
  //   ).then(async response => {
  //     const json = await response.json();
  //     console.log(json);
  //     if (json.result[0].status !== -3) {
  //       //Result is only used for the map
  //       const result = [json.result[0].latitude, json.result[0].longitude];
  //       console.log(json);
  //       this.setState({ latlon: result });
  //       this.setState({ zoom: 17 });

  //       //This goes to the db
  //       this.setState({ lat: json.result[0].latitude });
  //       this.setState({ lon: json.result[0].longitude });
  //       this.setState({ completeAddress: `${json.result[0].road_name}, ${json.result[0].numpk_name}`    });

  //       this.setState({ postcode: json.result[0].zip });
  //       this.setState({ city: json.result[0].municipality });
  //     } else {
  //       Swal.fire({ icon: "error", title: "No se ha encontrado la dirección" });
  //     }
  //   });
  // };

  // searchByAdress = async (address: string) => {
  //   fetch(
  //     `https://nominatim.openstreetmap.org/search/${address}?format=json&addressdetails=1&limit=1&polygon_svg=1`
  //   ).then(async response => {
  //     const json = await response.json();
  //     console.log(json);
  //     //Result is only used for the map
  //     const result = [json[0].lat, json[0].lon];
  //     this.setState({ latlon: result });
  //     this.setState({ zoom: 17 });

  //     //This goes to the db
  //     this.setState({ lat: json[0].lat });
  //     this.setState({ lon: json[0].lon });
  //     this.setState({
  //       completeAddress: `${json[0].address.road}, ${json[0].address.house_number}`
  //     });
  //     this.setState({ postcode: json[0].address.postcode });
  //     this.setState({ city: json[0].address.city });
  //   });
  // };

  // getCategories = async () => {
  //   const response = await fetch(API_URL);
  //   const json = await response.json();
  //   this.setState({ categories: json });
  // };

  // componentDidMount() {
  //   this.getCategories();
  // }
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
          this.setState({ latlon: [this.state.lat, this.state.lon] });
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

  // uploadMain = async () => {
  //   if (this.mainImage.current?.files?.length) {
  //     const formData = new FormData();
  //     console.log(this.mainImage.current?.files[0])
  //     formData.append("avatar", this.mainImage.current?.files[0]);

  //     await fetch(API_URL3, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       },
  //       method: "POST",
  //       body: formData
  //     });
  //     this.mainImage.current.value = "";
  //   }
  // };
  
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
            <input type="file" name="avatar" id="mainImage" ref={this.avatar} />

            
           
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
            <MapExample
              changelatlng={this.changelatlng}
              zoom={this.state.zoom}
              latlon={
                this.state.latlon !== undefined
                  ? this.state.latlon
                  : [40.41664, -3.70327]
              }
            />
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
