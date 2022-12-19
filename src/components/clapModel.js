import React, { Component } from 'react';
import {
	Modal,
	StyleSheet,
	View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
export default class ClapModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clapv:false
		}
	}
	clap = () => {
		this.setState({clapv: true});
		setTimeout(() => {
			this.anim.zoomOut().then(() => {
				this.setState({clapv: false})
			})
		}, 1500)
	}
	render() {
		return (
			<Modal transparent visible={this.state.clapv} animationType="fade">
			 <View style={s.main}>
				 <Animatable.View animation="zoomIn" ref={ref => this.anim = ref} style={{width:300,height:300,justifyContent:'center'}}>
				    <LottieView
					    autoPlay
						loop
						style={{width:300,height:300,transform:[{scale:1.1}],alignSelf:'center'}}
						source={require('assets/anims/clap.json')}
					/>
				 </Animatable.View>
			 </View>
			</Modal>
		)
	}
}

const s = StyleSheet.create({
	main:{width: '100%',height:'100%',backgroundColor:'#000000b8',justifyContent:'center',alignItems:'center'}
})