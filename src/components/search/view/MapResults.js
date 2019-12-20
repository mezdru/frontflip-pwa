import React from "react";
import { inject, observer } from "mobx-react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { withStyles } from "@material-ui/core";

import { styles } from "./MapResults.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class MapResults extends React.Component {
  state = {};

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v10", // v11 causes issue with locale
      zoom: 5,
      center: [2.349014, 48.864716]
      // renderWorldCopies: false
    });

    // this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on("load", this.setAddons);

    this.addRecordMarker({}, 48.864716, 2.349014);

  }

  setAddons = () => {
    // set locale
    var mapboxLanguage = new MapboxLanguage();
    this.map.setStyle(
      mapboxLanguage.setLanguage(
        this.map.getStyle(),
        this.props.commonStore.locale
      )
    );

    // add geocoder
    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    });

    document
      .getElementById("input-geocoder")
      .appendChild(geocoder.onAdd(this.map));
  };

  addRecordMarker = (record, lat, lng) => {
    let marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
  };

  // use it in onboard ?
  getGeocode = query => {
    // there are 2 endpoints : this one is free (up to 100k / month) : we can't store the data
    //https://api.mapbox.com/geocoding/v5/mapbox.places/{QUERY_HERE}.json?access_token={ACCESS_TOKEN_HERE}
    // this one isn't free : 5$ / 1K request : we can store the data
    //https://api.mapbox.com/geocoding/v5/mapbox.places-permanent/{QUERY_HERE}.json?access_token={ACCESS_TOKEN_HERE}
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.viewContainer}>
        <div id="input-geocoder" style={{ width: "50%" }}></div>
        <div
          ref={el => (this.mapContainer = el)}
          style={{ height: "calc(100vh - 183px)" }}
        ></div>
      </div>
    );
  }
}

export default inject("commonStore")(observer(withStyles(styles)(MapResults)));
