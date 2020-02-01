import React, { Component, Fragment } from "react";
import "./style.css";

import { Map, SVGOverlay, TileLayer, Marker, Popup } from "react-leaflet";

interface IState {
  lat: number;
  lon: number;
  zoom: number;
  searchResult: any;
  searchInput: string;
}

export default class SimpleExample extends Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      searchResult: null,
      lat: 0,
      lon: 0,
      zoom: 0,
      searchInput: ""
    };
  }

  searchByAdress = async (address: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search/${address}?format=json&addressdetails=1&limit=1&polygon_svg=1`
    );

    let json = await response.json();
    console.log(json);
    const result = [json[0].lat, json[0].lon];
    this.setState({ searchResult: result });
    this.setState({ zoom: 17 });
  };

  render() {
    return (
      <Fragment>
        <Map
          style={{ minHeight: "500px" }}
          onClick={(e: any) => {}}
          center={
            this.state.searchResult !== null
              ? this.state.searchResult
              : [this.state.lat, this.state.lon]
          }
          zoom={this.state.zoom}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={
              this.state.searchResult !== null ? this.state.searchResult : [this.state.lat, this.state.lon]
            }
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </Map>
        <div className="form-group">
          <input
            onChange={e => this.setState({searchInput: e.target.value})}
            onKeyDown={e => {if(e.keyCode === 13) this.searchByAdress(this.state.searchInput)}}
            type="text"
            className="form-control"
            placeholder="Buscar dirección"
          />
        </div>
      </Fragment>
    );
  }
}
