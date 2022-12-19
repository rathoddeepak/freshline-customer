import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Modal,	
	StyleSheet,
	Animated,
	ToastAndroid
} from 'react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Button from './button';
import Voice from 'react-native-voice';
import LottieView from 'lottie-react-native';
const anim = 'assets/anims/recording.json';
export default class VoiceText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v:false,
			values:[]
		}
		this.amplifier = new Animated.Value(-2);
		Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
	    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
	    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
	    Voice.onSpeechError = this.onSpeechError.bind(this);
	    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
	    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
	}
	onSpeechStartHandler = (data) => {
		this.amplifier.setValue(-2);
	}
	onSpeechEndHandler = (data) => {		
		setTimeout(() => {
			this.hc();
		}, 1000)		
	}
	onSpeechResultsHandler = ({value}) => {		
		this.setState({values:value})
	}
	onSpeechPartialResults = ({value}) => {		
		this.setState({values:value})
	}
	onSpeechVolumeChanged = ({value}) => {
		if(value != this.amplifier._value) {
			Animated.timing(this.amplifier, {
				toValue: value,
				useNativeDriver:false
			}).start();
		}		
	}
	onSpeechError = (data) => {
		this.hc();
	}

	start = (cb) => {
		try {
			this.setState({v:true,values:[]}, () => {
		    	Voice.start('en-IN');
		    });
		    this.callback = cb;
		}catch(err){
			alert(err)
		}
	}
	
	hc = () => {
		if(this.state.values.length > 0){
			this.callback(this.state.values[0])
		}
		this.callback = null;
		this.setState({v:false,values:[]});
		Voice.removeAllListeners();
		this.amplifier.setValue(-2);		
	}
	componentWillUnmount = () => {
		Voice.destroy();
	}
	render() {
		const {
			v,
			values				
		} = this.state;
		const data = this.amplifier.interpolate({
			inputRange:[-2, 10],
			outputRange:[0, 1],
		});
		const text = values.length == 0 ? 'Speak To Search' : values[0];
		return (
			<Modal visible={this.state.v} transparent onRequestClose={this.hc} animationType="fade">
			 <View style={helper.model}>
			    <View style={s.cont}>
			      <LottieView		        
			        autoPlay={false}
			        progress={data}
			        loop={false}
			        style={{width:200,height:200,alignSelf:'center'}}
			        source={require(anim)}
			       />
			       <Text numberOfLines={2} style={s.txt}>{text}</Text>
			    </View>
			 </View>
			</Modal>
		)
	}
}
const s = StyleSheet.create({	
	txt:{width:'90%',textAlign:'center',fontSize:14,color:helper.silver,fontWeight:'bold',marginVertical:10},
	cont:{width:'90%',paddingTop:17,paddingBottom:25,elevation:20,borderRadius:10,backgroundColor:helper.bgColor,justifyContent:'center',alignItems:'center'}
})