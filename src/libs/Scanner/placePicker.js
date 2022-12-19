import {NativeModules} from 'react-native';
const {PlacePicker} = NativeModules;
export default {
  openPicker(params, callback){
    return PlacePicker.openPicker(params, callback);
  }
}