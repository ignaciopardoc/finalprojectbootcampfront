import React, { Fragment } from "react";
import { eventInfoDB } from "../../../interfaces/eventInfoDB";

const GET_CITY_EVENTS = "http://localhost:3000/event/getFutureEventsList";

interface IProps {}

interface IState {
  citiesWithEvents: [];
  city: string;
  events: eventInfoDB[];
}

class HomeEventList extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      citiesWithEvents: [],
      city: "null",
      events: []
    };
  }

  getCitiesWithEvents = async () => {
    await fetch("http://localhost:3000/event/getCitiesWithEvents/", {
      method: "GET"
    }).then(async response => {
      const json = await response.json();
      console.log(json);
      this.setState({ citiesWithEvents: json });
    });
  };

  getEvents = async (city: string) => {
    await fetch(GET_CITY_EVENTS, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        city
      })
    }).then(async response => {
      const json = await response.json();

      this.setState({ events: json });
    });
  };

  componentDidMount() {
    this.getCitiesWithEvents();
  }
  render() {
    return (
      <Fragment>
        <div className="row mt-4">
          <div className="col-4">
            <h2>Seleccione su ciudad:</h2>
          </div>
          <div className="col-8">
            <select
              className="custom-select"
              onChange={e => {
                if (e.target.value !== "null") {
                  this.getEvents(e.target.value);
                }
              }}
              name=""
              id=""
            >
              <option value="null">Seleccione una ciudad</option>
              {this.state.citiesWithEvents.map((city, index) => (
                <option value={city} key={index}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
        {this.state.events.length ? (
          <div className="row mt-4">
            <div className="col-2 ml-1">
              <strong>Empresa</strong>{" "}
            </div>
            <div className="col-2 ml-1">
              <strong>Nombre del evento</strong>{" "}
            </div>
            <div className="col-3">
              <strong>Descripción</strong>{" "}
            </div>
            <div className="col-2 ml-1">
              <strong>Dirección</strong>{" "}
            </div>
            <div className="col-1">
              <strong>Comienzo</strong>
            </div>
            <div className="col-1">
              <strong>Fin</strong>
            </div>
          </div>
        ) : null}

        {this.state.events.map((event, index) => (
          <>
            <hr />
            <div className="row">
              <div className="col-2 ml-1">{event.businessName}</div>
              <div className="col-2 ml-1">{event.event_name}</div>
              <div className="col-3">{event.event_description}</div>
              <div className="col-2 ml-1">{event.address}</div>
              <div className="col-1">
                {new Date(event.startDate).toLocaleDateString()}
              </div>
              <div className="col-1">
                {new Date(event.endDate).toLocaleDateString()}
              </div>
            </div>
          </>
        ))}
      </Fragment>
    );
  }
}

export default HomeEventList;
