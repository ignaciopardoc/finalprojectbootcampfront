import React, { Fragment } from "react" 

const URL_GET_ONEBUSINESS = "http://localhost:3000/business/getOneBusiness/";
const URL_GET_EVENTS = "http://localhost:3000/event/getEventFromBusiness/";

interface EventDB {
    event_id: string;
    event_name: string;
    event_description: string;
    startDate: string;
    endDate: string;
    business_id: string;
  }

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
    events: EventDB[]
}

interface IProps {
    business: businessDB
}


class PremiumBusinessCard extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props)

        this.state = {
            events: []
        }
    }
    getEvents = async (id: number) => {
        await fetch(`${URL_GET_EVENTS}${id}`).then(async response => {
          const json = await response.json();
          this.setState({ events: json });
          
        });
      };

      componentWillMount(){
          this.getEvents(this.props.business.id)
      }
    render(){

        const {business} = this.props

        const {events} = this.state
        return(
        <Fragment>
        <div className="card businessCardMap">
        <div
          className="card-img-top businessImageMap"
          style={{
            backgroundImage: `url(http://localhost:3000/public/avatar/${business.mainImagePath})`
          }}
        />
        <div className="card-body">
          <h5 className="card-title">{business.businessName}</h5>
          <p className="card-text">{business.description}</p>
          <button
            type="button"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#homeBusiness"
            
          >
            Más información
          </button>
          {this.state.events.length ? (
            <button
              type="button"
              className="btn btn-warning ml-3"
              data-toggle="modal"
              data-target="#eventModalCard"
              
            >
              Eventos
            </button>
          ) : null}
        </div>
      </div>

      {/* Modal Events */}
      <div
      className="modal fade"
      id="eventModalCard"
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
              Eventos de {business.businessName}
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
    {/* End Modal Events */}</Fragment>)
    }
}

export default PremiumBusinessCard