import React from "react";
import history from "../../../../../utils/history";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";

const GET_EVENT_INFO = "http://localhost:3000/event/getEventInfo/";
const API_UPDATE_EVENT = "http://localhost:3000/event/updateEvent/";
const API_DELETE_EVENT = "http://localhost:3000/event/deleteEvent/";

interface IProps {}

interface IState {
  event_id: number;
  event_name: string;
  event_description: string;
  startDate: Date;
  endDate: Date;
  business_id: number;
}

class EditEvents extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      event_id: 0,
      event_name: "",
      event_description: "",
      startDate: new Date(),
      endDate: new Date(),
      business_id: 0
    };
  }

  getEventInfo = async () => {
    const eventId = history.location.pathname.split("/").slice(-1)[0];
    fetch(`${GET_EVENT_INFO}${eventId}`).then(async response => {
      let json = await response.json();
      json.startDate = new Date(json.startDate);
      json.endDate = new Date(json.endDate);
      this.setState((this.state = json));
    });
  };
  updateEvent = async () => {
    let {
      event_id,
      event_name,
      event_description,
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
    await fetch(API_UPDATE_EVENT, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        event_id,
        event_name,
        event_description,
        startDate,
        endDate
      })
    }).then(() => {
      history.push("/profile/manageEvents");
    });
  };

  deleteEvent = () => {
    let { event_id } = this.state;

    fetch(API_DELETE_EVENT, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        event_id
      })
    }).then(response => {
      if (response.status === 200) {
        Swal.fire({
          title: "Evento eliminado correctamente",
          icon: "success"
        });
        history.push("/profile/manageEvents/");
      } else {
        Swal.fire({
          title: "Ha ocurrido un problema",
          text: "Inténtelo de nuevo más tarde",
          icon: "warning"
        });
      }
    });
  };

  componentDidMount = () => {
    this.getEventInfo();
  };
  render() {
    const today = new Date();
    return (
      <div className="container">
        <div className="row mt-3">
          <h3>Nombre del evento:</h3>
          <input
            placeholder="Nombre del evento"
            type="text"
            className="form-control"
            value={this.state.event_name}
            onChange={e => this.setState({ event_name: e.target.value })}
          />
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
            value={this.state.event_description}
            onChange={e => this.setState({ event_description: e.target.value })}
            className="form-control"
            cols={100}
            rows={10}
          ></textarea>
        </div>
        <button
          className="btn btn-success mt-3"
          onClick={() => {
            this.updateEvent();
          }}
        >
          Actualizar evento
        </button>

        <button
          className="btn btn-danger mt-3 ml-2"
          onClick={() => history.push("/profile/manageEvents")}
        >
          Cancelar
        </button>

        <button
          className="btn btn-warning mt-3 ml-2"
          onClick={() => {
            Swal.fire({
              title: "¿Quieres eliminar el evento?",
              text: "La información se perderá",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              cancelButtonText: "Cancelar",
              confirmButtonText: "Confirmar"
            }).then(result => {
              if (result.value) {
                this.deleteEvent();
              }
            });
          }}
        >
          Eliminar evento
        </button>
      </div>
    );
  }
}

export default EditEvents;
