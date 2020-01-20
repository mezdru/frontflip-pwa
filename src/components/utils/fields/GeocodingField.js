import React from "react";
import withMapbox from "../../../hoc/MapboxManagement.hoc";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core";
import request from "async-request";

const styles = theme => ({
  root: {
    position: "relative",
    height: "400px"
  },
  mapContainer: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    borderRadius: 4
  },
  geocoder: {
    position: "absolute",
    zIndex: 1,
    width: "calc(100% - 32px)",
    left: 0,
    right: 0,
    margin: "auto",
    top: 16,
    "& > div": {
      width: "100%",
      maxWidth: "inherit"
    }
  }
});

class GeocodingField extends React.Component {
  state = {
    lat: null,
    lng: null
  };

  createCenteredMarker = () => {
    let cMarker = this.props.mapbox.createMarker(this.map.getCenter());
    cMarker.addTo(this.map);

    this.map.on("move", () => {
      let newCoords = this.map.getCenter();
      // console.log('set position', newCoords);

      cMarker.setLngLat(newCoords);
      this.setState({ lng: newCoords.lng, lat: newCoords.lat });
      this.props.onChange({ lat: newCoords.lat, lng: newCoords.lng });
    }); // moveend also fires on zoomend
  };

  getCoordsFrom(elt) {
    if (elt._geoloc && elt._geoloc.lat && elt._geoloc.lng)
      return [elt._geoloc.lng, elt._geoloc.lat];
    return null;
  }

  componentDidMount() {
    let record = this.props.getWorkingRecord();
    this.props.mapbox
      .buildMap(this.mapContainer, { center: this.getCoordsFrom(record) })
      .then(map => {
        this.map = map;
        this.props.mapbox.setLocale(this.map, this.props.commonStore.locale);
        this.geocoder = this.props.mapbox.addGeocoder(
          this.map,
          this.geocoderContainer
        );

        this.createCenteredMarker();

        this.geocoder.on("result", res => {
          this.setState(
            {
              lat: res.result.geometry.coordinates[1],
              lng: res.result.geometry.coordinates[0]
            },
            async () => {
              // @todo : contact Mapbox sales to enable the permanent endpoint
              // @todo : Do not deploy in production until we don't have the Mapbox sales response.
              let response = await request(
                `https://api.mapbox.com/geocoding/v5/mapbox.places-permanent/${this.state.longitude},${this.state.latitude}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
              );
              console.log(response);
              this.props.onChange({ lat: this.state.lat, lng: this.state.lng });
              if (this.props.handleSave) this.props.handleSave(["_geoloc"]);
            }
          );
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div
        className={classes.root}
        onBlur={() => this.props.handleSave(["_geoloc"])}
      >
        <div
          ref={el => (this.geocoderContainer = el)}
          className={classes.geocoder}
        ></div>
        <div
          ref={el => (this.mapContainer = el)}
          className={classes.mapContainer}
        ></div>
      </div>
    );
  }
}

export default inject("commonStore")(
  observer(withMapbox(withStyles(styles)(GeocodingField)))
);
