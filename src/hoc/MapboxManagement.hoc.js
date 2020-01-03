import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import defaultProfilePicture from "../resources/images/placeholder_person.png";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const withMapbox = ComponentToWrap => {
  class MapboxManagement extends Component {
    buildMap = async (mapRef, options = {}) => {
      return new Promise((resolve, reject) => {
        var map = new mapboxgl.Map({
          container: mapRef,
          // style: "mapbox://styles/mapbox/streets-v10", // v11 causes issue with locale
          style: "mapbox://styles/mapbox/dark-v10",
          zoom: options.zoom || 5,
          center: options.center || [2.349014, 48.864716]
          // renderWorldCopies: false
        });

        map.on("load", () => {
          resolve(map);
        });
      });
    };

    setLocale(map, locale) {
      var mapboxLanguage = new MapboxLanguage();
      map.setStyle(mapboxLanguage.setLanguage(map.getStyle(), locale));
    };

    loadClusteredData = (map, geojson) => {
      this.markers = new Map();

      map.addSource("addresses", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 13, // Max zoom to cluster points on
        clusterRadius: 70 // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "addresses",
        filter: ["has", "point_count"],
        paint: {
          "circle-radius": 0
        }
      });

      map.on("data", e => {
        if (e.sourceId !== "addresses" || !e.isSourceLoaded) return;
        map.on("moveend", () => this.updateMarkers(map)); // moveend also fires on zoomend
        this.updateMarkers(map);
      });
    };

    updateMarkers = (map) => {
      const features = map.querySourceFeatures("addresses");
      const keepMarkers = [];

      for (let i = 0; i < features.length; i++) {
        const coords = features[i].geometry.coordinates;
        const props = features[i].properties;
        const featureID = props.id;

        const clusterID = props.cluster_id || null;

        if (props.cluster && this.markers.has("cluster_" + clusterID)) {
          //Cluster marker is already on screen
          keepMarkers.push("cluster_" + clusterID);
        } else if (props.cluster) {
          //This feature is clustered, create an icon for it and use props.point_count for its count
          var size = 50 + 5 * Math.log1p(props.point_count);
          var el = document.createElement("div");
          el.className = "mapCluster";
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.dataset.type = "cluster";
          el.innerHTML = `<div>${props.point_count}</div>`;
          const marker = new mapboxgl.Marker(el).setLngLat(coords);
          marker.addTo(map);
          keepMarkers.push("cluster_" + clusterID);
          this.markers.set("cluster_" + clusterID, el);
          el.addEventListener("click", e =>
            this.handleClusterClick(map, e, clusterID)
          );
        } else if (this.markers.has(featureID)) {
          //Feature marker is already on screen
          keepMarkers.push(featureID);
        } else {
          //Feature is not clustered and has not been created, create an icon for it
          const el = document.createElement("div");
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

          marker.addTo(map);
          keepMarkers.push(props.id);
          this.markers.set(props.id, el);
        }
      }

      //Let's clean-up any old markers. Loop through all markers
      this.markers.forEach((value, key, map) => {
        //If marker exists but is not in the keep array
        if (keepMarkers.indexOf(key) === -1) {
          value.remove();
          map.delete(key);
        }
      });
    };

    handleClusterClick = (map, event, clusterID) => {
      const clusters = map.queryRenderedFeatures(event.point, {
        layers: ["clusters"]
      });
      const wantedCluster = clusters.find(
        elt => elt.properties.cluster_id === clusterID
      );
      const coordinates = wantedCluster.geometry.coordinates;
      const currentZoom = map.getZoom();

      map
        .getSource("addresses")
        .getClusterExpansionZoom(
          wantedCluster.properties.cluster_id,
          (e, zoom) => {
            this.flyIntoCluster(map, coordinates, currentZoom, zoom);
          }
        );
    };

    flyIntoCluster = async (map, coordinates, currentZoom, wantedZoom) => {
      map.flyTo({
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

    render() {
      return (
        <ComponentToWrap
          {...this.props}
          mapbox={{
            buildMap: this.buildMap,
            setLocale: this.setLocale,
            loadClusteredData: this.loadClusteredData
          }}
        />
      );
    }
  }

  MapboxManagement = inject(
    "clapStore",
    "orgStore",
    "recordStore"
  )(observer(MapboxManagement));
  return MapboxManagement;
};
export default withMapbox;
