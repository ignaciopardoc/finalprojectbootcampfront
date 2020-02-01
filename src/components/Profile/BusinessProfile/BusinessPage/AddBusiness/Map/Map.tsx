import React, { Component, Fragment } from "react";
import "./style.css"
import pin from "../../../../../../icons/GREEN_PIN.svg"

import { Map, SVGOverlay, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface IState {
  searchInput: string;
}

interface IProps {
  searchByAdress(address: string): void;
  zoom: number;
  latlon: any;
}

export default class SimpleExample extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      searchInput: ""
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
        <Map
          style={{ minHeight: "500px" }}
          onClick={(e: any) => {}}
          center={this.props.latlon}
          zoom={this.props.zoom}        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={this.props.latlon}
          icon={myIcon}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </Map>
        <div className="form-group">
          <input
            onChange={e => this.setState({ searchInput: e.target.value })}
            onKeyDown={e => {
              if (e.keyCode === 13)
                this.props.searchByAdress(this.state.searchInput);
            }}
            type="text"
            className="form-control"
            placeholder="Buscar dirección"
          />
        </div>
      </Fragment>
    );
  }
}
