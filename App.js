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
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'components/icon';
import AddressModal2 from 'components/addressModal2';
import lang from 'assets/lang';
import helper from 'assets/helper';
import Home from 'screens/home';
import Cart from 'screens/cart';
import Mess from 'screens/mess';
import Intro from 'screens/intro';
import Updates from 'screens/updates';
import MyPlate from 'screens/myplate';
import History from 'screens/history';
import Startup from 'screens/startup';
import Refunds from 'screens/refunds';
import Update from 'screens/Update';
import Invoice from 'screens/invoice';
import Scanner from 'screens/scanner';
import Explore from 'screens/explore';
import Photos from 'screens/photos';
import Reviews from 'screens/reviews';
import Tracking from 'screens/tracking';
import Referral from 'screens/referral';
import FoodView from 'screens/foodView';
import Resturant from 'screens/resturant';
import Addresses from 'screens/addresses';
import VendorView from 'screens/vendorView';
import ProductView from 'screens/productView';
import HotelVisits from 'screens/hotelVisits';
import CustomPlan from 'screens/customPlan';
import TableSearch from 'screens/tableSearch';
import MessOptions from 'screens/messOptions';
import MainResView from 'screens/mainResView';
import EditProfile from 'screens/editProfile';
import UserProfile from 'screens/userProfile';
import TableMaker from 'screens/tableMaker';
import OrderInHotel from 'screens/orderInHotel';
import ResturantView from 'screens/resturantView';
import FinalizeTable from 'screens/finalizeTable';
import RateService from 'screens/rateService';
import Complaints from 'screens/complaints';
import AddComplain from 'screens/addComplain';
import HotelTable from 'screens/hotelTable';
import LiveTracking from 'screens/liveTracking';
import SplashScreen from 'screens/splashScreen';
import Detector from 'screens/detector';
import Search from 'screens/search';
import ProductList from 'screens/productList';
import CategoryView from 'screens/categoryView';

import AddFeedback from 'screens/addFeedback';
import Feedbacks from 'screens/feedbacks';
import FeedbackView from 'screens/feedbackView';

import UserDB from 'libs/userdb';
import Address from 'libs/address';
import Temp from 'screens/temp';
import OneSignal from 'react-native-onesignal';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import InAppUpdate from 'libs/AutoUpdate/';
import AsyncStorage from '@react-native-community/async-storage';
import Parse from 'parse/react-native.js';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Discounts from 'screens/discounts';
import codePush from 'react-native-code-push';

// import Game from 'screens/game';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
}
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(  
  helper.parse_app_id,
  helper.parse_js_key
);
Parse.serverURL = helper.parse_server_url;
Parse.masterKey = helper.parse_master_key;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const theme = {
  dark: true,
  colors: {
    primary: helper.primaryColor,
    background: '#000',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};
/*export default class App extends Component {
  componentDidMount() {
    StatusBar.setBackgroundColor("#000")
    StatusBar.setBarStyle("light")
  }
  render() {
    return (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ gestureEnabled: false }}
            headerMode="none">
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
    )
  }
}*/
class HomeActivity extends Component {
  render() {
    return (
      <Tab.Navigator screenOptions={
          ({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              switch(route.name){
                case 'Home': iconName = lang.hm2;break;
                case 'Cart': iconName = 'cart'; break;
                case 'Orders': iconName = lang.bl; break;
                case 'Profile': iconName = 'wallet'; break;
              }
              return <Icon name={iconName} size={27} color={color} />;
            },
          })}
          tabBarOptions={{
            showLabel:false,
            keyboardHidesTabBar:true,
            activeBackgroundColor:helper.bgColor,
            inactiveBackgroundColor:helper.bgColor,
            activeTintColor: helper.primaryColor,
            inactiveTintColor: helper.grey,
            style:{borderTopWidth:0.6,borderTopColor:helper.secondaryColor}
          }}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Cart" component={Cart} />
          <Tab.Screen name="Orders" component={Updates} />        
          <Tab.Screen name="Profile" component={UserProfile} />
        </Tab.Navigator>
    )
  }
}
class App extends Component {  
  componentDidMount() {
    StatusBar.setBackgroundColor(helper.primaryColor);
    changeNavigationBarColor(helper.primaryColor, true);
    //StatusBar.setBarStyle("light")
  }
  UNSAFE_componentWillMount() {
    global.cl = 0;
  }
  render() {
    return (
      <NavigationContainer theme={theme}>
        <Stack.Navigator          
          headerMode="none"
          screenOptions={{
            gestureEnabled: false,
            cardOverlayEnabled: true,
            ...TransitionPresets.SlideFromRightIOS 
          }}
        >         
         {/*<Stack.Screen name="Game" component={Game} />*/}
         <Stack.Screen name="SplashScreen" component={SplashScreen} />
         <Stack.Screen name="Discounts" component={Discounts} />
         <Stack.Screen name="Feedbacks" component={Feedbacks} />
         <Stack.Screen name="FeedbackView" component={FeedbackView} />
         <Stack.Screen name="AddFeedback" component={AddFeedback} />         
         <Stack.Screen name="CategoryView" component={CategoryView} />
         <Stack.Screen name="ProductList" component={ProductList} />
         <Stack.Screen name="ProductView" component={ProductView} />
         <Stack.Screen name="Search" component={Search} />
         <Stack.Screen name="Mess" component={Mess} />
         <Stack.Screen name="MessOptions" component={MessOptions} />
         <Stack.Screen name="Update" component={Update} />
         <Stack.Screen name="Intro" component={Intro} />
         <Stack.Screen name="RateService" component={RateService} />
         <Stack.Screen name="Complaints" component={Complaints} />
         <Stack.Screen name="AddComplain" component={AddComplain} />         
         <Stack.Screen name="EditProfile" component={EditProfile} />                  
         <Stack.Screen name="HotelTable" component={HotelTable} />
         <Stack.Screen name="OrderInHotel" component={OrderInHotel} />         
         <Stack.Screen name="HotelVisits" component={HotelVisits} />         
         <Stack.Screen name="Refunds" component={Refunds} />
         <Stack.Screen name="TableSearch" component={TableSearch} />
         <Stack.Screen name="Photos" component={Photos} />
         <Stack.Screen name="Startup" component={Startup} />
         <Stack.Screen name="Reviews" component={Reviews} />
         <Stack.Screen name="HomeActivity" component={HomeActivity} />
         <Stack.Screen name="MainResView" component={MainResView} />
         <Stack.Screen name="History" component={History} />         
         <Stack.Screen name="Invoice" component={Invoice} />
         <Stack.Screen name="FinalizeTable" component={FinalizeTable} />
         <Stack.Screen name="TableMaker" component={TableMaker} />         
         <Stack.Screen name="Tracking" component={Tracking} />              
         <Stack.Screen name="CustomPlan" component={CustomPlan} />         
         <Stack.Screen name="Scanner" component={Scanner} />         
         <Stack.Screen name="Explore" component={Explore} />
         <Stack.Screen name="ResturantView" component={ResturantView} />         
         <Stack.Screen name="FoodView" component={FoodView} />
         <Stack.Screen name="VendorView" component={VendorView} />
         <Stack.Screen name="Addresses" component={Addresses} />
         <Stack.Screen name="LiveTracking" component={LiveTracking} />
         <Stack.Screen name="Detector" component={Detector} />
         <Stack.Screen name="Orders" component={Updates} /> 
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default codePush(codePushOptions)(App)
