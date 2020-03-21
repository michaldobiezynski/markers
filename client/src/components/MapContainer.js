import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from 'axios';

import './MapContainer.css';

class MapContainer extends Component {
  state = {
    isLoading: false,
    points: [],
  };

  render() {
    const mapClicked = (mapProps, map, clickEvent) => {
      this.setState({
        points: [
          ...this.state.points,
          {
            id: Math.random().toString(),
            lat: clickEvent.latLng.lat(),
            lng: clickEvent.latLng.lng(),
          },
        ],
      });

      const url = 'http://localhost:5000/api/map/add';

      const data = {
        id: Math.random().toString(),
        lat: clickEvent.latLng.lat(),
        lng: clickEvent.latLng.lng(),
      };

      axios
        .post(url, {
          data,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .catch(error => console.error(error))
        .then(response => console.log(response));
    };

    const onMarkerClick = props => {
      this.setState({
        points: this.state.points.filter(point => {
          return (
            point.lat !== props.position.lat && point.lng !== props.position.lng
          );
        }),
      });

      const url = 'http://localhost:5000/api/map/delete';

      console.log(props);
      
      axios
        .delete(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            source: props.position,
          }
        })
        .catch(error => console.error(error))
        .then(response => console.log(response));
    };

    return this.state.isLoading ? (
      <div className='loadingMsg'>
        <h1>Loading...</h1>
      </div>
    ) : (
      <Map
        className='map'
        google={this.props.google}
        onClick={mapClicked}
        zoom={12}
        initialCenter={{
          lat: 55.96995600000001,
          lng: -3.2492070000000695,
        }}>
        {this.state.points.map(point => {
          return (
            <Marker
              onClick={onMarkerClick}
              key={point.id}
              position={{ lat: point.lat, lng: point.lng }}
            />
          );
        })}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBgQKw_9hpdtO261cpR3IDWwhRgTdpNBx8',
})(MapContainer);
