import React from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core";

import { styles } from "./MapResults.css";
import "./marker.css";
import defaultProfilePicture from "../../../resources/images/placeholder_person.png";
import withMapbox from "../../../hoc/MapboxManagement.hoc";
React.lazy(() => import("../../../resources/stylesheets/font-awesome.min.css"));

class MapResults extends React.Component {
  state = {};

  componentDidMount() {
    this.props.mapbox.buildMap(this.mapContainer)
    .then((map) => {
      this.map = map;
      this.props.mapbox.setLocale(this.map, this.props.commonStore.locale);
      this.props.mapbox.loadClusteredData(this.map, "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson");
    });
  }


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
          style={{ height: "100vh", position: "absolute", top: 0, width: "100%" }}
        ></div>
      </div>
    );
  }
}

export default inject("commonStore")(
  observer(withStyles(styles)(withMapbox(MapResults)))
);
