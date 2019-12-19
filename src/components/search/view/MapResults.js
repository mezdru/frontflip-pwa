import React from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { withStyles } from "@material-ui/core";

import { styles } from "./MapResults.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class MapResults extends React.Component {
  state = {
    map: null
  };

  componentDidMount() {
    var map = new mapboxgl.Map({
      container: "results-map",
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 5,
      center: [2.349014, 48.864716],
      renderWorldCopies: false
    });

    this.setState({ map: map }, () => {
      this.addRecordMarker({}, 48.864716, 2.349014);

      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      });

      document.getElementById("input-geocoder").appendChild(geocoder.onAdd(this.state.map));
    });
  }

  addRecordMarker = (record, lat, lng) => {
    let marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(this.state.map);
  };


  // use it in onboard ?
  getGeocode = (query) => {
    // there are 2 endpoints : this one is free (up to 100k / month) : we can't store the data
    //https://api.mapbox.com/geocoding/v5/mapbox.places/{QUERY_HERE}.json?access_token={ACCESS_TOKEN_HERE}

    // this one isn't free : 5$ / 1K request : we can store the data
    //https://api.mapbox.com/geocoding/v5/mapbox.places-permanent/{QUERY_HERE}.json?access_token={ACCESS_TOKEN_HERE}
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.viewContainer}>
        <div id="input-geocoder" style={{width: '50%'}} ></div>
        <div id="results-map" style={{ height: "calc(100vh - 183px)" }}></div>
      </div>
    );
  }
}

export default withStyles(styles)(MapResults);
