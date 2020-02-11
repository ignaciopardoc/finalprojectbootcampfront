import React, { Fragment, ChangeEvent } from "react";
import { connect } from "react-redux";
import { IStore } from "../../../../interfaces/IStore";
import { IUser } from "../../../../interfaces/IToken";
import "./style.css"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
const API_GET_BUSINESS = "http://localhost:3000/business/getInfoUserBusiness";
const API_ADD_EVENT = "http://localhost:3000/event/addEvent"
interface IProps {}

interface IGlobalProps {
  token: IUser;
}

interface IState {
  addEvent: boolean;
  business: IBusinessDB[];
  selectedBusiness: string;
  startDate: Date;
  endDate: Date;
  eventName: string
  description: string
}

interface IBusinessDB {
  businessName: string;
  address: string;
  city: string;
  category: string;
  mainImagePath: string;
  id: number;
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
      description: ""
    };
  }

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
    let {selectedBusiness, eventName, description, startDate, endDate} = this.state

    startDate = startDate.toISOString().split('T')[0] as any
    endDate = endDate.toISOString().split('T')[0] as any

    await fetch(API_ADD_EVENT, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        selectedBusiness, eventName, description, startDate, endDate
      })
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.getBusinessInfo();
    }, 1);
  }
  render() {
    console.log(this.state)
    return (
      <Fragment>
        <div className="row">
          {!this.state.addEvent && (
            <h1 onClick={() => this.setState({ addEvent: true })}>
              + Añadir evento
            </h1>
          )}
          {this.state.addEvent && (
            <h1 onClick={() => this.setState({ addEvent: false })}> Cerrar</h1>
          )}
        </div>
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
              
              <input placeholder="Nombre del evento" type="text" className="form-control" onChange={(e) => this.setState({eventName: e.target.value}) }/>
            </div>
            </div>
            <div className="row d-flex justify-content-center">
              
              <h3>Fecha de comienzo:</h3>
              <div className="ml-3 mr-3">
                <DatePicker
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  selected={this.state.startDate}
                  onChange={date => this.setState({ startDate: new Date(date as Date)  })}
                  locale="es"
                />
              </div>
              <h3>Fecha de finalización:</h3>
              <div className="ml-3 mr-3">
                <DatePicker
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  selected={this.state.endDate}
                  onChange={date => this.setState({ endDate: new Date(date as Date) })}
                  locale="es"
                />
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <h3>Descripción:</h3>
              
            </div>
            <div className="row d-flex justify-content-center">
              <textarea onChange={e => this.setState({description: e.target.value})} className="form-control" name="" id="" cols={100} rows={10}></textarea>
              </div>
          <button onClick={() => {
            this.addEvent()
          }

          }></button>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ token }: IStore): IGlobalProps => ({
  token
});

export default connect(mapStateToProps)(ManageEvents);
