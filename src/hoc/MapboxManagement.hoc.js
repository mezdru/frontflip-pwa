import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import defaultProfilePicture from "../resources/images/placeholder_person.png";
import profileService from "../services/profile.service";
import Spiderifier from "../resources/js/Spiderifier";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const withMapbox = ComponentToWrap => {
  class MapboxManagement extends Component {
    markers = new Map();

    buildMap = async (mapRef, options = {}) => {
      return new Promise((resolve, reject) => {
        var map = new mapboxgl.Map({
          container: mapRef,
          // style: "mapbox://styles/mapbox/streets-v10", // v11 causes issue with locale
          style: "mapbox://styles/mapbox/dark-v10",
          maxZoom: 22,
          zoom: options.zoom || (options.center ? 10 : 5),
          center: options.center || [2.349014, 48.864716]
          // renderWorldCopies: false
        });

        map.on("load", () => {
          map.addControl(
            new mapboxgl.ScaleControl({ position: "bottom-right" })
          );

          resolve(map);
        });
      });
    };

    addGeocoder(map, geocoderContainer) {
      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
      });

      if (geocoderContainer) {
        geocoderContainer.appendChild(geocoder.onAdd(map));
      } else {
        map.addControl(geocoder);
      }

      return geocoder;
    }

    setLocale(map, locale) {
      var mapboxLanguage = new MapboxLanguage();
      map.setStyle(mapboxLanguage.setLanguage(map.getStyle(), locale));
    }

    loadClusteredData = (map, geojson, onMarkerClick) => {
      if (map.getSource("addresses")) {
        map.getSource("addresses").setData(geojson);
        map.removeLayer("clusters");
      } else {
        map.addSource("addresses", {
          type: "geojson",
          data: geojson,
          cluster: true,
          // clusterMaxZoom: 21.9, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });
      }

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
        if (e.sourceId !== "addresses") return;
        map.on("moveend", () => this.updateMarkers(map, onMarkerClick)); // moveend also fires on zoomend
        this.updateMarkers(map, onMarkerClick);
      });
    };

    createMarker = (coords, onMarkerClick, props) => {
      let el;
      if (props) {
        el = document.createElement("div");
        el.className = "marker";
        let pic =
          profileService.getPicturePathResized(
            { url: props.pictureUrl },
            "person",
            "38x38"
          ) || defaultProfilePicture;
        el.innerHTML = `<i class="fa fa-map-marker" aria-hidden="true"></i><img src="${pic}" />`;
        el.dataset.type = "marker";
        el.addEventListener("click", e => onMarkerClick(props));
      }

      return [new mapboxgl.Marker(el || null).setLngLat(coords), el];
    };

    getExpansionZoom = async (map, clusterID) => {
      let wantedClusterExpansionZoom = await new Promise((resolve, reject) => {
        map
          .getSource("addresses")
          .getClusterExpansionZoom(clusterID, (e, zoom) => {
            if (!e) return resolve(zoom);
            return resolve(null);
          });
      });
      if (wantedClusterExpansionZoom >= 18)
        return wantedClusterExpansionZoom - 0.1;
      else return wantedClusterExpansionZoom + 0.3;
    };

    updateMarkers = (map, onMarkerClick) => {
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
            this.handleClusterClick(map, e, clusterID, onMarkerClick)
          );
        } else if (this.markers.has(featureID)) {
          //Feature marker is already on screen
          keepMarkers.push(featureID);
        } else {
          //Feature is not clustered and has not been created, create an icon for it
          const [marker, markerEl] = this.createMarker(
            coords,
            onMarkerClick,
            props
          );
          marker.addTo(map);
          keepMarkers.push(props.id);
          this.markers.set(props.id, markerEl);
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

    createMarkerElement(spiderParam, props, index, onClick) {
      var parentElem = document.createElement("div"),
        markerElem = document.createElement("div"),
        lineElem = document.createElement("div");
  
      parentElem.className = "marker-parent";
      lineElem.className = "line-div";
      parentElem.style.zIndex = 1000 - index;
      markerElem.className = "marker";

      let pic =
        profileService.getPicturePathResized(
          { url: props.pictureUrl },
          "person",
          "50x50"
        ) || defaultProfilePicture;
      markerElem.innerHTML = `<img class="marker-img" src="${pic}" />`;
      markerElem.dataset.type = "marker";
      markerElem.addEventListener("click", e => onClick(props));
  
      parentElem.appendChild(lineElem);
      parentElem.appendChild(markerElem);
  
      lineElem.style.height = spiderParam.legLength + "px";
      lineElem.style.transform =
        "rotate(" + (spiderParam.angle - Math.PI / 2) + "rad)";
  
      return parentElem;
    }

    handleClusterClick = async (map, e, clusterID, onMarkerClick) => {
      var spiderifier = new Spiderifier(map, {createMarkerElement: this.createMarkerElement, onClick: onMarkerClick});
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"]
      });

      const wantedCluster = features.find(
        elt => elt.properties.cluster_id === clusterID
      );
      const coordinates = wantedCluster.geometry.coordinates;
      const currentZoom = map.getZoom();
      const wantedZoom = await this.getExpansionZoom(map, clusterID);

      spiderifier.unspiderfy();
      if (!features.length) {
        return;
      } else if (currentZoom < wantedZoom) {
        this.flyIntoCluster(map, coordinates, currentZoom, wantedZoom);
      } else {
        map
          .getSource("addresses")
          .getClusterLeaves(features[0].properties.cluster_id, 100, 0, function(
            err,
            leafFeatures
          ) {
            if (err) {
              return console.error(
                "error while getting leaves of a cluster",
                err
              );
            }
            var markers = leafFeatures.map(elt => elt.properties);
            markers = markers.slice(0, 20); // 20 max
            spiderifier.spiderfy(features[0].geometry.coordinates, markers);
          });
      }
    };

    flyIntoCluster = async (map, coordinates, currentZoom, wantedZoom) => {
      map.flyTo({
        center: coordinates,
        zoom: wantedZoom,
        bearing: 0,
        speed: 1.5,
        easing: function(t) {
          if (t <= 0.5) return 2.0 * Math.pow(t, 2);
          t -= 0.5;
          return 2.0 * t * (1.0 - t) + 0.5;
        }
      });
    };

    convertAlgoliaToGeojson = hits => {
      if (!hits || !Array.isArray(hits) || hits.length === 0) return;

      let features = [];

      hits.forEach(hit => {
        if (hit._geoloc && hit._geoloc.lat && hit._geoloc.lng) {
          features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [hit._geoloc.lng, hit._geoloc.lat]
            },
            properties: {
              tag: hit.tag,
              id: hit.objectID,
              pictureUrl:
                hit.picture && hit.picture.url
                  ? hit.picture.url
                  : defaultProfilePicture
            }
          });
        }
      });
      return {
        type: "FeatureCollection",
        features: features
      };
    };

    render() {
      return (
        <ComponentToWrap
          {...this.props}
          mapbox={{
            buildMap: this.buildMap,
            setLocale: this.setLocale,
            loadClusteredData: this.loadClusteredData,
            addGeocoder: this.addGeocoder,
            convertAlgoliaToGeojson: this.convertAlgoliaToGeojson,
            createMarker: this.createMarker
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
