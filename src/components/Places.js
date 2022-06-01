import React from "react";
import PropTypes from "prop-types";
import { Platform } from "react-native";
import MapboxGL from "@rnmapbox/maps";

const styles = {
  icon: {
    iconAllowOverlap: true,
    iconSize: Platform.OS === "android" ? 0.5 : 0.25,
  },
};

class Places extends React.Component {
  static SelectedSymbolID = "store-locator-selected-symbol";
  static UnselectedSymbolID = "store-locator-places-unselected-symbols";

  static propTypes = {
    /**
     * FeatureCollection of points that we want to appear on the map.
     */
    featureCollection: PropTypes.object.isRequired,

    /**
     * Active ID of feature
     */
    activeID: PropTypes.any,

    /**
     * Active feature index
     */
    activeIndex: PropTypes.number,

    /**
     * Override any default styles on the inactive marker layer
     */
    style: PropTypes.any,

    /**
     * Override any default styles on the active marker layer
     */
    activeStyle: PropTypes.any,
  };

  static defaultProps = {
    activeIndex: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: props.activeIndex,
      activeID: props.activeID,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.activeIndex !== nextProps.activeIndex) {
      this.setState({
        activeIndex: nextProps.activeIndex,
        activeID:
          this.props.featureCollection.features[nextProps.activeIndex].id,
      });
    }
  }

  render() {
    if (!this.props.featureCollection) {
      return null;
    }
    return (
      <MapboxGL.ShapeSource
        id="store-locator-places-source"
        shape={this.props.featureCollection}
      >
        <MapboxGL.SymbolLayer
          id={Places.UnselectedSymbolID}
          filter={["!=", "$id", this.state.activeID]}
          style={{...styles.icon, ...this.props.style}}
        />

        <MapboxGL.SymbolLayer
          id={Places.SelectedSymbolID}
          aboveLayerID={Places.UnselectedSymbolID}
          filter={["==", "$id", this.state.activeID]}
          style={{...styles.icon, ...this.props.activeStyle}}
        />
      </MapboxGL.ShapeSource>
    );
  }
}

export default Places;
