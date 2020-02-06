import React, { Component, Fragment } from "react";
import "./style.css";
import pin from "../../../../../../icons/GREEN_PIN.svg";

import { Map, SVGOverlay, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface IState {
  
}

interface IProps {
  changelatlng(lat: number, lon: number): void;
  zoom: number;
  latlon: any;
}

export default class SimpleExample extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      
    };
  }
  
  render() {
    const myIcon = L.icon({
      iconUrl: pin,
      iconSize: [43, 100],
      iconAnchor: [22, 79]
    });

  

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
            zoom={this.props.zoom}
            center={ this.props.latlon }
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={this.props.latlon} icon={myIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </Map>
        </div>
      </Fragment>
    );
  }
}
