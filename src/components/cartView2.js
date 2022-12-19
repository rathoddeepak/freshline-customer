import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Image,	
	StyleSheet,
	ToastAndroid
} from 'react-native';
import moment from 'moment';
import Icon from 'components/icon';
import Button from 'components/button';
import helper from 'assets/helper';
import lang from 'assets/lang';
import * as Animatable from 'react-native-animatable'
export default class CartView2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cartCount:0,
			totalCost:0,
			totalWT:0,
			items:[]
		}		
	}
	getItems = () => {
		return this.state.items;
	}
	addToCart = (item, ismanual = false) => {				
		const {taxPercent} = this.props;
		let tax = 0;
		let items = this.state.items;						
		let index = items.findIndex(x => x?.id == item.id);
		if(index == -1){
			item['cartCount'] = 1;
			item['food_id'] = item['id'];
			item['per_price'] = item.menu_price;
			item['total'] = item.menu_price;
			items.push(item);			
			this.setState({items})
		}else{
			item.per_price = items[index].per_price;
			items[index]['cartCount'] = items[index].cartCount + 1;		
			items[index]['total'] = items[index].cartCount * items[index].per_price;			
			this.setState({items})
		}				
		let totalWT = this.state.totalWT + item.per_price;				
		if(taxPercent > 0){
			tax = Math.ceil((totalWT * taxPercent) / 100);		
			setTimeout(() => this.props?.onTaxGot(tax), 300);
		}		
		let totalCost = totalWT + tax;		
		this.setState({
			cartCount:this.state.cartCount + 1,
			totalWT,
			totalCost
		});
		this.cartIcn.rubberBand();
	}
	dispatch = (list, callback) => {		
		const {taxPercent} = this.props;
		let totalCost = 0;
		let cartCount = 0;		
		let tax = 0;
		let items = [];
		list.forEach(({name,food_id,per_price,amount,quantity,image}) => {
			cartCount += quantity;
			totalCost += amount;
			items.push({
				id:food_id,
				name,				
				food_id,				
				cartCount:quantity,
				total:amount,
				menu_price:per_price,
				per_price,
				image
			});
		});
		let totalWT = totalCost;		
		if(taxPercent > 0){
			tax = Math.ceil((totalWT * taxPercent) / 100);		
			setTimeout(() => this.props?.onTaxGot(tax), 300);
		}
		totalCost += tax;
		this.setState({items,totalWT,cartCount,totalCost});
		this.cartIcn.rubberBand();
		callback(items, totalCost)
	}
	removeFromCart = (item, ismanual = false) => {
		const {taxPercent} = this.props;
	    let items = this.state.items;
		let tax = 0;
		let index = items.findIndex(x => x?.id === item.id);
		if(index != -1){
			let cc = items[index].cartCount;
			if(cc > 1){
				item.per_price = items[index].per_price;
				items[index]['cartCount'] =  cc - 1;
				items[index]['total'] = items[index].total - items[index].per_price;				
			}else {
				item.per_price = items[index].per_price;
				items.splice(index, 1);
			}			
			let totalCost = this.state.totalWT == 0 ? 0 : this.state.totalWT - item.per_price;			
			totalCost = totalCost < 0 ? 0 : totalCost;		
			let totalWT = totalCost;
			if(taxPercent > 0){
				tax = Math.ceil((totalWT * taxPercent) / 100);		
				setTimeout(() => this.props?.onTaxGot(tax), 300);
			}							
			totalCost += tax;
			this.setState({items,totalWT,cartCount:this.state.cartCount == 0 ? 0 : this.state.cartCount - 1,totalCost});
			this.cartIcn.rubberBand();
		}	
	}
	invoice = () => {
		let {items, totalWT} = this.state;
		const taxData = this.props?.taxes;
		if(items.length == 0){
			this.pls();
			return;
		} 
		let entities = [];
		let taxes = [];
		items.forEach((item) => {
			entities.push({
				title: item.name,
				quantity: item.cartCount,
				total:item.total,
				amount:item.per_price
			})
		});
		
		if(taxData != undefined && taxData?.length > 0){
			taxData.forEach(({name, percent}) => {
				let amount = (totalWT * percent) / 100;
				taxes.push({name,percent,amount});
			});
		}
		
		let title = 'Food Ordering';
		let time = moment().format('DD-MM-YYYY HH:MM A');
		this.props.navigation.navigate('Invoice', {
			title2:'Food Ordering',
			totalAmount:this.state.totalCost,
			entities,
			taxes,
			title,
			time
		});
	}
	placeOrder = () => {
		let items = this.state.items;
		if(items.length === 0){
			this.pls();
			return;
		}
		let vendor_id = items[0].vendor_id;
		let title = this.props.title;
		this.props.navigation.navigate('HotelTable', {
			totalAmount:this.state.totalCost,
			vendor_id,
			items,
			title
		});
	}
	getData = () => {				
		return {
			cartCount:this.state.cartCount,
			totalCost:this.state.totalCost,
			items:this.state.items
		}
	}
	pls = () => {
		ToastAndroid.show("Please Add Some Food 😋 😋", ToastAndroid.SHORT);
	}
	getItems = () => {
		return this.state.items;
	}
	render() {
		const {			
			cartCount,
			totalCost
		} = this.state;
		return (
			<View style={sty.hldr}>
			 <View style={[sty.cart, {marginLeft:this.props.marginLeft}]}>			  
			  <Animatable.View ref={ref => { this.cartIcn = ref}} duration={2000} style={sty.icon}>
			   <Icon size={30} color="black" name={lang.bskt} />
			  </Animatable.View>			  
			  <Text style={sty.badge}>{cartCount}</Text>
			 </View>

			 <View style={sty.csth}>		 
			  <Text style={sty.cst}>  ₹{totalCost}</Text>
			 </View>

			 <View style={{position:'absolute',right:0,alignItems:'center',height:'100%',right:6,flexDirection:'row'}}>			  
			  <Button br={15} text={lang.z[cl].bl} hr={20} onPress={this.invoice} size={14} style={{marginHorizontal:5}}/>
			  <Button br={15} text={lang.z[cl].plodr} onPress={this.props.onOrder} size={14} style={{marginHorizontal:5}}/>
			 </View>

			</View>
		)
	}
}
CartView2.propTypes = {
	marginLeft:PropTypes.number
}
CartView2.defaultProps = {
	marginLeft:0
}
const sty = StyleSheet.create({
	hldr:{flexDirection:'row',width:'100%',height:60,backgroundColor:'#000',height:60},
	cart:{width:60,height:60,justifyContent:'center',alignItems:'center'},
	icon:{width:45,height:45,backgroundColor:helper.primaryColor,borderRadius:90,justifyContent:'center',alignItems:'center'},
	badge:{fontSize:12,color:'white',backgroundColor:helper.red,paddingVertical:2,paddingHorizontal:5,position:'absolute',top:5,right:0,borderRadius:100,elevation:5},
	cst:{fontSize:18,fontWeight:'bold',color:helper.silver},
	csth:{height:60,justifyContent:'center'}
})