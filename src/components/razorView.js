import React, {Component} from 'react';
import {
	View,
	Image,
	StyleSheet
} from 'react-native';
import {View as AniView} from 'react-native-animatable';
import Button from 'components/button';
import helper from 'assets/helper';
import lang from 'assets/lang';
const phonephe = 'https://www.searchpng.com/wp-content/uploads/2018/11/phone-pe.png'
const paytm = "https://cdn.icon-icons.com/icons2/730/PNG/512/paytm_icon-icons.com_62778.png";
const googlePay = 'https://www.pinclipart.com/picdir/big/570-5704253_google-pay-logo-icon-png-image-free-download.png';
const bhim = 'https://www.pngitem.com/pimgs/m/12-123369_bhim-upi-logo-png-transparent-png.png';
const mastercard = 'https://care.org/wp-content/uploads/2020/09/Mastercard-Logo-2.jpg';
const amazon = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTXNrf-AVvzcU8s1uwebLbjJp66iuAY8SfWqA&usqp=CAU'
export default class RazorView extends Component {
	render() {		
		const {
			cost,
			onPress
		} = this.props;
		const pay = lang.z[cl].py+' '+lang.rp+cost;
		return (
			<AniView animation="fadeIn" style={{height:200,width:'100%'}}>
			 <View style={[obj, {
			 	top:'45%',
			 	left:'5%'
			 }]}><Image
			  resizeMode='cover'
			  source={{uri:phonephe}}
			  style={helper.max} /></View>

			  <View style={[obj, {
			 	top:'15%',
			 	left:'25%'
			  }]}><Image
			  resizeMode='cover'
			  source={{uri:paytm}}
			  style={helper.max} /></View>

			  <View style={[obj, {
			 	top:'60%',
			 	left:'30%'
			  }]}><Image
			  resizeMode='cover'
			  source={{uri:googlePay}}
			  style={helper.max} /></View>

			  <View style={[obj, {
			 	top:'20%',
			 	left:'50%'
			  }]}><Image
			  resizeMode='center'
			  source={{uri:bhim}}
			  style={helper.max} /></View>

			  <View style={[obj, {
			 	top:'50%',
			 	left:'60%'
			  }]}><Image
			  resizeMode='cover'
			  source={{uri:mastercard}}
			  style={helper.max} /></View>

			  <View style={[obj, {
			 	top:'40%',
			 	left:'80%'
			  }]}><Image
			  resizeMode='cover'
			  source={{uri:amazon}}
			  style={helper.max} /></View>             

			  <View style={{backgroundColor:'#1515156b',justifyContent:'center',alignItems:'center',width:"100%",position:'absolute',height:"100%"}}>
			   <Button
			    text={pay}			    
			    vr={7}
			    hr={15}
			    onPress={onPress}
			    br={20}
			    size={18}			    
			   />
			  </View>

			</AniView>
		)
	}
}
const obj = {
	width:45,
	height:45,
	backgroundColor:'#fff',
	borderRadius:90,	
	position:'absolute',
	overflow:'hidden'
}