import React from 'react';

import {
  View,
  Text,
  Platform,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';

import MapboxGL from '@mapbox/react-native-mapbox-gl';
import StoreLocatorKit from '@mapbox/store-locator-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import bbox from '@turf/bbox';

import places from '../assets/places.json';

import {
  purpleTheme,
  blueTheme,
  greenTheme,
  grayTheme,
  neutralTheme,
} from './themes';

const IS_IOS = Platform.OS === 'ios';
const MAPBOX_ACCESS_TOKEN = '<Enter access token here>';

console.disableYellowBox = true;

const ThemeList = [
  {
    name: 'Blue Theme',
    theme: blueTheme,
    image: require('../assets/blue_button_image.png'),
  },
  {
    name: 'Purple Theme',
    theme: purpleTheme,
    image: require('../assets/purple_button_image.png'),
  },
  {
    name: 'Green Theme',
    theme: greenTheme,
    image: require('../assets/green_button_image.png'),
  },
  {
    name: 'Gray Theme',
    theme: grayTheme,
    image: require('../assets/gray_button_image.png'),
  },
  {
    name: 'Neutral Theme',
    theme: neutralTheme,
    image: require('../assets/neutral_button_image.png'),
  },
];

const styles = StyleSheet.create({
  matchParent: {
    flex: 1,
  },
  mapHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'transparent',
  },
  mapGradient: {
    flex: 1,
    height: 120,
  },
  mapHeaderText: {
    fontSize: 24,
    color: 'white',
    alignSelf: 'center',
    position: 'relative',
    top: -60,
  },
  backArrow: {
    position: 'absolute',
    top: 32,
    left: 24,
  },
});

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isGranted: IS_IOS,
      activeTheme: null,
      initialLocation: [-77.034084, 38.90],
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.renderThemeItem = this.renderThemeItem.bind(this);
  }

  async componentWillMount () {
    if (!IS_IOS) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({ isGranted: isGranted });
    }
    MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);
  }

  onDismiss () {
    StatusBar.setBarStyle('dark-content');
    this.setState({ activeTheme: null });
  }

  renderThemeItem ({ item, index }) {
    const marginTop = index === 0 ? 30 : 15;
    const marginBottom = 15;

    const style = {
      flex: 1,
      height: 120,
      marginTop: marginTop,
      marginBottom: marginBottom,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: item.theme.primaryColor,
    };

    return (
      <TouchableOpacity onPress={() => this.setState({ activeTheme: item.theme })}>
        <View style={style}>
          <Image source={item.image} resizeMode='contain' style={styles.matchParent} />
        </View>
      </TouchableOpacity>
    );
  }

  renderThemeList () {
    return (
      <FlatList
        data={ThemeList}
        keyExtractor={(item) => item.name}
        renderItem={this.renderThemeItem} />
    );
  }

  renderMap () {
    if (this.state.activeTheme) {
      StatusBar.setBarStyle('light-content');
    }

    return (
      <Modal
        visible={!!this.state.activeTheme}
        animationType='slide'
        onRequestClose={this.onDismiss}>
        <View style={styles.matchParent}>
          <StoreLocatorKit.MapView
            simulateUserLocation
            accessToken={MAPBOX_ACCESS_TOKEN}
            theme={this.state.activeTheme}
            centerCoordinate={this.state.initialLocation}
            featureCollection={places}
            zoomLevel={13}
            style={styles.matchParent} />

          <View style={styles.mapHeader}>
            <LinearGradient
              style={styles.mapGradient}
              colors={['black', 'transparent']} />

            <Icon
              name='keyboard-backspace'
              size={28}
              onPress={this.onDismiss}
              style={styles.backArrow}
              color='white' />

            <Text style={styles.mapHeaderText}>Store Locator</Text>
          </View>
        </View>
      </Modal>
    );
  }

  render () {
    if (!this.state.isGranted) {
      return null;
    }
    return (
      <View style={styles.matchParent}>
        {this.renderThemeList()}
        {this.renderMap()}
      </View>
    )
  }
}

export default App;
