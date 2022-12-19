import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ToastAndroid,
  PermissionsAndroid
} from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import AddressModal2 from 'components/addressModal2';
import Address from 'libs/address';
import lang from 'assets/lang';
import helper from 'assets/helper';
import Geolocation from 'react-native-geolocation-service';
import LottieView from 'lottie-react-native';
const anim = 'assets/anims/location.json'
export default class Detector extends Component {
	componentDidMount(){
		this.fetchAddress();
	}
	fetchAddress = async () => {		
		const g = await PermissionsAndroid.requestMultiple(	      
	      [
	       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
	       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
	      ],
	      {
	        title: "Location Permission",
	        message:"We Need Permission To Detect Your Location",
	        buttonNeutral: "Ask Me Later",
	        buttonNegative: "Cancel",
	        buttonPositive: "OK"
	      }
	    );	    
	    if (g['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED || g['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED) {
			Geolocation.getCurrentPosition(
		        ({coords}) => {
		        	let data = {lat:coords.latitude, lng:coords.longitude}
	        	    this.setState({location:'Loading Data...'}, () => {
		        	  	Address.setCurrentAddress(data);
		        	  	this.reset('HomeActivity');
	        	    });
		        },
		        (error) => {
		        	ToastAndroid.show('Unable to get location!', ToastAndroid.SHORT);
		            this.getAddress();
		        },
		        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
		    );
		}else{
			ToastAndroid.show('Location Permission Denied!', ToastAndroid.SHORT);
			this.getAddress();
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
	getAddress = () => {
	    this.address.show(data => {     
	     this.reset('HomeActivity');
	    });
	}
	render(){
		return (
			<View style={s.main}>
			    <LottieView		        
			        autoPlay={true}
			        loop={true}
			        style={{width:350,height:350,alignSelf:'center'}}
			        source={require(anim)}
			    />
			    <Text style={{fontSize:25,marginTop:10,color:helper.white,width:'100%',textAlign:'center'}}>Locating...</Text>
			    <AddressModal2 ref={ref => this.address = ref} />
			</View>
		)
	}
}


const s = {
	main:{
		justifyContent:'center',
		alignItems:'center',
		width:'100%',
		height:'100%',
		backgroundColor:helper.primaryColor
	}
}