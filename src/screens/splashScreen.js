import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import AddressModal2 from 'components/addressModal2';
import UserDB from 'libs/userdb';
import Address from 'libs/address';
import Temp from 'screens/temp';
import OneSignal from 'react-native-onesignal';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import InAppUpdate from 'libs/AutoUpdate/';
import AsyncStorage from '@react-native-community/async-storage';
import Parse from 'parse/react-native.js';
import lang from 'assets/lang';
import helper from 'assets/helper';
export default class SplashScreen extends Component {
  constructor(props) {
    super(props)
    this.nv = false;    
    this.mount = true;
    OneSignal.setAppId(helper.onesignal); 
    InAppUpdate.checkUpdate();
    //OneSignal.setNotificationWillShowInForegroundHandler(event => {       
      //this.nv =  event.getNotification()
      //setTimeout(() => event.complete(this.nv), 0);
    //});
    OneSignal.setNotificationOpenedHandler(({notification}) => {
          if(this.mount){
            this.nv = notification.additionalData;
          }else{
            this.handlePress(notification.additionalData);
          }          
    });
  }
  UNSAFE_componentWillMount() {  
    UserDB.init(() => {
      let user = UserDB.getUser();
      if(user == undefined || user == null){
        this.reset('Startup');
        return;
      }
      //global.cl = user.cl == undefined ? 0 : user.cl;
      global.user_id = user.user_id;
      global.se = user.se;      
      Address.getAddress((add) => {
        // console.log(add)
        if(add){          
          let {lat, lng, id} = add;
          global.user_lat = lat;
          global.user_long = lng;
          global.address_id = id;
          if(this.nv){
            this.handlePress(this.nv)
          }else{          
            //this.reset('LiveTracking');
            this.reset('Detector');            
          }          
        }else{          
          this.reset('Detector');
          //Now onwards calculate address in home activity   
          //this.getAddress();
        }        
      });      
    });    
  }
  openUrl = async (type_data) => {
    try {       
      await InAppBrowser.open(type_data, {
        toolbarColor:helper.blk,
        secondaryToolbarColor:helper.primaryColor
      })
    } catch (error) {
      
    }
  }
  reset = (page) => {
    this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: page }            
          ],
        })
      );
  }
  reset2 = (page,params) => {
    this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'HomeActivity' },
            { name: page, params }            
          ],
        })
      );
  }
  getAddress = () => {
    this.address.show(data => {     
     this.reset('HomeActivity');
    });
  }
  handlePress = ({type, type_data}) => {    
    switch(type){
      case 0:
        this.reset('HomeActivity');
        this.openUrl(type_data);
      break;
      case 1:
        this.reset2('VendorView', {item:{id:type_data}});
      break;
      case 3:
      case 5:
      case 6:
        this.reset2('Orders', {});
      break;
      case 7:              
        this.reset2('HomeActivity', {order_id:type_data});
      break;
      case 10:
      case 11:
        this.reset2('Refunds', {order_id:type_data});
      break;
      case 13:
        this.reset2('HotelVisits', {});
      break;
      case 14:
        this.reset2('History');
      break;
      default:
        this.reset('HomeActivity');
    }
  }
  componentWillUnmount(){
    this.mount = false;
  }
  render() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center',width: '100%',height: '100%',backgroundColor:helper.bgColor}}>       
       <AddressModal2 ref={ref => this.address = ref} />
      </View>
    )
  }
}