import React, { Fragment } from "react";
import pin from "../../../../icons/normalpin.svg";
import pinPremium from "../../../../icons/premiumpin.svg";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Rating from "react-rating";
import "./style.css";
import instagramLogo from "../../../../icons/instagram.svg";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import jwt from "jsonwebtoken";
import { ILogged } from "../../../../interfaces/ILogged";
import ReviewBody from "./reviewBody/Reviewbody";
import { businessDB } from "../../../../interfaces/businessDB";
import { EventDB } from "../../../../interfaces/EventDB";
import { DogsDB } from "../../../../interfaces/dogsDB";
import { reviewDB } from "../../../../interfaces/reviewDB";
const URL_GET_ONEBUSINESS = "http://localhost:3000/business/getOneBusiness/";
const URL_GET_EVENTS = "http://localhost:3000/event/getEventFromBusiness/";
const URL_GET_DOGS = "http://localhost:3000/dog/getDogsFromUser/";
const URL_SEND_REVIEW = "http://localhost:3000/review/setReview";
const URL_GET_AVERAGE = "http://localhost:3000/review/getReviewNumber/";
const URL_GET_REVIEWS = "http://localhost:3000/review/getReviews/";

interface IState {
  selectedBusiness: businessDB;
  events: EventDB[];
  review: string;
  stars: number;
  dogs: DogsDB[];
  isBusiness: boolean;
  dog_id: string;
  averageStars: number;
  numberOfReviews: number;
  reviews: reviewDB[];
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
  logged: ILogged;
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
      stars: 0,
      dogs: [],
      isBusiness: false,
      dog_id: "null",
      averageStars: 0,
      numberOfReviews: 0,
      reviews: []
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
    }).then(async response => {
      const json = await response.json();
      this.setState({ dogs: json as any });
    });
  };

  getInfo = async (id: number) => {
    await fetch(`${URL_GET_ONEBUSINESS}${id}`).then(async response => {
      const json = await response.json();
      this.setState({ selectedBusiness: json });
    });
    await fetch(URL_GET_AVERAGE, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        id
      })
    }).then(async response => {
      const json = await response.json();
      this.setState({
        averageStars: json.averageRate,
        numberOfReviews: json.reviewNumber
      });
    });
  };

  sendReview = async () => {
    const { stars, review, dog_id } = this.state;
    const { id: business_id } = this.state.selectedBusiness;

    fetch(URL_SEND_REVIEW, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        stars,
        review,
        dog_id,
        business_id
      })
    });
  };

  getReviews = async (id: number) => {
    await fetch(`${URL_GET_REVIEWS}${id}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json"
      })
    }).then(async response => {
      const json = await response.json();
      this.setState({ ...this.state, reviews: json as any });
    });
  };

  getEvents = async (id: number) => {
    await fetch(`${URL_GET_EVENTS}${id}`).then(async response => {
      const json = await response.json();
      this.setState({ events: json });
    });
  };

  componentDidMount() {
    setTimeout(() => {
      if (this.props.token.token) {
        const { isBusiness } = jwt.decode(this.props.token.token) as any;
        this.setState({ isBusiness: isBusiness });
      }
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
                key={b.id}
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
                        className="customButton blueButton leftBottomButton"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                        onClick={() => this.getInfo(b.id)}
                      >
                        Más información
                      </button>
                      {this.state.events.length ? (
                        <button
                          type="button"
                          className="customButton yellowButton rightBottomButton ml-3"
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
                key={b.id}
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
                        initialRating={this.state.averageStars}
                      />
                      {!this.state.isBusiness && this.props.logged.logged && (
                        <label
                          className="valorationMessage"
                          data-toggle="modal"
                          data-target="#ratingModal"
                          onClick={() => this.getDogs()}
                        >
                          {this.state.numberOfReviews !== 0
                            ? "¡Deja tu valoración!"
                            : "¡Sé el primero!"}
                        </label>
                      )}
                      <label>
                        Número de valoraciones: {this.state.numberOfReviews}{" "}
                        {this.state.numberOfReviews !== 0 ? (
                          <i
                            data-toggle="modal"
                            data-target="#businessReviewsModal"
                            onClick={() => this.getReviews(b.id)}
                            className="far fa-eye"
                          ></i>
                        ) : null}
                      </label>
                      <button
                        type="button"
                        className="customButton blueButton leftBottomButton"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                        onClick={() => this.getInfo(b.id)}
                      >
                        Más información
                      </button>
                      {this.state.events.length ? (
                        <button
                          type="button"
                          className="customButton yellowButton rightBottomButton ml-3"
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
                    className="col-md-6 col-12 modalImg"
                    style={{
                      backgroundImage: `url(http://localhost:3000/public/avatar/${selectedBusiness.mainImagePath})`
                    }}
                  ></div>
                  <div className="col-md-6 col-12">
                    <p>{selectedBusiness.description}</p>
                    <p>
                      {selectedBusiness.address}, {selectedBusiness.postcode}{" "}
                      {selectedBusiness.city}
                    </p>
                    <p>{selectedBusiness.telephone}</p>
                    <p>{selectedBusiness.email}</p>
                    <a
                      href={selectedBusiness.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img height={40} src={instagramLogo} alt="" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="customButton redButton"
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
                  <div className="row" key={event.event_id}>
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
                  className="customButton redButton"
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
                  Puntúa a {selectedBusiness.businessName}
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
                    <select
                      onChange={e =>
                        this.setState({ dog_id: e.target.value as any })
                      }
                      className="form-control mb-3"
                      value={this.state.dog_id}
                    >
                      <option value="null">Selecciona quien ha ido</option>
                      {this.state.dogs.map(dog => (
                        <option value={dog.id} key={dog.id}>
                          {dog.name}
                        </option>
                      ))}
                    </select>
                    <Rating
                      initialRating={this.state.stars}
                      className="ratingStars mb-3"
                      emptySymbol="fa fa-star-o fa-2x"
                      fullSymbol="fa fa-star fa-2x"
                      fractions={2}
                      onChange={rate => this.setState({ stars: rate })}
                    />
                    <textarea
                      className="form-control"
                      cols={30}
                      rows={10}
                      value={this.state.review}
                      onChange={e => this.setState({ review: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    this.sendReview();
                    this.setState({ stars: 0, review: "", dog_id: "null" });
                  }}
                  className="customButton blueButton"
                  data-dismiss="modal"
                  disabled={
                    this.state.stars === 0 || this.state.dog_id === "null"
                  }
                >
                  Enviar
                </button>
                <button
                  type="button"
                  className="customButton redButton"
                  data-dismiss="modal"
                  onClick={() =>
                    this.setState({ stars: 0, review: "", dog_id: "null" })
                  }
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Modal Rating Business */}

        {/* See rate from business modal */}
        <div
          className="modal fade"
          id="businessReviewsModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="eventModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Valoraciones de {selectedBusiness.businessName}
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
                {this.state.reviews.map(review => (
                  <ReviewBody review={review} key={review.valoration_id} />
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="customButton blueButton"
                  data-dismiss="modal"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End See Rate From Business Modal */}
      </Fragment>
    );
  }
}
const mapStateToProps = ({ token, logged }: IStore): IGlobalProps => ({
  token,
  logged
});

export default connect(mapStateToProps)(HomeMap);
