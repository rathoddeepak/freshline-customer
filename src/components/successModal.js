import React, { Component } from 'react';
import {
	Modal,
	View,
	Text
} from 'react-native';
import helper from 'assets/helper';
import LottieView from 'lottie-react-native';
const anim = require('assets/anims/success.json');
export default class SuccessModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v:false
		}
	}
	show = () => {
		this.setState({v:true})
	}
	close = (forceClose = false) => {
		if(forceClose){
			this.setState({v:false})
			return;
		}
		if(this.props?.cancel == false)return;		
		this.setState({v:false})
	}
	render() {
		const v = this.state.v;
		return (
			<Modal visible={v} transparent animationType="fade" onRequestClose={this.close}><View style={helper.model}>
				<LottieView				    
				    loop={false}				   
				    autoPlay
					style={{width:250,height:250}}
					source={anim}
				/>
			</View></Modal>
		)
	}
}