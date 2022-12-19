import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ToastAndroid
} from 'react-native';
import Icon from './icon';
import helper from 'assets/helper'
import Parse from 'parse/react-native';
import errRes from 'assets/errRes';
import Cart from 'libs/cart';
import Address from 'libs/address';
export default class QtyBtn extends Component {
	constructor(props){
		super(props)
		this.state = {
			qty:0,
			avl_qty:0,
			outOfStock:false
		}
	}
	dispatch = (qty, avl_qty) => {
		this.setState({qty,avl_qty,outOfStock:avl_qty == 0});
	}


	handleAdd = () => {
		if(this.state.busy)return
		const {qty, avl_qty} = this.state;
		if(qty >= avl_qty){
			ToastAndroid.show(errRes.no_more_add, ToastAndroid.SHORT);
			return
		}
		let address = Address.getCurrentAddress();
		let data = {
			product_id:this.props.productId,
			user_id,
			address
		}
		if(this.props.parentId != undefined){
			data.parent_id = this.props.parentId
		}
		this.setState({busy:true})
		Parse.Cloud.run('addToCart', data).then(({status, data}) => {
			this.setState({busy:false})
			if(status == 200){
				this.setState({qty:this.state.qty + 1}, () => {
					Cart.changed(data);
					if(this.props.newQty != undefined){
						this.props.newQty(this.state.qty);
					}
				})
			}else{
				ToastAndroid.show(data, ToastAndroid.SHORT);
			}			
		}).catch(err => {
			this.setState({busy:false})
			ToastAndroid.show("Please Try Again!", ToastAndroid.SHORT);
		})
	}

	handleRemove = () => {
		if(this.state.busy)return
		if(this.state.qty <= 0){
			return;
		}
		let address = Address.getCurrentAddress();
		const product_id = this.props.productId;
		this.setState({busy:true})
		let data = {product_id,user_id,address}
		if(this.props.parentId != undefined){
			data.parent_id = this.props.parentId
		}
		Parse.Cloud.run('removeFromCart', data).then(({status, data}) => {
			this.setState({busy:false})
			if(status == 200){
				this.setState({qty:this.state.qty - 1}, () => {
					Cart.changed(data);
					if(this.props.newQty != undefined){
						this.props.newQty(this.state.qty);
					}
				})
			}else if(status == 400){
				if(typeof data == 'string'){
					ToastAndroid.show(data, ToastAndroid.SHORT);
				}else{
					const ps = data.product_status;
					const {NOT_AVL_CART,OUT_OF_STOCK,LMT_STOCK_ERR} = helper.cartErr;
					if(ps == NOT_AVL_CART){
						ToastAndroid.show('Not Available In Cart', ToastAndroid.SHORT)
					}else if(ps == OUT_OF_STOCK){
						ToastAndroid.show('Product Out of Stock, item removed', ToastAndroid.SHORT);
						this.setState({outOfStock:true,qty:0,avl_qty:0})
					}else if(LMT_STOCK_ERR == ps){
						ToastAndroid.show('Stock Mismatch, item removed!', ToastAndroid.SHORT);
						this.setState({qty:0,avl_qty:data.avl_qty})
					}
				}
				
			}			
		}).catch(err => {
			this.setState({busy:false})
			ToastAndroid.show("Please Try Again!", ToastAndroid.SHORT);
		})
	}

	render(){
		const {
			qty,
			busy,
			outOfStock
		} = this.state;
		const {
			style,
			smallSize
		} = this.props
		// const realWidth = smallSize ? 70 : 100;
		// const iconSize = smallSize ? 15 : 20;
		const realWidth = smallSize - 20;		
		return (
			<View style={[s.main, style, {opacity:busy ? 0.6 : 1,width:realWidth,borderRadius:5, alignSelf:'center'}]}>
			 {outOfStock ? <Text style={s.txt}>Out of Stock</Text>: this.renderButtons(qty, busy)}
			</View>
		)
	}
	renderButtons = (qty, busy) => {
		const iconSize = 20;
		if(qty == 0){
			return (
				<TouchableOpacity onPress={this.handleAdd} disabled={busy} style={s.btnAction} activeOpacity={0.8}>
					<Text style={s.txt}>Add to bag</Text>
				</TouchableOpacity>
			)
		}
		return (
			<>
				 <TouchableOpacity style={s.btnCont} onPress={this.handleRemove} disabled={busy} activeOpacity={0.8}>
					 <Icon name="minus" size={iconSize} color={helper.white} />
			     </TouchableOpacity>
				 <Text style={[s.txt, {width:'20%'}]}>{qty}</Text>
				 <TouchableOpacity style={s.btnCont} onPress={this.handleAdd} disabled={busy} activeOpacity={0.8}>
				  <Icon name="plus" size={iconSize} color={helper.white} />
				 </TouchableOpacity>
			 </>
		)
	}
}

const s = {
	btnCont:{width:'40%',height:'100%',justifyContent:'center',alignItems:'center'},
	btnAction:{
		justifyContent:'center',
		alignItems:'center',
		width:'100%'
	},
	main:{
		height:35,
		backgroundColor:helper.primaryColor,
		flexDirection:'row',
		justifyContent:'space-around',
		alignItems:'center',
		marginBottom:10,
		elevation:24
	},
	txt:{
		fontSize:15,
		color:helper.white,
		width:'80%',
		textAlign:'center'
	}
}