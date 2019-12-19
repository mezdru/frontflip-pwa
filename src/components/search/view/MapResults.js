import React from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
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
      style: "mapbox://styles/mapbox/streets-v11"
    });

    this.setState({ map: map });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.viewContainer}>
        <div id="results-map" style={{height: 'calc(100vh - 183px'}}></div>;
      </div>
    );
  }
}

export default withStyles(styles)(MapResults);
