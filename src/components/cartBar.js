import React, { Component } from 'react';
import {
	View,
	Text,	
	StyleSheet,
	TouchableOpacity,
	ToastAndroid,
} from 'react-native';
import {
	Image,
	Icon
	//Button,
} from 'components';
import Parse from 'parse/react-native';
import lang from 'assets/lang';
import Cart from 'libs/cart';
import {View as AniView} from 'react-native-animatable';
import helper from 'assets/helper';
export default class CartBar extends Component {
	constructor(props){
		super(props)
		this.state = {

		}
	}
	componentWillUnmount(){
		Cart.removeCartListener();
	}
	componentDidMount(){
		Cart.addCartListener(cart => {
			this.setState({cart})
		})
	}
	dispatch = (cart) => {
		this.setState({cart})
	}
	render(){
		const cart = this.state.cart;
		let showCart = cart != undefined && (cart.totalQty > 0 && cart.totalAmt != undefined) ? true : false;
		return (		
			<>
			{showCart ? <TouchableOpacity activeOpacity={0.8} onPress={this.toCart}><AniView animation="slideInUp" duration={600} style={[s.ftr, s.ftr2]}>
			   <View style={{flexDirection:'row',alignItems:'center'}}>
			       <View style={{width:30,height:40,marginRight:10,justifyContent:'center',alignItems:'center'}}>
					   <Icon name="cart" color={helper.primaryColor} size={23} />
				   </View>
				   <Text style={{fontSize:15,color:helper.primaryColor,width:200}}>{cart.totalQty} Items•<Text style={{fontWeight:'bold'}}>{lang.rp}{cart.totalAmt}</Text></Text>
			   </View>
			   <Text style={{fontSize:15,color:helper.primaryColor,width:70}}>View Cart</Text>
			 </AniView></TouchableOpacity> : null}

			 <View />
			</>
		)
	}
}

const s = {
	ftr2:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		paddingRight:5
	},
	ftr:{
		width:'100%',
		height:40,
		justifyContent:'center',
		paddingLeft:5,
		borderTopWidth:1,
		borderColor:helper.borderColor,
		backgroundColor:helper.bgColor
	},
	ftrTxt:{
		fontSize:13,
		color:helper.primaryColor
	}
}
