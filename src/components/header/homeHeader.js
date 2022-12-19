import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Image,
	StyleSheet,
	Pressable,
	TouchableOpacity
} from 'react-native';
import Icon from '../icon';
import helper from 'assets/helper';
import store from 'assets/store';
import lang from 'assets/lang';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import Address from 'libs/address';
import Parse from 'parse/react-native';
export default class HomeHeader extends Component {	
	constructor(props){
		super(props)
		this.state = {
			location:''
		}
	}
	componentDidMount(){
		let data = Address.getCurrentAddress();
		if(data != null){
			if(data.text == undefined){
				if(data.lat != undefined){
					this.setState({location:'Loading Data...'})
					this.getLocationText(data, location => {
						this.setState({location})
					})
				}
			}else{
				this.setState({location:data.text})
			}
		}
	}
	fetchAddress = () => {
		let data = Address.getCurrentAddress();
		if(data != null){
			if(data.text == undefined){
				if(data.lat != undefined){
					this.setState({location:'Loading Data...'})
					this.getLocationText(data, location => {
						this.setState({location})
					})
				}
			}else{
				this.setState({location:data.text})
			}
		}
		return;

		this.setState({location:'Fetching...'});
		Geolocation.getCurrentPosition(
	        ({coords}) => {
	        	let data = {lat:coords.latitude, lng:coords.longitude}
        	    this.setState({location:'Loading Data...'}, () => {
	        	  	Address.setCurrentAddress(data);
	        	  	this.props.locationChange(data);
        	    });
        	    this.getLocationText(data, location => {
        	    	if(location == false){
        	    		this.setState({location:'Home'});
        	    	}else{
        	    		this.setState({location}, () => {
				    		let {lat, lng} = Address.getCurrentAddress();
					    	Address.setCurrentAddress({
					    		lat,
					    		lng,
					    		text:location
					    	});
				    	});
        	    	}
        	    })
	        },
	        (error) => {
	            this.setState({busy:false}, () => {
	            	this.pick(18.4088, 76.5604)
	            });
	        },
	        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
	    );
	}
	getLocationText = (data, callback) => {
		Geocoder.geocodePosition(data).then(res => {
			    if(res.length > 0){
			    	let location = res[0].formattedAddress;
			    	callback(location);
			    }else{
			    	alert('asd')
			    	callback(false)
			    }
		  }).catch(err => {
			callback(false)
		  })
	}
	render() {
		const {
			location,			
		} = this.state;
		return (
			<View style={s.header}>
			 <TouchableOpacity onPress={this.props.addressPress} style={s.iconCont}>
			  <Icon name="pin" color={helper.bgColor} size={24} />
			 </TouchableOpacity>
			 <View style={s.locationCnt}>
			  <Text onPress={this.props.addressPress} numberOfLines={1} style={s.locationTxt}>{location}</Text>
			  <View style={s.icn2}>
			   <Icon name={lang.cvd} color={helper.bgColor} size={18} />
			  </View>
			 </View>
			 <TouchableOpacity onPress={() => this.props.navUser()} style={[s.iconCont, {position:'absolute',right:0}]}>
			  <Icon name="user" color={helper.white} size={24} />
			 </TouchableOpacity>
			</View>
		)
	}
}

function getColor(ty) {
	if(ty == 0){
		return helper.grey;
	}else if(ty == 1){
		return helper.green;
	}else{
		return helper.red;
	}
}

const s = StyleSheet.create({
	iconCont:{
		height:55,
		width:40,
		justifyContent:'center',
		alignItems:'center'
	},
	icn2:{
		justifyContent:'center',
		alignItems:'center',
		width:20,
		height:55
	},
	header:{
		height:55,
		width:'100%',
		backgroundColor:helper.primaryColor,
		borderColor:helper.borderColor,
		flexDirection:'row'
	},
	locationTxt:{
		fontSize:18,
		color:helper.bgColor
	},
	locationCnt:{
		height:55,
		alignItems:'center',
		paddingLeft:5,
		width:'60%',
		flexDirection:'row'
	}
})