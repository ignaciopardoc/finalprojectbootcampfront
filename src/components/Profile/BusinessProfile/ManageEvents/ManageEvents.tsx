import React, { Fragment } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import "./style.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { Link } from "react-router-dom";
import { businessDB } from "../../../../interfaces/businessDB";
registerLocale("es", es);
const API_GET_BUSINESS = "http://localhost:3000/business/getInfoUserBusiness";
const API_ADD_EVENT = "http://localhost:3000/event/addEvent";
const API_GET_EVENT = "http://localhost:3000/event/getEvent/";
interface IProps {}

interface IUserEvent {
  event_id: string;
  event_name: string;
  event_description: string;
  startDate: string;
  endDate: string;
  business_id: string;
  id: string;
  businessName: string;
  description: string;
  category: string;
  address: string;
  city: string;
  postcode: string;
  lat: string;
  lon: string;
  telephone: string;
  email: string;
  instagram: string;
  mainImagePath: string;
  user_id: string;
}

interface IGlobalProps {
  token: IUser;
}

interface IState {
  addEvent: boolean;
  business: businessDB[];
  selectedBusiness: string;
  startDate: Date;
  endDate: Date;
  eventName: string;
  description: string;
  events: IUserEvent[];
}



type TProps = IGlobalProps & IProps;

class ManageEvents extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      addEvent: false,
      business: [],
      selectedBusiness: "",
      startDate: new Date(),
      endDate: new Date(),
      eventName: "",
      description: "",
      events: []
    };
  }

  getEvents = async () => {
    const token = this.props.token.token;

    const response = await fetch(API_GET_EVENT, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      })
    });

    const json = await response.json();

    this.setState({ events: json });
    console.log(this.state.events);
  };

  getBusinessInfo = async () => {
    const token = this.props.token.token;

    const response = await fetch(API_GET_BUSINESS, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      })
    });
    const json = await response.json();
    this.setState({ ...this.state, business: json });
  };

  addEvent = async () => {
    let {
      selectedBusiness,
      eventName,
      description,
      startDate,
      endDate
    } = this.state;

    startDate = startDate
      .toLocaleDateString()
      .split("/")
      .reverse()
      .join("-") as any;
    endDate = endDate
      .toLocaleDateString()
      .split("/")
      .reverse()
      .join("-") as any;

    await fetch(API_ADD_EVENT, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        selectedBusiness,
        eventName,
        description,
        startDate,
        endDate
      })
    }).then(() => {
      this.getEvents();
      this.setState({ addEvent: false });
    });
  };

  componentDidMount() {
    setTimeout(() => {
      this.getBusinessInfo();
      this.getEvents();
    }, 1);
  }

  render() {
    console.log(this.state);
    const today = new Date()
    return (
      <Fragment>
        <div className="row">
          {!this.state.addEvent && (
            <h1
              className="addEventButton"
              onClick={() => this.setState({ addEvent: true })}
            >
              + Añadir evento
            </h1>
          )}
          {this.state.addEvent && (
            <h1
              className="addEventButton"
              onClick={() => this.setState({ addEvent: false })}
            >
              {" "}
              Cerrar
            </h1>
          )}
        </div>
        {this.state.addEvent && (
          <div className="container">
            <div className="row mt-3">
              <div className="col-4">
                <select
                  name=""
                  id=""
                  className="form-control mb-3"
                  onChange={e =>
                    this.setState({ selectedBusiness: e.target.value })
                  }
                >
                  <option value="null">Seleccione empresa</option>
                  {this.state.business.map(b => (
                    <option value={b.id} key={b.id}>
                      {b.businessName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-8">
                <input
                  placeholder="Nombre del evento"
                  type="text"
                  className="form-control"
                  onChange={e => this.setState({ eventName: e.target.value })}
                />
              </div>
            </div>
            <div className="row d-flex justify-content-center mt-3">
              <h3>Fecha de comienzo:</h3>
              <div className="ml-3 mr-3">
                <DatePicker
                minDate={today}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  selected={this.state.startDate}
                  onChange={date => {
                    this.setState({ startDate: new Date(date as Date) });
                    if (new Date(date as Date) > new Date(this.state.endDate)) {
                      this.setState({ endDate: date as Date });
                    }
                  }}
                  locale="es"
                />
              </div>
              <h3>Fecha de finalización:</h3>
              <div className="ml-3 mr-3">
                <DatePicker
                minDate={today}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  selected={this.state.endDate}
                  onChange={date => {
                    this.setState({ endDate: new Date(date as Date) });
                    if (new Date(date as Date) < new Date(this.state.endDate)) {
                      this.setState({ startDate: date as Date });
                    }
                  }}
                  locale="es"
                />
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <h3 className="mt-3">Descripción:</h3>
            </div>
            <div className="row d-flex justify-content-center">
              <textarea
                onChange={e => this.setState({ description: e.target.value })}
                className="form-control"
                name=""
                id=""
                cols={100}
                rows={10}
              ></textarea>
            </div>
            <button
              className="btn btn-success mt-3"
              onClick={() => {
                this.addEvent();
              }}
            >
              Crear evento
            </button>
          </div>
        )}

        {!this.state.addEvent && (
          <div className="row">
            {this.state.events.map(event => (
              <div className="col-2 mr-5 ">
                <div className="card businessCard">
                  <div
                    className="card-img-top divimagetop"
                    style={{
                      backgroundImage: `url(http://localhost:3000/public/avatar/${event.mainImagePath})`
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{event.event_name}</h5>
                    <p className="card-text">{event.businessName}</p>
                    <p className="card-text">
                      {new Date(event.startDate).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      {new Date(event.endDate).toLocaleDateString()}
                    </p>

                    <Link to={`/profile/editEvent/${event.event_id}`}>
                      <a className="btn float-right editButton">Editar</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-2 justify-content-center">
              <div
                onClick={() =>
                  this.setState(({ addEvent }) => ({
                    addEvent: !addEvent
                  }))
                }
                className="card card-body h-50 justify-content-center businessCard addBusinessCard"
              >
                <h1>+</h1>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

export default connect(mapStateToProps)(ManageEvents);
