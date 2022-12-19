import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet
} from 'react-native';
import helper from 'assets/helper';
import MyCart from 'libs/mycart';
import lang from 'assets/lang';
export default class Discounter extends Component {
	constructor (props) {
		super(props)
		this.state = {			
			addedAmount:0,
			data : {
				type:helper.CAT_DISCOUNT,
				ids:[11],
				percent:0,
				amount:50,
				promo_code:'CLFOFF',
				min_order:450,
				upto:600
			}
		}
	}	
	init = (foodList) => {
		const {ids, min_order, type, promo_code} = this.state.data;
		let addedAmount = 0;		
		foodList.forEach(item => {
			let shouldAdd = false;
			if(type == helper.CAT_DISCOUNT){
				if(ids.indexOf(item.cat) != -1){
					shouldAdd = true;
				}
			}else if(type == helper.GLOBAL_DISCOUNT || type == helper.CLF_DISCOUNT){
				shouldAdd = true;
			}
			if(shouldAdd){
				if(item.added != undefined && item.added?.length > 0){
					addedAmount += item.total;
				}else{
					addedAmount += (item.price * item.cartCount);
				}
			}
		});
		this.formatText(min_order, addedAmount, promo_code);
	}	
	onAdd = (item) => {
		const {ids, min_order, type, promo_code} = this.state.data;
		let addedAmount = this.state.addedAmount;
		if(type == helper.CAT_DISCOUNT){
			if(ids.indexOf(item.cat) != -1){
				if(item.added != undefined && item.added?.length > 0){
					//addedAmount += item.total;
				}else{
					addedAmount += item.price;
				}
			}
		}else if(type == helper.GLOBAL_DISCOUNT || type == helper.CLF_DISCOUNT){
			if(item.added != undefined && item.added?.length > 0){
				//addedAmount += item.total;
			}else{
				addedAmount += item.price;
			}
		}
		this.formatText(min_order, addedAmount, promo_code);
	}
	onRemove = (item) => {
		const {ids, min_order, type, promo_code} = this.state.data;
		let addedAmount = this.state.addedAmount;			
		if(type == helper.CAT_DISCOUNT){
			if(ids.indexOf(item.cat) != -1){
				if(item.added != undefined && item.added?.length > 0){
					//addedAmount -= item.total;
				}else{
					addedAmount -= item.price;
				}
			}
		}else if(type == helper.GLOBAL_DISCOUNT || type == helper.CLF_DISCOUNT){
			if(item.added != undefined && item.added?.length > 0){
				//addedAmount -= item.total;
			}else{
				addedAmount -= item.price;
			}
		}
		this.formatText(min_order, addedAmount, promo_code);
	}
	onCatChange = () => {
		MyCart.init(this.init, null, null);
	}
	formatText = (min_order, addedAmount, promo_code = undefined) => {
		const {upto, amount, percent, type} = this.state.data;
		let text = '';
		if(percent > 0){
			text = percent+'% OFF ';
		}else if(amount > 0){
			text = lang.rp+amount+' OFF ';
		}else{
			return;
		}
		if(promo_code != undefined){
			text += 'Use Code '+promo_code+' | ';
		}
		if(addedAmount >= min_order){
			text += 'Congrats, You Can Apply Discount In Cart';
		}else if(addedAmount == 0){
			text += 'Add Item Worth '+min_order+' To Apply Offer';
		}else{			
			text += 'Add More '+(min_order - addedAmount)+' To Apply Offer';
		}
		this.setState({text,addedAmount})
	}
	render () {
		const {
			text
		} = this.state;
		return (
			<View style={s.main}>
			 <Text style={s.txt}>{text}</Text>
			</View>
		)
	}
}

const s = StyleSheet.create ({
	main : {
		minHeight:40,
		width:'100%',
		backgroundColor:'#443817',
		justifyContent:'center',
		alignItems:'center'
	},
	txt : {
		fontSize:13,
		color:helper.white,
		width:'95%',
		textAlign:'center'		
	}
})