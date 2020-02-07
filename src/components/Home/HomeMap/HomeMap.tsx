import React, { Fragment } from "react";
import pin from "../../../icons/GREEN_PIN.svg";
import { Map, SVGOverlay, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./style.css";
import instagramLogo from "../../../icons/instagram.svg";
const URL_GET_ONEBUSINESS = "http://localhost:3000/business/getOneBusiness/";

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
  selectedBusiness: businessDB;
}

interface IProps {
  getBusinessesByCoord(
    latBottom: number,
    latTop: number,
    lonLeft: number,
    lonRight: number
  ): void;

  businessOnMap: businessDB[];
  latlon: number[];
  zoom: number | null;
}

class HomeMap extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
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
      }
    };
  }

  getInfo = async (id: number) => {
    fetch(`${URL_GET_ONEBUSINESS}${id}`).then(async response => {
      const json = await response.json();
      this.setState({ selectedBusiness: json });
      console.log(this.state.selectedBusiness);
    });
  };

  render() {
    const myIcon = L.icon({
      iconUrl: pin,
      iconSize: [43, 100],
      iconAnchor: [22, 79]
    });

    const lat = 40.4183083;
    const lon = -3.70275;
    const zoom = 5;

    const { selectedBusiness } = this.state;
    return (
      <Fragment>
        <div className="leaflet-container">
          <Map
            style={{ minHeight: "500px" }}
            OnMoveEnd={
              (e: any) => {
                this.props.getBusinessesByCoord(
                  e.target.getBounds()._southWest.lat,
                  e.target.getBounds()._northEast.lat,
                  e.target.getBounds()._southWest.lng,
                  e.target.getBounds()._northEast.lng
                );
                console.log("HOLA");
              }

              // const latBottom = e.target.getBounds()._southWest.lat;
              // const latTop = e.target.getBounds()._northEast.lat;
              // const lonLeft = e.target.getBounds()._southWest.lng;
              // const lonRight = e.target.getBounds()._northEast.lng;
              // console.log(latBottom, latTop, lonLeft, lonRight);
            }
            // onLoad={this.props.getBusinessesByCoord(
            //   31.50362930577303,
            //   48.22467264956519,
            //   -45.87890625,
            //   38.49609375000001
            // )}
            center={
              this.props.latlon.length
                ? [this.props.latlon[0], this.props.latlon[1]]
                : [lat, lon]
            }
            zoom={this.props.zoom !== null ? (this.props.zoom as number) : zoom}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {this.props.businessOnMap.map(b => (
              <Marker position={[b.lat, b.lon]} icon={myIcon}>
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
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </Map>
        </div>

        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModalCenter"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modalContainer" role="document">
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
                      <img height={40} src={instagramLogo} alt=""/>
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
        {/* End Modal */}
      </Fragment>
    );
  }
}

export default HomeMap;
