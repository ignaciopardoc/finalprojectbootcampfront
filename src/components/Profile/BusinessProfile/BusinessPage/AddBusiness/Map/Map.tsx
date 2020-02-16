import React, { Fragment } from "react";
import "./style.css";
import pin from "../../../../../../icons/GREEN_PIN.svg";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface IState {}

interface IProps {
  changelatlng(lat: number, lon: number): void;
  zoom: number | null;
  latlon: number[];
}

class SimpleExample extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {};
  }

  render() {
    const myIcon = L.icon({
      iconUrl: pin,
      iconSize: [43, 100],
      iconAnchor: [22, 79]
    });

    const lat = 40.4183083;
    const lon = -3.70275;
    const zoom = 5;

    return (
      <Fragment>
        <label>
          Por favor, comprueba que la ubicación en el mapa es la correcta
        </label>
        <div className="leaflet-container">
          <Map
            style={{ minHeight: "500px" }}
            onClick={(e: any) => {
              console.log(e);
              this.props.changelatlng(e.latlng.lat, e.latlng.lng);
            }}
            center={
              this.props.latlon.length
                ? [this.props.latlon[0], this.props.latlon[1]]
                : [lat, lon]
            }
            zoom={this.props.zoom !== null ? (this.props.zoom as number) : zoom}
          >
            {" "}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {this.props.latlon.map(() => (
              <Marker
                position={[this.props.latlon[0], this.props.latlon[1]]}
                icon={myIcon}
              >
                <Popup>Aquí va la información de tu empresa</Popup>
              </Marker>
            ))}
          </Map>
        </div>
      </Fragment>
    );
  }
}

export default SimpleExample;
