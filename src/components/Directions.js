import React from "react";
import PropTypes from "prop-types";
import MapboxGL from "@rnmapbox/maps";
import MapboxClient from "mapbox";

import Places from "./Places";

const styles = {
  directionsLine: {
    lineWidth: 3,
    lineCap: "round",
    lineJoin: "round",
  },
};

class Directions extends React.Component {
  static propTypes = {
    /**
     * Mapbox access token
     */
    accessToken: PropTypes.string.isRequired,

    /**
     * Origin coordinate in [longitude, latitude] format
     */
    origin: PropTypes.arrayOf(PropTypes.number),

    /**
     * Destination coordinate in [longitude, latitude] format
     */
    destination: PropTypes.arrayOf(PropTypes.number),

    /**
     * Callback that get fired anytime directions are fetched from API.
     */
    onDirectionsFetched: PropTypes.func,

    /**
     * Type of directions that are fetched from API. Possible choices are
     * walking, driving, cycling. Defaults to driving
     */
    type: PropTypes.oneOf([
      "mapbox/driving-traffic",
      "mapbox/walking",
      "mapbox/cycling",
      "mapbox/driving-traffic",
    ]),

    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      mapboxClient: null,
      directions: null,
    };

    this._mapboxClient = null;
  }

  async componentDidMount() {
    try {
      this.setState(
        { mapboxClient: new MapboxClient(this.props.accessToken) },
        () => {
          this.fetchDirections(this.props.origin, this.props.destination);
        }
      );
    } catch (error) {
      console.log("error mapboxClient", error);
    }
  }

  componentWillReceiveProps(nextProps) {
    const origin = this.props.origin;
    const dest = this.props.destination;

    if (this.state.directions && (!origin || !dest)) {
      this.setState({ directions: null });
      return;
    }

    const nextOrigin = nextProps.origin;
    const nextDest = nextProps.destination;

    if (
      this.areCoordinatesEqual(origin, nextOrigin) &&
      this.areCoordinatesEqual(dest, nextDest)
    ) {
      return;
    }

    if (nextOrigin && nextDest) {
      this.fetchDirections(nextOrigin, nextDest);
    }
  }

  areCoordinatesEqual(c1, c2) {
    if (!c1 || !c2) {
      return false;
    }
    const dLng = Math.abs(c1[0] - c2[0]);
    const dLat = Math.abs(c1[1] - c2[1]);
    return dLng <= 6e-6 && dLat <= 6e-6;
  }

  async fetchDirections(origin, dest) {
    if (!origin || !dest || !this.state.mapboxClient) {
      return;
    }

    const originLatLng = {
      latitude: origin[1],
      longitude: origin[0],
    };

    const destLatLng = {
      latitude: dest[1],
      longitude: dest[0],
    };

    const requestOptions = {
      profile: this.props.type,
      geometry: "polyline",
    };

    let res = null;
    try {
      res = await this.state.mapboxClient.getDirections(
        [originLatLng, destLatLng],
        requestOptions
      );
    } catch (e) {
      console.log(e); // eslint-disable-line
    }

    if (res == null) {
      return;
    }

    const directions = res.entity.routes[0];
    if (!directions) {
      return;
    }

    if (this.props.onDirectionsFetched) {
      this.props.onDirectionsFetched(directions);
    }

    this.setState({ directions: directions });
  }

  render() {
    if (!this.state.directions) {
      return null;
    }
    return (
      <MapboxGL.ShapeSource
        id="mapbox-directions-source"
        shape={this.state.directions.geometry}
      >
        <MapboxGL.LineLayer
          id="mapbox-directions-line"
          belowLayerID={Places.UnselectedSymbolID}
          style={{ ...styles.directionsLine, ...this.props.style }}
        />
      </MapboxGL.ShapeSource>
    );
  }
}

export default Directions;
