import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Text,
  Image,
  Vibration,
  Alert,
  Platform,  
  StatusBar
} from 'react-native';
import QRScannerView from './scannerview';
export default class QRScanner extends Component {
  constructor(props) {
    super(props);    
    this.state = {      
      canscan:true,
      barCodeSize: {}
    }
  }
  static defaultProps =  {
    onRead: ()=>{},
    renderTopView: () =>{},
    renderBottomView: ()=><View style={{flex:1,backgroundColor:'#0000004D'}}/>,
    rectHeight: 200,
    rectWidth: 200,
    flashMode: false,
    finderX: 0,
    finderY: 0,
    zoom: 0.2,
    translucent: false    
  }
  stop = () => {
    pauseScanner();
  }
  start = () => {
    resumeScanner()
  }
  render() {    
    return (
      <View style={{
        flex: 1
      }}>
        
        
      </View>
    );
  }

  isShowCode = false;

  barCodeSize = (size) => this.setState({barCodeSize:size})

  returnMax= (a,b) =>  a > b ? a : b

  returnMin= (a,b) =>  a < b ? a : b

  iosBarCode = (e) => {
    let x = Number(e.bounds.origin.x)
    let y = Number(e.bounds.origin.y)
    let width = e.bounds.size.width
    let height = e.bounds.size.height
    let viewMinX = this.state.barCodeSize.x - this.props.finderX
    let viewMinY = this.state.barCodeSize.y - this.props.finderY
    let viewMaxX = this.state.barCodeSize.x + this.state.barCodeSize.width - width - this.props.finderX
    let viewMaxY = this.state.barCodeSize.y + this.state.barCodeSize.height - height - this.props.finderY
    if ((x > viewMinX && y > viewMinY) && (x < viewMaxX && y < viewMaxY)) {
      if (this.props.isRepeatScan) {
        Vibration.vibrate();
        this.props.onRead(e)
      } else {
        if (!this.isShowCode) {
          this.isShowCode = true;
          Vibration.vibrate();
          this.props.onRead(e)
        }
      }
    }
  }

  androidBarCode = ({data}) => {    
    if(!this.state.canscan)return;    
    Vibration.vibrate();    
    this.props.onRead(data);
    this.setState({canscan:false});
  }

  reset = () => {
    this.setState({canscan:true});
  }
  
  _handleBarCodeRead = (e) => {
    switch (Platform.OS) {
      case 'ios':
    this.iosBarCode(e);
        break;
      case 'android':
        this.androidBarCode(e);
        break;
      default:
        break;
    }
  }
}

const styles = StyleSheet.create({
  topButtonsContainer: {
    position: 'absolute',
    height: 100,
    top: 0,
    left: 0,
    right: 0
  },
  bottomButtonsContainer: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0
  }
});

QRScanner.propTypes = {
  isRepeatScan: PropTypes.bool,
  onRead: PropTypes.func,
  maskColor: PropTypes.string,
  borderColor: PropTypes.string,
  cornerColor: PropTypes.string,
  borderWidth: PropTypes.number,
  cornerBorderWidth: PropTypes.number,
  cornerBorderLength: PropTypes.number,
  rectHeight: PropTypes.number,
  rectWidth: PropTypes.number,
  isCornerOffset: PropTypes.bool, //边角是否偏移
  cornerOffsetSize: PropTypes.number,
  bottomHeight: PropTypes.number,
  scanBarAnimateTime: PropTypes.number,
  scanBarColor: PropTypes.string,
  scanBarImage: PropTypes.any,
  scanBarHeight: PropTypes.number,
  scanBarMargin: PropTypes.number,
  hintText: PropTypes.string,
  hintTextStyle: PropTypes.object,
  hintTextPosition: PropTypes.number,
  renderTopView: PropTypes.func,
  renderBottomView: PropTypes.func,
  isShowScanBar: PropTypes.bool,
  topViewStyle: PropTypes.object,
  bottomViewStyle: PropTypes.object,
  flashMode: PropTypes.bool,
  finderX: PropTypes.number,
  finderY: PropTypes.number,
  zoom: PropTypes.number,
  translucent: PropTypes.bool
}