import React from "react";
import MapboxGL from "@rnmapbox/maps";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import SnapCarousel from "react-native-snap-carousel";
import findDistance from "@turf/distance";
import { point } from "@turf/turf";

const styles = StyleSheet.create({
  scrollView: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 30,
    zIndex: 10,
  },
  slideStyle: {
    flex: 1,
    borderRadius: 10,
    margin: 2,
    elevation: 1,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    backgroundColor: "white",
  },
  slideTopRow: {
    flex: 0.6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  slideIcon: {
    height: 43,
    width: 43,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: 43 / 2,
  },
  slideMeta: {
    paddingLeft: 8,
    justifyContent: "center",
    flex: 1,
  },
  slideMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  slideBottomRow: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 22,
    flex: 0.4,
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 19,
    color: "white",
  },
  subheader: {
    fontSize: 14,
    color: "white",
  },
});

class Cards extends React.Component {
  static propTypes = {
    /**
     * Array of GeoJSON features that represent all locations on the map
     */
    data: PropTypes.array.isRequired,

    /**
     * Current location on map
     */
    origin: PropTypes.arrayOf(PropTypes.number),

    /**
     * Theme object that represent current theme displayed on map,
     * see Theme.js for more information
     */
    theme: PropTypes.object.isRequired,

    /**
     * Active card index, starts from 0
     */
    activeIndex: PropTypes.number,

    /**
     * Callback for events that change the active index
     */
    onActiveIndexChange: PropTypes.func,

    /**
     * Custom render for cards.
     */
    renderItem: PropTypes.func,

    /**
     * Custom card height
     */
    itemHeight: PropTypes.number,

    /**
     * Custom text info
     */
    textInfo: PropTypes.object,
  };

  static defaultProps = {
    itemHeight: 150,
  };

  constructor(props) {
    super(props);

    this.state = {
      sliderWidth: null,
      itemWidth: null,
    };

    this.renderDefaultItem = this.renderDefaultItem.bind(this);
    this.onScrollViewLayout = this.onScrollViewLayout.bind(this);
    this.onSnapToItem = this.onSnapToItem.bind(this);
  }

  onScrollViewLayout(e) {
    const layout = e.nativeEvent.layout;
    this.setState({
      sliderWidth: layout.width,
      itemWidth: layout.width + 4 - 50,
    });
  }

  onSnapToItem(updatedActiveIndex) {
    if (this.props.onActiveIndexChange) {
      this.props.onActiveIndexChange(updatedActiveIndex);
    }
  }

  renderDefaultItem({ item }) {
    const feature = item;
    const props = feature.properties;

    const style = {
      backgroundColor: "transparent",
      width: this.state.itemWidth,
      height: this.props.itemHeight,
    };

    let distance = findDistance(point(this.props.origin), feature, {
      units: "miles",
    });
    distance = Math.round(distance * 10) / 10;

    return (
      <View key={feature.id} style={style}>
        <View style={styles.slideStyle}>
          <View
            style={[
              styles.slideTopRow,
              { backgroundColor: this.props.theme.primaryColor },
            ]}
          >
            <View style={styles.slideIcon}>
              <Image
                source={this.props.theme.cardIcon}
                resizeMode="contain"
                style={{ flex: 1 }}
              />
            </View>

            <View style={styles.slideMeta}>
              <View style={styles.slideMetaRow}>
                <Text style={styles.header}>{props.name}</Text>
                <Text style={styles.header}>{distance}</Text>
              </View>

              <View style={styles.slideMetaRow}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={[styles.subheader, { flex: 0.9 }]}
                >
                  {props.addressFormatted}
                </Text>
                <Text style={[styles.subheader, { paddingRight: 4 }]}>mi</Text>
              </View>
            </View>
          </View>

          <View style={styles.slideBottomRow}>
            <View>
              <Text
                style={[
                  styles.subheader,
                  { color: this.props.theme.cardTextColor },
                ]}
              >
                {this.props.textInfo?.leftText?.title}
              </Text>
              <Text
                style={[
                  styles.subheader,
                  { color: this.props.theme.cardTextColor },
                ]}
              >
                {this.props.textInfo?.leftText?.value}
              </Text>
            </View>

            <View>
              <Text
                style={[
                  styles.subheader,
                  { color: this.props.theme.cardTextColor, textAlign: "right" },
                ]}
              >
                {this.props.textInfo?.rightText?.title}
              </Text>
              <Text
                style={[
                  styles.subheader,
                  { color: this.props.theme.cardTextColor },
                ]}
              >
                {this.props.textInfo?.rightText?.value}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  get renderItem() {
    return this.props.renderItem
      ? this.props.renderItem
      : this.renderDefaultItem;
  }

  renderCarousel() {
    if (
      !this.props.origin ||
      !this.state.sliderWidth ||
      !this.state.itemWidth ||
      !this.props.data
    ) {
      return null;
    }
    return (
      <SnapCarousel
        lockScrollWhileSnapping
        ref={(c) => (this.carousel = c)}
        data={this.props.data}
        firstItem={this.props.activeIndex}
        onSnapToItem={this.onSnapToItem}
        renderItem={this.renderItem}
        sliderWidth={this.state.sliderWidth}
        itemWidth={this.state.itemWidth}
      />
    );
  }

  render() {
    return (
      <ScrollView
        scrollEventThrottle={200}
        inactiveSlideOpacity={0.1}
        onLayout={this.onScrollViewLayout}
        bounces={true}
        directionalLockEnabled={true}
        style={styles.scrollView}
      >
        {this.renderCarousel()}
      </ScrollView>
    );
  }
}

export default Cards;
