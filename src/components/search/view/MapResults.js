import React from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { styles } from "./MapResults.css";
import "./marker.css";
import withMapbox from "../../../hoc/MapboxManagement.hoc";
import { getBaseUrl } from "../../../services/utils.service";
React.lazy(() => import("../../../resources/stylesheets/font-awesome.min.css"));

class MapResults extends React.Component {
  state = {};

  async componentDidMount() {
    await this.props.fetchHits(this.props.searchStore.values.filters, 0, true);

    this.props.mapbox.buildMap(this.mapContainer).then(map => {
      this.map = map;
      this.props.mapbox.setLocale(this.map, this.props.commonStore.locale);
      if (this.map)
        this.props.mapbox.loadClusteredData(
          this.map,
          this.props.mapbox.convertAlgoliaToGeojson(this.props.hits),
          this.onMarkerClick
        );
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.map)
      this.props.mapbox.loadClusteredData(
        this.map,
        this.props.mapbox.convertAlgoliaToGeojson(nextProps.hits),
        this.onMarkerClick
      );
  }

  onMarkerClick = markerProps => {
    if (markerProps && markerProps.tag) {
      this.props.history.push({
        pathname: getBaseUrl(this.props) + "/" + markerProps.tag,
        search: window.location.search
      });
    } else {
      this.props.switchView();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.viewContainer}>
        <div id="input-geocoder" style={{ width: "50%" }}></div>
        <div
          ref={el => (this.mapContainer = el)}
          style={{
            height: "100vh",
            position: "absolute",
            top: 0,
            width: "100%"
          }}
        ></div>
      </div>
    );
  }
}

export default inject(
  "commonStore",
  "searchStore",
  "orgStore"
)(observer(withStyles(styles)(withMapbox(withRouter(MapResults)))));
