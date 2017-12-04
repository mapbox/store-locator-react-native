import React from 'react';
import PropTypes from 'prop-types';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

const styles = MapboxGL.StyleSheet.create({
  innerCircle: {
    circleRadius: 8,
  },
  outerCircle: {
    circleRadius: 13,
    circleOpacity: 0.40,
  }
});

class CurrentLocation extends React.Component {
  static propTypes = {
    mockUserLocation: PropTypes.arrayOf(PropTypes.number),
    pulse: PropTypes.bool,
    onLocationChange: PropTypes.func,
    innerCircleStyle: PropTypes.any,
    outerCircleStyle: PropTypes.any,
  };

  constructor (props) {
    super(props);

    this.state = {
      currentPosition: null,
    };

    this._locationWatchID = -1;
    this.onLocationChange = this.onLocationChange.bind(this);
    this.onLocationError = this.onLocationError.bind(this);
  }

  componentDidMount () {
    if (!this.props.mockUserLocation) {
      this._locationWatchID = navigator.geolocation.watchPosition(
        this.onLocationChange,
        this.onLocationError,
        { enableHighAccuracy: true, useSignificantChanges: true },
      );
    } else {
      this.setState({ currentPosition: MapboxGL.geoUtils.makePoint(this.props.mockUserLocation) });

      if (this.props.onLocationChange) {
        this.props.onLocationChange(this.props.mockUserLocation);
      }
    }
  }

  componentWillUnmount () {
    if (!this.props.mockUserLocation) {
      navigator.geolocation.clearWatch(this._locationWatchID);
    }
  }

  onLocationChange (position) {
    const coord = [position.coords.longitude, position.coords.latitude];

    if (this.props.onLocationChange) {
      this.props.onLocationChange(coord);
    }

    this.setState({
      currentPosition: MapboxGL.geoUtils.makePoint(coord),
    });
  }

  onLocationError (error) {
    console.log('Geolocation error', error);
  }

  render () {
    if (!this.state.currentPosition) {
      return null;
    }

    return (
      <MapboxGL.ShapeSource id='store-locator-current-location-source' shape={this.state.currentPosition}>
        <MapboxGL.CircleLayer
          id='store-locator-current-location-outer-circle'
          style={[styles.outerCircle, this.props.outerCircleStyle]} />

        <MapboxGL.CircleLayer
          id='store-locator-current-location-inner-circle'
          aboveLayerID='store-locator-current-location-outer-circle'
          style={[styles.innerCircle, this.props.innerCircleStyle]} />
      </MapboxGL.ShapeSource>
    );
  }
}

export default CurrentLocation;
