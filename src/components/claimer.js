import React, { Component } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Image
} from 'react-native';
import helper from 'assets/helper';

import RefItems from './refitems';
import Icon from './icon';
import Button from './button';
import LottieView from 'lottie-react-native';
import {View as AniView} from 'react-native-animatable';
export default class Temp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			current:0,
			left:0,
			points:0,
			canc:false,
			code:'',
			reward:false,
			gifts:[]
		}
	}
	init = (data) => {		
		let {p_left,points,claimable,gifts,applied} = data;		
		this.setState({			
			left:p_left,
			points,
			canc:claimable,			
			gifts,
			applied,
			current:claimable ? 1 : 0
		})
		if(claimable){
			this.start();
		}
	}
	getCode = () => {
		return this.state.code;
	}
	start = () => {
		this.setState({current:1})
		setTimeout(() => {
			this.animation?.play();		
		}, 1000);
	}
	remaining = () => {
			this.anicont?.fadeOut();
			setTimeout(() => {
				this.setState({current:2})				
				this.anicont?.bounceIn().then(() => {
					this.anicont?.tada();
				});
			}, 500);		
	}
	claim = () => {
		const {
			gifts,
			points
		} = this.state;
		this.refitems.show(gifts, points, (reward) => {			
			if(reward){
				this.setState({reward})
				this.props.onId(reward.id)
			}			
		});
	}
	render() {
		const {applied,cliamable,code,current} = this.state;
		return (			
			 <View style={s.st}>
				  {current != 0 ? <View style={s.mt}>				    
				    <AniView duration={500} ref={ref => this.anicont = ref}>
				        {this.renderC()}
			        </AniView>
				  </View> : null}
				  {applied ? null :
				  <View style={s.mt}>
				   <View style={s.at}>
				    <TextInput value={code} onChangeText={code => this.setState({code})} style={s.txt} placeholder="Enter Code" placeholderTextColor={helper.grey4} />
				   </View>
				   <Text style={s.fc}>Enter Friends Code</Text>
				  </View>}
				  <RefItems ref={ref => this.refitems = ref} />
			 </View>
		)
	}
	renderC = () => {		
		const {current,left,reward} = this.state;		
		if(current == 1){
			return (
				<LottieView		        
		         ref={ref => this.animation = ref}
		         loop={false}
		         onAnimationFinish={this.remaining}         
		         style={{width:100,height:100,alignSelf:'center'}}
		         source={require('assets/anims/gift.json')}
		        />
			)
		}else if(reward == false){
			return (
				<Button onPress={this.claim} text={"Claim Reward"} />
			)
		}else{
			return (
				<View style={{justifyContent:'center',alignItems:'center'}}>
				 <Image source={{uri:helper.site_url + reward.image}} style={s.img} />
				 <Button onPress={this.claim} text={"Change Reward"} />
				</View>				
			)
		}
	}
}

const s = StyleSheet.create({
	st:{
		height:100,
		width:'100%',
		flexDirection:'row',
		backgroundColor:'#1f1f1f',
		justifyContent:'center'
	},
	mt:{
		width:'50%',
		justifyContent:'center',
		alignItems:'center'
	},
	at:{
		width:160,
		alignItems:'center',
		borderBottomWidth:2,
		borderColor:helper.primaryColor
    },
	txt:{
		fontWeight:'bold',
		color:'white',
		fontSize:20,
		width:150,
		paddingBottom:5,	
		textAlign:'center'
	},
	img:{borderRadius:100,width:47,height:47,marginBottom:3,backgroundColor:helper.silver},
	fc:{fontSize:12,color:'#fff',textAlign:'center',marginTop:5},
	ds:{fontSize:14,color:helper.silver,fontWeight:'bold',textAlign:'center',marginTop:5}
})