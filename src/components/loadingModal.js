import React, { Component } from 'react';
import {
	View,
	Modal
} from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
export default class LoadingModal extends Component {	
	render() {
		const {
			container,
			animation,
			visible
		} = this.props;
		return (
			<Modal transparent animationType="fade" visible={visible}>
			<View style={{width:'100%',backgroundColor:'#00000075',height:'100%',justifyContent:'center',alignItems:'center'}}>
				 
				 <View style={{width:container, height:container,justifyContent:'center',alignItems:'center',borderRadius:7,backgroundColor:'#00000075'}}>
				  <LottieView		        
			        autoPlay
			        loop
			        style={{width:animation,height:animation,alignSelf:'center'}}
			        source={require('assets/anims/loader.json')}
			      />
				 </View>

				</View>
			</Modal>
		)
	}
}

LoadingModal.propTypes = {
	container:PropTypes.number,
	animation:PropTypes.number
}

LoadingModal.defaultProps = {
	container:65,
	animation:150
}