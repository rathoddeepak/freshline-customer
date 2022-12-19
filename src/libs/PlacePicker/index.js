import { requireNativeComponent, Dimensions, PixelRatio } from 'react-native';

module.exports = {
  get PlacePicker() {
    return require('./placePicker').default;
  }
}