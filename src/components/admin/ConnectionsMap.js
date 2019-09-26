import React from 'react';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Header from '../header/Header';
import './ConnectionsMap.css';
import agent from '../../agent';
import moment from 'moment';

require('react-leaflet-markercluster/dist/styles.min.css');

class ConnectionsMap extends React.Component {

  state = {
    connections: []
  }

  componentDidMount() {
    agent.ConnectionLog.get()
      .then(response => {
        this.setState({ connections: response.data });
      })
  }


  render() {
    const { connections } = this.state;
    console.log('render map')

    return (
      <div>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
        <Header />
        <Map className="markercluster-map" center={[51.0, 19.0]} zoom={4} maxZoom={18}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <MarkerClusterGroup>
            {connections.map((connection, index) => {
              if (connection.location.latitude) {
                return (
                  <Marker position={[connection.location.latitude, connection.location.longitude]} key={connection._id}>
                    <Popup>
                      User : {connection.user} <br />
                      Le : {moment(connection.created).fromNow()}
                    </Popup>
                  </Marker>
                )
              } else {
                return null;
              }
            })}
          </MarkerClusterGroup>
        </Map>
      </div>
    );
  }
}


export default ConnectionsMap;