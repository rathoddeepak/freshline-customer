import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Modal,
	Easing,
	Animated,
	TextInput,
	StyleSheet,	
	ToastAndroid,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import Button from './button';
import HeuButton from './HeuButton/';
import Icon from './icon';
import Loading from './loading';
import lang from 'assets/lang';
import helper from 'assets/helper';
import request from 'libs/request';
const AniIcon = Animated.createAnimatedComponent(Icon);
export default class ReviewAdder extends Component {
	constructor(props) {
		super(props)
		this.state = {
			v:false,
			ratings:[1, 2, 3, 4, 5],
			text:'',
			cr:0,
			busy:false
		}
		this.rates = [];
	}
	rateTo(cr){
		let av = this.state.ratings;			
		av.forEach((s) => this.rates[s].toggle(s <= cr));
		this.setState({cr});
	}
	sbmt = async () => {		
		if(this.state.cr == 0 || this.state.cr == undefined){
			ToastAndroid.show(lang.z[cl].plr, ToastAndroid.SHORT);
			return;
		}
		this.setState({busy:true});
		var res = await request.perform('reviews', {
			req:'add_review',
			text:this.state.text == undefined ? '' : this.state.text,
			issuer:this.props.issuer,
			issuer_id:this.props.issuer_id,
			rating:this.state.cr,
			user_id
		});		
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){
			ToastAndroid.show(lang.z[cl].thf, ToastAndroid.SHORT);
			this.setState({v:false}, () => {						
				this.props.onAdd(res.data);
			})
		} else {
			ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
		}
	}
	close = () => {
		if(this.state.busy){
			ToastAndroid.show(lang.z[cl].plr, ToastAndroid.SHORT);
		}else{
			this.setState({v:false});
		}
	}
	show = ({text, cr}) => {
		this.setState({cr,text,v:true}, () => {
			if(cr > 0)this.rateTo(cr);
		});
	}
	render(){
		const {
			v,
			cr,
			text,
			busy,
			ratings
		} = this.state;
		return (
			<Modal visible={v} transparent onRequestClose={this.close} animationType="fade"><TouchableWithoutFeedback onPress={this.close}><View style={helper.model}>
			 <TouchableOpacity activeOpacity={1} style={s.hldr}>
			 <Text style={s.tt}>{lang.z[cl].ar}</Text>
			 <View style={s.gq}>			  
			  {ratings.map((s) =>
			  	 <RateStar
			  	   key={s}
			  	   ref={ref => this.rates[s] = ref}
			  	   onPress={() => this.rateTo(s)}
			  	 />
			  )}
			 </View>
			 <TextInput value={text} maxLength={500} onChangeText={text => this.setState({text})} underlineColorAndroid={helper.primaryColor} multiline style={s.inpt} placeholder={lang.z[cl].dyes} placeholderTextColor={helper.blight} />
			 <Button onPress={this.sbmt} text={lang.z[cl].smt} size={16} style={{alignSelf:'center',marginBottom:20}} />
			 {busy ? <View style={s.ovl}>
			  <Loading />
			 </View> : null}
			</TouchableOpacity></View></TouchableWithoutFeedback></Modal>
		)
	}
}
class RateStar extends Component {
	constructor(props){
		super(props)
		this.state = {
			scale:new Animated.Value(0)
		}
	}
	toggle = (show) => {
		if(this.state.show === show)return;
		Animated.timing(this.state.scale, {
			toValue:show ? 1 : 0,
			useNativeDriver:true,
			easing:Easing.elastic(1)
		}).start(() => this.setState({show}))
	}
	render() {
		const scale = this.state.scale;
		return (
			<HeuButton onPress={this.props.onPress} style={{height:50,width:50,justifyContent:'center',alignItems:'center'}}>
			   <View style={{width:'100%',position:'absolute',height:'100%',justifyContent:'center',alignItems:'center'}}>
			    <AniIcon name={lang.str} size={35} style={{
			    	transform:[{scale}]
			    }} color={helper.primaryColor} />
			   </View>
			   <Icon name={lang.st2} size={35} color={helper.primaryColor} />
			</HeuButton>
		)		
	}
}
const s = StyleSheet.create({
	hldr:{
		width:'95%',
		backgroundColor:helper.grey2,
		borderRadius:8,
		elevation:10,		
	},
	tt:{
		textAlign:'center',
		fontWeight:'bold',
		fontSize:20,
		color:helper.primaryColor,
		marginVertical:10
	},
	ovl:{
		borderRadius:8,
		position:'absolute',
		...helper.model
	},
	gq:{
		flexDirection:'row',
		justifyContent:'space-around',
		width:'95%',
		alignSelf:'center'
	},
	inpt:{
		fontSize:15,
		fontWeight:'bold',
		color:helper.silver,
		padding:4,
		marginBottom:7,
		width:'90%',
		paddingVertical:10,
		alignSelf:'center'
	}
})