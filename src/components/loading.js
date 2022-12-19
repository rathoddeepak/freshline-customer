import React, { Component } from 'react';
import {
	View
} from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
export default class Loading extends Component {
	render() {
		const {
			container,
			animation,
			height,
			backgroundColor
		} = this.props;
		return (
			<View style={{width:'100%', height:height,justifyContent:'center',alignItems:'center'}}>
			 <View style={{width:container, height:container,justifyContent:'center',alignItems:'center',borderRadius:7,backgroundColor,elevation:2}}>
			  <LottieView		        
		        autoPlay
		        loop
		        style={{width:animation,height:animation,alignSelf:'center'}}
		        source={require('assets/anims/loader.json')}
		      />
			 </View>
			</View>
		)
	}
}

Loading.propTypes = {
	container:PropTypes.any,
	animation:PropTypes.number,
	height:PropTypes.any,
	backgroundColor:PropTypes.string
}

Loading.defaultProps = {
	container:65,
	animation:150,
	backgroundColor:'#fff',
	height:300
}