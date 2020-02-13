import React, { Fragment } from "react";
import pin from "../../../icons/GREEN_PIN.svg";
import pinPremium from "../../../icons/BLACK_PIN.svg";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Rating from "react-rating";
import "./style.css";
import instagramLogo from "../../../icons/instagram.svg";
import { connect } from "react-redux";
import { IStore } from "../../../interfaces/IStore";
import { IUser } from "../../../interfaces/IToken";
import jwt from "jsonwebtoken"
const URL_GET_ONEBUSINESS = "http://localhost:3000/business/getOneBusiness/";
const URL_GET_EVENTS = "http://localhost:3000/event/getEventFromBusiness/";
const URL_GET_DOGS = "http://localhost:3000/dog/getDogsFromUser/";

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

interface DogsDB {
  id: number 
  name: string
   description: string
    photo: string
     breed: string 
     sex: string
      user_id: number
}

interface EventDB {
  event_id: string;
  event_name: string;
  event_description: string;
  startDate: string;
  endDate: string;
  business_id: string;
}

interface IState {
  selectedBusiness: businessDB;
  events: EventDB[];
  review: string;
  rate: number;
  dogs: DogsDB[]
  isBusiness: boolean
}

interface IProps {
  getBusinessesByCoord(
    latBottom: number,
    latTop: number,
    lonLeft: number,
    lonRight: number
  ): void;

  businessOnMap: businessDB[];
  businessOnMapPremium: businessDB[];
  latlon: number[];
  zoom: number | null;
}

interface IGlobalProps {
  token: IUser;
}

type TProps = IGlobalProps & IProps;

class HomeMap extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      selectedBusiness: {
        id: 0,
        businessName: "",
        description: "",
        category: "",
        address: "",
        city: "",
        postcode: "",
        lat: 0,
        lon: 0,
        telephone: "",
        email: "",
        instagram: "",
        mainImagePath: "",
        user_id: 0
      },
      events: [],
      review: "",
      rate: 0,
      dogs: [],
      isBusiness: false
    };
  }

  getDogs = async () => {
    const token = this.props.token.token;

    await fetch(URL_GET_DOGS, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      })
    }).then( async response => {
      const json = await response.json()
      this.setState({dogs: json as any})
    })
  };

  getInfo = async (id: number) => {
    await fetch(`${URL_GET_ONEBUSINESS}${id}`).then(async response => {
      const json = await response.json();
      this.setState({ selectedBusiness: json });
      console.log(this.state.selectedBusiness);
    });
  };

  // sendReview = async () => {
  //   fetch
  // }

  getEvents = async (id: number) => {
    await fetch(`${URL_GET_EVENTS}${id}`).then(async response => {
      const json = await response.json();
      this.setState({ events: json });
      console.log(this.state.events);
    });
  };

  componentDidMount() {
   setTimeout(() => {
    const {isBusiness} = jwt.decode(this.props.token.token) as any
    console.log(isBusiness)
    this.setState({isBusiness: isBusiness})
   }, 1);
    
  }

  render() {
    const myIcon = L.icon({
      iconUrl: pin,
      iconSize: [30, 80], // Esto estaba en 43, 100
      iconAnchor: [22, 79]
    });

    const myIconPremium = L.icon({
      iconUrl: pinPremium,
      iconSize: [50, 110],
      iconAnchor: [22, 79]
    });

    const lat = 40.4183083;
    const lon = -3.70275;
    const zoom = 5;

    const { selectedBusiness, events } = this.state;
    return (
      <Fragment>
        <div className="leaflet-container">
          <Map
            style={{ minHeight: "500px" }}
            OnMoveEnd={(e: any) => {
              this.props.getBusinessesByCoord(
                e.target.getBounds()._southWest.lat,
                e.target.getBounds()._northEast.lat,
                e.target.getBounds()._southWest.lng,
                e.target.getBounds()._northEast.lng
              );
              console.log("HOLA");
            }}
            center={
              this.props.latlon.length
                ? [this.props.latlon[0], this.props.latlon[1]]
                : [lat, lon]
            }
            zoom={this.props.zoom !== null ? (this.props.zoom as number) : zoom}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {this.props.businessOnMap.map(b => (
              <Marker
                onClick={() => this.getEvents(b.id)}
                position={[b.lat, b.lon]}
                icon={myIcon}
              >
                <Popup>
                  <div className="card businessCardMap">
                    <div
                      className="card-img-top businessImageMap"
                      style={{
                        backgroundImage: `url(http://localhost:3000/public/avatar/${b.mainImagePath})`
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{b.businessName}</h5>
                      <p className="card-text">{b.description}</p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                        onClick={() => this.getInfo(b.id)}
                      >
                        Más información
                      </button>
                      {this.state.events.length ? (
                        <button
                          type="button"
                          className="btn btn-warning ml-3"
                          data-toggle="modal"
                          data-target="#eventModal"
                          onClick={() => this.getInfo(b.id)}
                        >
                          Eventos
                        </button>
                      ) : null}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            {this.props.businessOnMapPremium.map(b => (
              <Marker
                onClick={() => {
                  this.getEvents(b.id);
                  this.getInfo(b.id);
                }}
                position={[b.lat, b.lon]}
                icon={myIconPremium}
              >
                <Popup>
                  <div className="card businessCardMap">
                    <div
                      className="card-img-top businessImageMap"
                      style={{
                        backgroundImage: `url(http://localhost:3000/public/avatar/${b.mainImagePath})`
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{b.businessName}</h5>
                      <p className="card-text">{b.description}</p>
                      <Rating
                        readonly
                        className="ratingStars mr-2"
                        emptySymbol="fa fa-star-o fa-2x"
                        fullSymbol="fa fa-star fa-2x"
                        fractions={2}
                      />
                      {!this.state.isBusiness && <label
                        className="valorationMessage"
                        data-toggle="modal"
                        data-target="#ratingModal"
                        onClick={() => this.getDogs()}
                      >
                        ¡Deja tu valoración!
                      </label>}
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                        onClick={() => this.getInfo(b.id)}
                      >
                        Más información
                      </button>
                      {this.state.events.length ? (
                        <button
                          type="button"
                          className="btn btn-warning ml-3"
                          data-toggle="modal"
                          data-target="#eventModal"
                          onClick={() => this.getInfo(b.id)}
                        >
                          Eventos
                        </button>
                      ) : null}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </Map>
        </div>

        {/* Modal Information Business */}
        <div
          className="modal fade"
          id="exampleModalCenter"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modalContainer"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  {selectedBusiness.businessName}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div
                    className="col-6 modalImg"
                    style={{
                      backgroundImage: `url(http://localhost:3000/public/avatar/${selectedBusiness.mainImagePath})`
                    }}
                  ></div>
                  <div className="col-6">
                    <p>{selectedBusiness.description}</p>
                    <p>
                      {selectedBusiness.address}, {selectedBusiness.postcode}{" "}
                      {selectedBusiness.city}
                    </p>
                    <p>{selectedBusiness.telephone}</p>
                    <p>{selectedBusiness.email}</p>
                    <a href={selectedBusiness.instagram} target="_blank">
                      <img height={40} src={instagramLogo} alt="" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Modal Information Business */}

        {/* Modal Events */}
        <div
          className="modal fade"
          id="eventModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="eventModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modalContainer"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Eventos de {selectedBusiness.businessName}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {events.map((event, index) => (
                  <div className="row">
                    <div className="col">
                      {index !== 0 ? <hr /> : null}
                      <h5>{event.event_name} </h5>
                      <p>{event.event_description}</p>
                      <span>
                        Fecha de inicio:{" "}
                        {new Date(event.startDate).toLocaleDateString()}{" "}
                      </span>
                      <span>
                        {" "}
                        Fecha de finalización:{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Modal Events */}

        {/* Modal Rating Business */}
        <div
          className="modal fade"
          id="ratingModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modalContainer"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Puntua a {selectedBusiness.businessName}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <select name="" id="" className="form-control mb-3">
                      <option value="null">Selecciona quien ha ido</option>
                      {this.state.dogs.map(dog => (
                        <option value={dog.id}>{dog.name}</option>
                      ))}
                    </select>
                    <Rating
                      initialRating={this.state.rate}
                      className="ratingStars mb-3"
                      emptySymbol="fa fa-star-o fa-2x"
                      fullSymbol="fa fa-star fa-2x"
                      fractions={2}
                      onChange={rate => this.setState({ rate: rate })}
                    />
                    <textarea
                      name=""
                      className="form-control"
                      id=""
                      cols={30}
                      rows={10}
                      value={this.state.review}
                      onChange={e => this.setState({ review: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button  className="btn btn-primary">Enviar</button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Modal Rating Business */}
      </Fragment>
    );
  }
}
const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

export default connect(mapStateToProps)(HomeMap);
