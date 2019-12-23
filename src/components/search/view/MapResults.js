import React from "react";
import { inject, observer } from "mobx-react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { withStyles } from "@material-ui/core";

import { styles } from "./MapResults.css";
import "./marker.css";
import defaultProfilePicture from "../../../resources/images/placeholder_person.png";
React.lazy(() => import("../../../resources/stylesheets/font-awesome.min.css"));

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class MapResults extends React.Component {
  state = {};

  componentDidMount() {
    this.markers = new Map();
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v10", // v11 causes issue with locale
      zoom: 5,
      center: [2.349014, 48.864716]
      // renderWorldCopies: false
    });

    // this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on("load", this.setAddons2);

    // setTimeout(() => {
    // this.addRecordMarker({}, 48.864716, 2.349014);
    // this.addRecordMarker({}, 48.26421, 2.949014);
    // this.addRecordMarker({}, 48.965924, 1.949014);
    // this.addRecordMarker({}, 48.965924, 1.549014);
    // this.addRecordMarker({}, 47.765924, 2.549014);
    // this.addRecordMarker({}, 49.965924, 1.249014);
    // this.addRecordMarker({}, 50.265924, 2.949014);
    // }, 1000);
  }

  setAddons2 = () => {
    this.map.addSource("addresses", {
      type: "geojson",
      data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
      cluster: true,
      clusterMaxZoom: 13, // Max zoom to cluster points on
      clusterRadius: 70 // Radius of each cluster when clustering points (defaults to 50)
    });

    this.map.addLayer({
      id: "clusters",
      type: "circle",
      source: "addresses",
      filter: ["has", "point_count"],
      paint: {
        "circle-radius": 0
      }
    });

    this.map.on("data", e => {
      if (e.sourceId !== "addresses" || !e.isSourceLoaded) return;

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

      this.map.on("moveend", this.updateMarkers); // moveend also fires on zoomend
      this.updateMarkers();
    });
  };

  updateMarkers = () => {
    console.log(">>>>>>>>>>>>>>>>>> update markers");
    const features = this.map.querySourceFeatures("addresses");
    const keepMarkers = [];

    for (let i = 0; i < features.length; i++) {
      const coords = features[i].geometry.coordinates;
      const props = features[i].properties;
      const featureID = props.id;

      const clusterID = props.cluster_id || null;

      console.log(`${featureID || clusterID} ${props.cluster}`, props);

      if (props.cluster && this.markers.has("cluster_" + clusterID)) {
        // console.log(" cluster already on screen");
        //Cluster marker is already on screen
        keepMarkers.push("cluster_" + clusterID);
      } else if (props.cluster) {
        // console.log("create cluster");
        //This feature is clustered, create an icon for it and use props.point_count for its count
        var size = 50 + 5 * Math.log1p(props.point_count);
        var el = document.createElement("div");
        el.className = "mapCluster";
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.dataset.type = "cluster";
        el.innerHTML = `<div>${props.point_count}</div>`;
        const marker = new mapboxgl.Marker(el).setLngLat(coords);
        marker.addTo(this.map);
        keepMarkers.push("cluster_" + clusterID);
        this.markers.set("cluster_" + clusterID, el);
        el.addEventListener("click", e =>
          this.handleClusterClick(e, clusterID, features[i])
        );
      } else if (this.markers.has(featureID)) {
        // console.log("marker already on screen");
        //Feature marker is already on screen
        keepMarkers.push(featureID);
      } else {
        // console.log("create marker");
        //Feature is not clustered and has not been created, create an icon for it
        const el = document.createElement("div");
        // el.style.backgroundImage = "url(https://placekitten.com/g/50/50)";
        el.className = "marker";
        el.innerHTML = `<i class="fa fa-map-marker" aria-hidden="true"></i><img src="${defaultProfilePicture}" />`;
        el.dataset.type = "marker";

        const popupEl = document.createElement("div");
        popupEl.innerText = "Je suis une popup HTML";
        popupEl.style.width = "300px";
        popupEl.style.height = "50px";
        popupEl.style.background = "pink";
        const popup = new mapboxgl.Popup().setDOMContent(popupEl);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(coords)
          .setPopup(popup);

        marker.addTo(this.map);
        keepMarkers.push(props.id);
        this.markers.set(props.id, el);
      }
    }

    //Let's clean-up any old markers. Loop through all markers
    this.markers.forEach((value, key, map) => {
      // console.log(key, keepMarkers.indexOf(key));
      //If marker exists but is not in the keep array
      if (keepMarkers.indexOf(key) === -1) {
        // console.log("deleting key: " + key);
        //Remove it from the page
        value.remove();
        //Remove it from markers map
        map.delete(key);
      }
    });
  };

  flyIntoCluster = async (coordinates, currentZoom, wantedZoom) => {
    this.map.flyTo({
      center: coordinates,
      zoom: wantedZoom + 0.3,
      bearing: 0,
      speed: 1.5,
      easing: function(t) {
        if (t <= 0.5) return 2.0 * Math.pow(t, 2);
        t -= 0.5;
        return 2.0 * t * (1.0 - t) + 0.5;
      }
    });
  };

  handleClusterClick = (event, clusterID, data) => {
    const clusters = this.map.queryRenderedFeatures(event.point, {
      layers: ["clusters"]
    });
    const wantedCluster = clusters.find(
      elt => elt.properties.cluster_id === clusterID
    );
    const coordinates = wantedCluster.geometry.coordinates;
    const currentZoom = this.map.getZoom();

    this.map
      .getSource("addresses")
      .getClusterExpansionZoom(
        wantedCluster.properties.cluster_id,
        (e, zoom) => {
          this.flyIntoCluster(coordinates, currentZoom, zoom);
        }
      );
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
