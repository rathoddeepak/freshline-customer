import React, { Component } from 'react';
import {
	View,
	Text
} from 'react-native';
import LottieView from 'lottie-react-native';
import helper from 'assets/helper';
export default class Err extends Component {
	render() {
		return (
			<View style={{width:'100%', height:300,justifyContent:'center',alignItems:'center'}}>			 
			  <LottieView		        
		        autoPlay
		        loop
		        style={{width:200,height:200,alignSelf:'center'}}
		        source={require('assets/anims/error.json')}
		      />
		      <Text style={{color:helper.grey,fontSize:14,textAlign:'center', width:'90%'}}>There Was An Error While Processing</Text>			 
		      <Text onPress={this.props.onPress} style={{fontFamily:'sans-serif-medium',color:helper.white,fontSize:14,textAlign:'center',paddingHorizontal:10,paddingVertical:4,backgroundColor:helper.primaryColor,borderRadius:6,marginVertical:5}}>Retry</Text>
			</View>
		)
	}
}