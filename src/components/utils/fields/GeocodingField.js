import React from "react";
import withMapbox from "../../../hoc/MapboxManagement.hoc";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core";

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
    left:0,
    right: 0,
    margin: "auto",
    top: 16,
    '& > div': {
      width: '100%',
      maxWidth: 'inherit',
    }
  }
});

class GeocodingField extends React.Component {
  componentDidMount() {
    this.props.mapbox.buildMap(this.mapContainer).then(map => {
      this.map = map;
      this.props.mapbox.setLocale(this.map, this.props.commonStore.locale);
      this.geocoder = this.props.mapbox.addGeocoder(this.map, this.geocoderContainer);

      this.geocoder.on('result', (res) => {
        console.log('result')
        console.log(res.result.place_name);
        console.log(res.result.geometry.coordinates); // coordinates selected by the user
        // at the end, need a call to the mapbox permanent endpoint in order to persist the data
      });
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
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
