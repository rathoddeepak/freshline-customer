import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	Modal
} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Icon from './icon';
import SButton from './sButton';
import Button from './button';
const {
	Value,
	timing,
	interpolate
} = Animated;
const duration = 600;
const p = '../assets/images/';
const veg = p+'veg.png';
const nonveg = p+'nonveg.png';
const both = p+'both.png';
export default class TypePicker extends Component {
	constructor(props){
		super(props);
		this.state = {
			currentType:-1,

			rImg1:new Value(0),
			rImg2:new Value(0),
			rImg3:new Value(0),

			oImg1:new Value(0),
			oImg2:new Value(0),
			oImg3:new Value(0),

			modalVisible:false
		}
	}
	componentDidMount(){				
		this.setValue(this.props?.initial ? this.props.initial : 3)
	}
	setValue = (ft = 3) => {
		if(ft == 3){
			this.setBoth()
			this.bth.act(true);
		}else if(ft == 2){
			this.setNonVeg()
			this.nnvg.act(true);
		}else{
			this.setVeg()
			this.vg.act(true);
		}		
	}	
	setVeg = () => {
		if(this.state.currentType != 1)this.normalizeCurrent();
		timing(this.state.rImg1, {
			toValue:1,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
		timing(this.state.oImg1, {
			toValue:1,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
		this.setState({currentType:1}, () => {
			this.props.onSelect(1);
		});
	}

	setNonVeg = () => {
		if(this.state.currentType != 2)this.normalizeCurrent();		
		timing(this.state.rImg2, {
			toValue:1,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
		timing(this.state.oImg2, {
			toValue:1,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
		this.setState({currentType:2}, () => {
			this.props.onSelect(2);
		});
	}

	setBoth = () => {
	    if(this.state.currentType != 3)this.normalizeCurrent();
		timing(this.state.rImg3, {
			toValue:1,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
		timing(this.state.oImg3, {
			toValue:1,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
		this.setState({currentType:3}, () => {
			this.props.onSelect(0);
		});
	}
	normalizeCurrent = () => {
		let currentType = this.state.currentType;
		if(currentType == -1)return;
		let r = null;
		let o = null;
		switch (currentType){
			case 1:
			r = this.state.rImg1;
			o = this.state.oImg1;
			break;
			case 2:
			r = this.state.rImg2;
			o = this.state.oImg2;
			break;
			case 3:
			r = this.state.rImg3;
			o = this.state.oImg3;
			break;
		}
		timing(r, {
			toValue:0,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
		timing(o, {
			toValue:0,
			duration:300,
			easing:Easing.inOut(Easing.ease)
		}).start();
	}
	handlePress = (state) => {
		if(state == 1){
			this.setVeg();
			this.nnvg.act(false);
			this.bth.act(false);
		}else if(state == 2){
			this.setNonVeg();
			this.vg.act(false);
			this.bth.act(false);
		}else if(state == 3){
			this.setBoth();
			this.nnvg.act(false);
			this.vg.act(false);
		}
	}	
	render() {
		const {
			rImg1,
			rImg2,
			rImg3,

			oImg1,
			oImg2,
			oImg3,

		} = this.state;
		const rI1 = interpolate(rImg1, {
			inputRange:[0, 1],
			outputRange:['-45deg', '0deg']
		});
		const rI2 = interpolate(rImg2, {
			inputRange:[0, 1],
			outputRange:['-45deg', '0deg']
		});
		const rI3 = interpolate(rImg3, {
			inputRange:[0, 1],
			outputRange:['-45deg', '0deg']
		});

		return (
			<View style={s.cnt}>
						 <View style={s.plateO}>
							 <View style={s.plateI}>
							  <Animated.Image source={require(veg)} style={[s.pimg, {
							  	opacity:oImg1,
							  	transform:[
							  	 {rotate:rI1}
							  	]
							  }]} />
							  <Animated.Image source={require(nonveg)} style={[s.pimg, {
							  	opacity:oImg2,
							  	transform:[
							  	 {rotate:rI2}
							  	]
							  }]} />
							  <Animated.Image source={require(both)} style={[s.pimg, {
							  	opacity:oImg3,
							  	transform:[
							  	 {rotate:rI3}
							  	]
							  }]} />
							 </View>
						 </View>
						 <View style={{flexDirection:'row'}}>
						     <SButton toggle={false} ref={ref => this.bth = ref } text={lang.z[cl].bth.toUpperCase()} style={{margin:10}} onPress={() => this.handlePress(3)} />
							 <SButton toggle={false} ref={ref => this.vg = ref } text={lang.z[cl].vg.toUpperCase()} style={{margin:10}} onPress={() => this.handlePress(1)} />
							 <SButton toggle={false} ref={ref => this.nnvg = ref } text={lang.z[cl].nnvg.toUpperCase()} style={{margin:10}} onPress={() => this.handlePress(2)} />
						 </View>
					 </View>			 		
		)
	}
}

const extra = {
	backgroundColor:'#FFED97',
	borderRadius:9,
	elevation:7
}
const s = StyleSheet.create({	
	cnt:{padding:5,alignItems:'center',borderRadius:10},
	plateO:{
		height:150,
		width:150,		
		backgroundColor:helper.silver,
		elevation:5,
		borderRadius:220,
		alignItems:'center',
		justifyContent:'center'		
	},
	plateI:{
		height:120,
		width:120,		
		justifyContent:'center',
		alignItems:'center',
		borderRadius:220,
		backgroundColor:helper.brown			
	},
	pimg:{
		height:110,
		width:110,				
		position:'absolute',
		top:10
	}
});