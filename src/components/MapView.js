import React from "react";
import PropTypes from "prop-types";
import MapboxGL from "@rnmapbox/maps";

import { View, PixelRatio, Platform } from "react-native";

import Directions from "./Directions";
import CurrentLocation from "./CurrentLocation";
import Places from "./Places";
import Cards from "./Cards";
import Theme from "./Theme";
import DirectionType from "../enums/DirectionType";

import bbox from "@turf/bbox";
import { feature } from "@turf/turf";

const IS_ANDROID = Platform.OS === "android";
const BOUNDS_PADDING_SIDE = IS_ANDROID
  ? PixelRatio.getPixelSizeForLayoutSize(60)
  : 60;
const BOUNDS_PADDING_BOTTOM = IS_ANDROID
  ? PixelRatio.getPixelSizeForLayoutSize(206)
  : 206;

class MapView extends React.Component {
  static propTypes = {
    ...MapboxGL.MapView.propTypes,

    /**
     * Mapbox access token
     */
    accessToken: PropTypes.string.isRequired,

    /**
     * Theme applied to map, see Theme.js for more information
     */
    theme: PropTypes.instanceOf(Theme).isRequired,

    /**
     * Type of directions that get requested from API, possible direction types are
     * possible for driving, walking, and cycling.
     */
    directionType: PropTypes.oneOf([
      "mapbox/driving-traffic",
      "mapbox/walking",
      "mapbox/cycling",
      "mapbox/driving-traffic",
    ]),

    /**
     * FeatureCollection of points that we want to appear on the map.
     */
    featureCollection: PropTypes.object.isRequired,

    /**
     * Mocks user location to be the center coordinate on the map
     */
    simulateUserLocation: PropTypes.bool,
  };

  static defaultProps = {
    directionType: DirectionType.Default,
  };

  constructor(props) {
    super(props);

    let destination = null,
      activeID = -1;
    if (
      this.props.featureCollection &&
      this.props.featureCollection.features.length > 0
    ) {
      const feature = this.props.featureCollection.features[0];

      if (feature) {
        destination = feature.geometry.coordinates;
        activeID = feature.id;
      }
    }

    this.state = {
      activeIndex: 0,
      activeID: activeID,
      origin: null,
      region: null,
      layout: null,
      destination: destination,
      centerCoordinate: props.centerCoordinate,
    };

    this.onPress = this.onPress.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.onDirectionsFetched = this.onDirectionsFetched.bind(this);
    this.onActiveIndexChange = this.onActiveIndexChange.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onRegionWillChange = this.onRegionWillChange.bind(this);
  }

  onLayout(e) {
    const layout = e.nativeEvent.layout;
    this.setState({ layout: layout });
  }

  async onPress(pressFeature) {
    const { screenPointX, screenPointY } = pressFeature.properties;

    const hitFeatureCollection = await this.map.queryRenderedFeaturesAtPoint(
      [screenPointX, screenPointY],
      null,
      [Places.UnselectedSymbolID]
    );

    let feature = null;
    if (hitFeatureCollection.features.length > 0) {
      feature = hitFeatureCollection.features[0];

      for (let i = 0; i < this.props.featureCollection.features.length; i++) {
        const currentFeature = this.props.featureCollection.features[i];

        if (feature.id === currentFeature.id) {
          this.setState({
            activeIndex: i,
            isChangeFromPress: true,
            destination: feature.geometry.coordinates,
          });
          break;
        }
      }
    }
  }

  onActiveIndexChange(index) {
    const feature = this.props.featureCollection.features[index];

    if (!feature) {
      return;
    }

    this.setState({
      activeIndex: index,
      activeID: feature.id,
      isChangeFromPress: false,
      destination: feature.geometry.coordinates,
    });
  }

  onLocationChange(coord) {
    this.setState({ origin: coord });
  }

  onDirectionsFetched(directions) {
    if (!this.state.isChangeFromPress) {
      this.fitBounds(directions);
    }
  }

  fitBounds(directions) {
    const boundingBox = bbox(feature(directions.geometry));

    const padding = [
      BOUNDS_PADDING_BOTTOM,
      BOUNDS_PADDING_SIDE,
      BOUNDS_PADDING_BOTTOM,
      BOUNDS_PADDING_SIDE,
    ];
    // this.map.fitBounds(
    //   [boundingBox[2], boundingBox[3]],
    //   [boundingBox[0], boundingBox[1]],
    //   padding,
    //   200
    // );
  }

  onRegionWillChange(regionFeature) {
    this.setState({ region: regionFeature });

    if (this.props.onRegionWillChange) {
      this.props.onRegionWillChange(regionFeature);
    }
  }

  get directionsStyle() {
    return {
      lineColor: this.props.theme.directionsLineColor,
    };
  }

  get placesStyle() {
    return {
      style: {
        iconImage: this.props.theme.icon,
      },
      activeStyle: {
        iconImage: this.props.theme.activeIcon,
      },
    };
  }

  get currentLocationStyle() {
    return {
      innerCircleStyle: {
        circleColor: this.props.theme.directionsLineColor,
      },
      outerCircleStyle: {
        circleColor: this.props.theme.directionsLineColor,
      },
    };
  }

  render() {
    let mockUserLocation = null;
    if (this.props.simulateUserLocation) {
      mockUserLocation = this.state.centerCoordinate;
    }

    return (
      <View style={this.props.style} onLayout={this.onLayout}>
        <MapboxGL.MapView
          ref={(c) => (this.map = c)}
          styleURL={this.props.theme.styleURL}
          onPress={this.onPress}
          onRegionWillChange={this.onRegionWillChange}
          style={{ flex: 1 }}
        >
          {this.props.children}
          <MapboxGL.Camera
            zoomLevel={this.props.zoomLevel}
            centerCoordinate={this.state.centerCoordinate}
          />
          <Directions
            accessToken={this.props.accessToken}
            origin={this.state.origin}
            destination={this.state.destination}
            onDirectionsFetched={this.onDirectionsFetched}
            style={this.directionsStyle}
          />

          <Places
            featureCollection={this.props.featureCollection}
            activeIndex={this.state.activeIndex}
            activeID={this.state.activeID}
            {...this.placesStyle}
          />

          <CurrentLocation
            mockUserLocation={mockUserLocation}
            onLocationChange={this.onLocationChange}
            {...this.currentLocationStyle}
          />
        </MapboxGL.MapView>

        <Cards
          theme={this.props.theme}
          origin={this.state.origin}
          data={this.props.featureCollection.features}
          onActiveIndexChange={this.onActiveIndexChange}
          activeIndex={this.state.activeIndex}
        />
      </View>
    );
  }
}

export default MapView;
