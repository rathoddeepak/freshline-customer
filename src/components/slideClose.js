import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Animated,
	StyleSheet,
	PanResponder,
	ActivityIndicator,
	TouchableWithoutFeedback
} from 'react-native';
import Icon from './icon';
import lang from 'assets/lang';
import helper from 'assets/helper';
export default class SlideClose extends Component {
	constructor(props) {
		  super(props);
		  this.maxWidth = 0;
		  this.threshold = 0;
		  this.lastX = 0;
		  this.opacity = null;
		  this.leftSwipe = null;
		  this.panX = new Animated.Value(5);		  
		  this.panResponder = PanResponder.create({
		    onMoveShouldSetPanResponder: () => true,		    
		    onPanResponderMove:(e, gestureState) => {
		    	let val = gestureState.dx + this.lastX;
		    	if(val >=5 && val <= this.maxWidth)this.panX.setValue(val);
		    },
		    onPanResponderRelease: (e, gestureState) => {		    	
		    	this.lastX = this.panX._value > this.threshold ? this.maxWidth : 5;
		    	Animated.timing(this.panX, {
		    		toValue: this.lastX,		    		
		    		duration:360,
		    		useNativeDriver:false
		    	}).start();
		    	if(this.lastX != 5)this.props.onSubmit();
		    }
		  });
		  this.state = {
		  	isSet:0
		  }
	}
	handleLayout = ({nativeEvent}) => {
		const {x, y, width, height} = nativeEvent.layout;		
		this.maxWidth = width - (this.props.ballSize + 5);
		this.threshold = width / 2;		
		this.setState({isSet:1});
		this.opacity = this.panX.interpolate({
				inputRange:[0, this.maxWidth],
				outputRange:[1, 0],
				extrapolate:'clamp',
				useNativeDriver:false
		})
		this.leftSwipe = this.panX.interpolate({
				inputRange:[0, this.maxWidth],
				outputRange:[0, this.maxWidth/2],
				extrapolate:'clamp',
				useNativeDriver:false
		})
	}
	reset = () => {
		Animated.spring(this.panX, {
			toValue:5,
			useNativeDriver:false
		}).start();
	}
	render() {
		const {
			text,			
			width,
			fSize,
			height,
			bgColor,
			ballSize,
			busy
		} = this.props;
		if(this.state.isSet == 0){
			return (<View onLayout={this.handleLayout} style={{width,height}} />)
		}else{
			return (
				<Animated.View {...this.panResponder.panHandlers} pointerEvents={busy ? 'none' : undefined} style={[{width,height}, s.container]}><TouchableWithoutFeedback><View style={[{width,height}, s.container]}>
				 <Animated.View style={[s.ball, {width:ballSize,height:ballSize,
				 	 position:'absolute',			 	 
				 	 transform:[
				 	  {translateX:this.panX}
				 	 ]
				 }]}>
				  <Icon name={lang.cvrgt} color={helper.white} size={21} />
				 </Animated.View>
				 <Animated.Text style={[s.txt, {fontSize:fSize,opacity:this.opacity,
				 	transform:[
				 	 {translateX:this.leftSwipe}
				 	]
				 }]}>{text}</Animated.Text>

				 {busy ? <View style={[s.ball, {width:ballSize,height:ballSize,
				 	 position:'absolute',
				 	 backgroundColor:helper.blackTrans,
				 	 transform:[
				 	  {translateX:this.maxWidth}
				 	 ]
				 }]}>
				  <ActivityIndicator size='small' color={helper.primaryColor}/>
				 </View> : null}

				</View></TouchableWithoutFeedback></Animated.View>
			)
		}
		
	}
}
SlideClose.propTypes = {
	ballSize: PropTypes.number,
	width: PropTypes.string,
	height: PropTypes.number,
	bgColor: PropTypes.string,
	text: PropTypes.string,
	fSize:PropTypes.number,
}
SlideClose.defaultProps = {
	ballSize: 40,
	width: "100%",
	height: 50,
	text: "Slide To Close",
	fSize:16,
	bgColor:helper.grey4,
}
const s = StyleSheet.create({
	container: {	
		borderRadius:50,		
		justifyContent: 'center',
		backgroundColor:helper.grey2,
		overflow: 'hidden'
	},
	ball:{
		backgroundColor:helper.primaryColor,
		elevation:10,
		borderRadius:100,
		justifyContent:'center',
		alignItems:'center'
	},
	txt:{
		color:helper.silver,
		width:'100%',
		textAlign:'center'
	}
})