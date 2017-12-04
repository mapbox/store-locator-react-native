import MapboxGL from '@mapbox/react-native-mapbox-gl';
import StoreLocatorKit from '@mapbox/store-locator-react-native';

import purpleUnselectedBurger from '../assets/purple_unselected_burger.png';
import purpleSelectedBurger from '../assets/purple_selected_burger.png';
import blueUnselectedIceCream from '../assets/blue_unselected_ice_cream.png';
import blueSelectedIceCream from '../assets/blue_selected_ice_cream.png';
import greenUnselectedMoney from '../assets/green_unselected_money.png';
import greenSelectedMoney from '../assets/green_selected_money.png';
import grayUnselectedBike from '../assets/white_unselected_bike.png';
import graySelectedBike from '../assets/gray_selected_bike.png';
import whiteUnselectedHouse from '../assets/white_unselected_house.png';
import whiteSelectedHouse from '../assets/gray_selected_house.png';

import bicycleIcon from '../assets/bicycle_icon.png';
import cheeseBurgerIcon from '../assets/cheese_burger_icon.png';
import houseIcon from '../assets/house_icon.png';
import moneyIcon from '../assets/money_bag_icon.png';
import iceCreameIcon from '../assets/ice_cream_icon.png';

export const purpleTheme = new StoreLocatorKit.Theme({
  icon: purpleUnselectedBurger,
  activeIcon: purpleSelectedBurger,
  styleURL: 'mapbox://styles/mapbox/cj7bww7is2f4i2rnwyxkzpwu7',
  primaryColor: `#A35BCD`,
  primaryDarkColor: '#5D39BA',
  directionsLineColor: '#987DDF',
  cardIcon: cheeseBurgerIcon,
  cardTextColor: '#6A159B',
  accentColor: '#C7A8D9',
})

export const blueTheme = new StoreLocatorKit.Theme({
  icon: blueUnselectedIceCream,
  activeIcon: blueSelectedIceCream,
  styleURL: 'mapbox://styles/mapbox/cj7bwwv3caf7l2spgukxm8bwv',
  primaryColor: '#45AAE9',
  primaryDarkColor: '#268DBA',
  directionsLineColor: '#6ECAF1',
  cardIcon: iceCreameIcon,
  cardTextColor: '#1082B2',
  accentColor: '#9FCCE0',
});

export const greenTheme = new StoreLocatorKit.Theme({
  icon: greenUnselectedMoney,
  activeIcon: greenSelectedMoney,
  styleURL: 'mapbox://styles/mapbox/cj62n87yx3mvi2rp93sfp2w9z',
  primaryColor: '#5AE323',
  primaryDarkColor: '#3BC802',
  directionsLineColor: '#3BC802',
  cardIcon: moneyIcon,
  cardTextColor: '#000000',
  accentColor: '#78F645',
});

export const grayTheme = new StoreLocatorKit.Theme({
  icon: grayUnselectedBike,
  activeIcon: graySelectedBike,
  styleURL: MapboxGL.StyleURL.Light,
  primaryColor: '#696969',
  primaryDarkColor: '#696969',
  directionsLineColor: '#696969',
  cardIcon: bicycleIcon,
  cardTextColor: '#696969',
  accentColor: '#9E9E9E',
});

export const neutralTheme = new StoreLocatorKit.Theme({
  icon: whiteUnselectedHouse,
  activeIcon: whiteSelectedHouse,
  styleURL: MapboxGL.StyleURL.StyleURL,
  primaryColor: '#00BAFF',
  primaryDarkColor: '#E8E5E0',
  directionsLineColor: '#00BAFF',
  cardIcon: houseIcon,
  cardTextColor: '#000000',
  accentColor: '#FFFFFF'
});
