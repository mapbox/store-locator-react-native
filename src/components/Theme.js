class Theme {
  constructor (options = {}) {
    /**
     * Icon that will appear on map in an inactive state
     */
    this.icon = options.icon;

    /**
     * Icon that will appear on map in an active state
     */
    this.activeIcon = options.activeIcon;

    /**
     * Style URL for map.
     */
    this.styleURL = options.styleURL;

    /**
     * Primary color used by all components
     */
    this.primaryColor = options.primaryColor;

    /**
     * Primary dark color used by all components
     */
    this.primaryDarkColor = options.primaryDarkColor;

    /**
     * Color of the route line
     */
    this.directionsLineColor = options.directionsLineColor,

    /**
     * Icon that appears in the card view
     */
    this.cardIcon = options.cardIcon;

    /**
     * Text color of the bottom of the card.
     */
    this.cardTextColor = options.cardTextColor;

    /**
     * Accent color used by all components
     */
    this.accentColor = options.accentColor;
  }

  extend (overrides = {}) {
    Object.keys(overrides).forEach((prop) => {
      if (this.hasOwnProperty(prop)) {
        this[prop] = overrides[prop];
      }
    });
  }
}

export default Theme;
