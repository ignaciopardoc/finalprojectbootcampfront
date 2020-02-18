import React, { Fragment } from "react";
import HomeMap from "./HomeMap/HomeMap";

import "./style.css";
import Swal from "sweetalert2";

import instagramLogo from "../../../icons/instagram.svg";
import PremiumBusinessCard from "./PremiumBusinessCard/PremiumBusinessCard";
import { businessDB } from "../../../interfaces/businessDB";

import { CSSTransition, TransitionGroup } from "react-transition-group";

const API_CATEGORIES = "http://localhost:3000/business/getCategories";
const URL_GET_ONEBUSINESS = "http://localhost:3000/business/getOneBusiness/";
const URL_GET_MAP = "http://localhost:3000/business/getBusinessMap";
const URL_GET_MAP_PREMIUM = "http://localhost:3000/business/getBusinessPremium";

interface IState {
  businessOnMap: businessDB[];
  businessOnMapPremium: businessDB[];
  latBottom: number | null;
  latTop: number | null;
  lonRight: number | null;
  lonLeft: number | null;
  searchInput: string;
  latlon: number[];
  zoom: number | null;
  categories: [];
  category: string;
  selectedBusiness: businessDB;
  seeMore: boolean;
}

class HomeWithMap extends React.Component<any, IState> {
  constructor(props: any) {
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
      },
      businessOnMap: [],
      businessOnMapPremium: [],
      latBottom: 0,
      latTop: 0,
      lonRight: 0,
      lonLeft: 0,
      searchInput: "",
      latlon: [],
      zoom: null,
      categories: [],
      category: "",
      seeMore: false
    };
  }

  searchByAdress = async () => {
    fetch(
      `https://nominatim.openstreetmap.org/search/${this.state.searchInput}?format=json&addressdetails=1&limit=1&polygon_svg=1`
    ).then(async response => {
      const json = await response.json();
      if (json !== undefined) {
        //Separate second length to avoid crash of the app
        if (json.length) {
          //Result is only used for the map
          this.setState({ latlon: [json[0].lat, json[0].lon], zoom: 15 });
        } else {
          Swal.fire({
            title: "No se ha encontrado ninguna dirección",
            text: "Inténtelo de nuevo",
            icon: "warning"
          });
        }
      }
    });
  };

  getCategories = async () => {
    const response = await fetch(API_CATEGORIES);
    const json = await response.json();
    this.setState({ categories: json });
  };

  getBusinessesByCoord = async (
    latBottom: number,
    latTop: number,
    lonLeft: number,
    lonRight: number
  ) => {
    this.setState({ latBottom, latTop, lonLeft, lonRight });
    const { category } = this.state;
    await fetch(URL_GET_MAP, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        latBottom,
        latTop,
        lonLeft,
        lonRight,
        category
      })
    }).then(async response => {
      const json = await response.json();
      this.setState({ ...this.state, businessOnMap: json });
    });

    await fetch(URL_GET_MAP_PREMIUM, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        latBottom,
        latTop,
        lonLeft,
        lonRight,
        category
      })
    }).then(async response => {
      const json = await response.json();
      this.setState({ ...this.state, businessOnMapPremium: json });
    });
  };

  getBusinessesByCoordAndCategory = async () => {
    const { latBottom, lonLeft, latTop, lonRight, category } = this.state;
    await fetch(URL_GET_MAP, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        latBottom,
        latTop,
        lonLeft,
        lonRight,
        category
      })
    }).then(async response1 => {
      const json1 = await response1.json();
      this.setState({ ...this.state, businessOnMap: json1 });
    });

    await fetch(URL_GET_MAP_PREMIUM, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        latBottom,
        latTop,
        lonLeft,
        lonRight,
        category
      })
    }).then(async response2 => {
      const json2 = await response2.json();
      this.setState({ ...this.state, businessOnMapPremium: json2 });
    });
  };

  getInfo = async (id: number) => {
    await fetch(`${URL_GET_ONEBUSINESS}${id}`).then(async response => {
      const json = await response.json();
      this.setState({ selectedBusiness: json });
    });
  };

  componentDidMount() {
    this.getCategories();
  }

  render() {
    const { selectedBusiness } = this.state;
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-9 col-12">
            <input
              type="text"
              className="form-control inputHome"
              onChange={e => this.setState({ searchInput: e.target.value })}
              value={this.state.searchInput}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  this.searchByAdress();
                }
              }}
              placeholder="Buscar por dirección"
            />
          </div>
          <div className="col-md-3 col-12">
            <select
              className="custom-select inputHome"
              onChange={e => {
                this.setState({ category: e.target.value });
                setTimeout(() => {
                  this.getBusinessesByCoordAndCategory();
                }, 20);
              }}
            >
              <option value="null">Filtrar por categoría</option>
              {this.state.categories.map((c, i) => (
                <option value={c} key={i}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <HomeMap
          businessOnMap={this.state.businessOnMap}
          businessOnMapPremium={this.state.businessOnMapPremium}
          getBusinessesByCoord={this.getBusinessesByCoord}
          latlon={this.state.latlon}
          zoom={this.state.zoom}
        />

        {this.state.businessOnMapPremium.length ? (
          <h1 className="mt-4 text-center">Empresas destacadas</h1>
        ) : null}
        <div className="row mt-3">
          {this.state.businessOnMapPremium.map((business, index) => (
            <div
              className="col-md-4 col-12 premiumBusinessCardContainer"
              key={business.id}
            >
              {!this.state.seeMore && index < 3 && (
                <TransitionGroup>
                  <CSSTransition
                    in={true}
                    classNames="cardHome"
                    key={business.id}
                    appear={true}
                    timeout={300}
                  >
                    <PremiumBusinessCard
                      business={business}
                      key={business.id}
                    />
                  </CSSTransition>
                </TransitionGroup>
              )}
              {this.state.seeMore && (
                <CSSTransition
                  in={true}
                  key={business.id}
                  classNames="cardHome"
                  appear={true}
                  timeout={300}
                >
                  <PremiumBusinessCard business={business} key={business.id} />
                </CSSTransition>
              )}
            </div>
          ))}
        </div>
        {!this.state.seeMore &&
        this.state.businessOnMapPremium.length > 3 &&
        this.state.businessOnMapPremium.length ? (
          <div className="row d-flex justify-content-center">
            <button
              className="customButton greenButton ml-3 mt-3 mb-3"
              onClick={() => this.setState({ seeMore: true })}
            >
              Ver más
            </button>
          </div>
        ) : null}
        {this.state.seeMore &&
        this.state.businessOnMapPremium.length > 3 &&
        this.state.businessOnMapPremium.length ? (
          <div className="row d-flex justify-content-center">
            {" "}
            <button
              className="customButton redButton ml-3 mb-3 mt-3"
              onClick={() => this.setState({ seeMore: false })}
            >
              Ver menos
            </button>
          </div>
        ) : null}

        {/* Modal Information Business */}
        <div
          className="modal fade"
          id="homeBusiness"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modalContainer"
            role="document"
          >
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
                    className="col-md-6 col-12 modalImg"
                    style={{
                      backgroundImage: `url(http://localhost:3000/public/avatar/${selectedBusiness.mainImagePath})`
                    }}
                  ></div>
                  <div className="col-md-6 col-12">
                    <p>{selectedBusiness.description}</p>
                    <p>
                      {selectedBusiness.address}, {selectedBusiness.postcode}{" "}
                      {selectedBusiness.city}
                    </p>
                    <p>{selectedBusiness.telephone}</p>
                    <p>{selectedBusiness.email}</p>
                    <a
                      href={selectedBusiness.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img height={40} src={instagramLogo} alt="" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="customButton redButton"
                  data-dismiss="modal"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* End Modal Information Business */}
      </Fragment>
    );
  }
}

export default HomeWithMap;
