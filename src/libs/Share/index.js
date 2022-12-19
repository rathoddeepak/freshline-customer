import { requireNativeComponent, Dimensions, PixelRatio } from 'react-native';

import {NativeModules} from 'react-native';
const Share = NativeModules.Share;
export default {
  getAppList(text){
    return Share.GetAppList(text);
  },
  shareTo(index){
    return Share.ShareTo(index);
  },
  getFeaturedList(){
  	return Share.GetFeaturedList();
  },
  shareApp(p, t){
    return Share.ShareApp(p, t);
  },
  clear(){
    return Share.clear();
  }
}