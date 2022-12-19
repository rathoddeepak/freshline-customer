import React, { Component } from 'react';
import {
	View,
	Text
} from 'react-native';
import LottieView from 'lottie-react-native';
import helper from 'assets/helper';
export default class Loading extends Component {
	render() {
		return (
			<View style={{width:'100%', height:300,justifyContent:'center',alignItems:'center'}}>			 
			  <LottieView		        
		        autoPlay
		        loop={false}
		        style={{width:200,height:200,alignSelf:'center'}}
		        source={require('assets/anims/empty.json')}
		      />
		      <Text numberOfLines={2} style={{color:helper.grey,fontSize:14,textAlign:'center', width:'90%'}}>No Data Found!</Text>			 
		      <Text numberOfLines={1} style={{color:helper.grey,fontSize:12,textAlign:'center', width:'90%',marginTop:5}}>Please Check Again Later</Text>			 
			</View>
		)
	}
}