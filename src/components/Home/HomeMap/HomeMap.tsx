import React, { Fragment } from "react";
import pin from "../../../icons/GREEN_PIN.svg";
import { Map, SVGOverlay, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./style.css";
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

class HomeMap extends React.PureComponent<IProps> {
  render() {
    console.log(this.props.businessOnMap);
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
            zoom={this.props.zoom !== null ? this.props.zoom as number : zoom}
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
                      <a href="#" className="btn btn-primary">
                        Go somewhere
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </Map>
        </div>
      </Fragment>
    );
  }
}

export default HomeMap;
