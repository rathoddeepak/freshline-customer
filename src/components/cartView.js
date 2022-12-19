import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableWithoutFeedback
} from 'react-native';
import MyCart from 'libs/mycart';
import Icon from 'components/icon';
import Button from 'components/button';
import helper from 'assets/helper';
import lang from 'assets/lang';
import * as Animatable from 'react-native-animatable';
//Foods List
export default class CartView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cartCount:0,
			totalCost:0
		}
	}
	componentDidMount(){
		this.init()
	}
	init = () => {
		MyCart.init((items) => {
			if(items != null){
				let totalCost = 0;
				let count = 0;
				items.forEach(({cartCount,added,total,price}) => {					
					if(added != undefined && added?.length > 0){
						totalCost += total;						
					}else{
						totalCost += (price * cartCount);
					}					
					count += cartCount;					
				});
				this.setState({cartCount:count,totalCost})
			}			
		});
	}
	direct = (cartCount,totalCost) => {
		this.setState({cartCount,totalCost})
	}
	decrease = (c,t) => {
	  let {cartCount,totalCost} = this.state;
	  cartCount -= c;
	  totalCost -= t;
	  this.setState({cartCount,totalCost})	
	}
	increate = (c,t) => {
	  let {cartCount,totalCost} = this.state;
	  cartCount += c;
	  totalCost += t;
	  this.setState({cartCount,totalCost})	
	}
	addToCart = (item) => {		
		this.setState({
			cartCount:this.state.cartCount + 1,
			totalCost:this.state.totalCost + item.price
		});
		MyCart.add(item);		
		this.cartIcn.rubberBand();
	}
	removeFromCart = (item) => {		
		MyCart.remove(item);
		let totalCost = this.state.totalCost == 0 ? 0 : this.state.totalCost - item.price;
		totalCost = totalCost < 0 ? 0 : totalCost;
		this.setState({cartCount: this.state.cartCount == 0 ? 0 : this.state.cartCount - 1,totalCost})
		this.cartIcn.rubberBand();
	}
	navCart = () => {
		this.props.navigation.navigate('Cart');
	}
	render() {
		const {			
			cartCount,
			totalCost
		} = this.state;
		return (
			<View style={sty.hldr}>
			 <TouchableWithoutFeedback onPress={this.navCart}><View style={[sty.cart, {marginLeft:this.props.marginLeft}]}>			  
			  <Animatable.View ref={ref => { this.cartIcn = ref}} duration={2000} style={sty.icon}>
			   <Icon size={30} color="black" name={lang.bskt} />
			  </Animatable.View>			  
			  <Text style={sty.badge}>{cartCount}</Text>
			 </View></TouchableWithoutFeedback>

			 <View style={sty.csth}>		 
			  <Text style={sty.cst}>  ₹{totalCost}</Text>
			 </View>

			 <View style={{position:'absolute',right:0,alignItems:'center',height:'100%',right:6,flexDirection:'row'}}>			  
			  <Button text={lang.z[cl].odr} onPress={this.navCart} size={14} style={{marginHorizontal:5}}/>
			 </View>

			</View>
		)
	}
}
CartView.propTypes = {
	marginLeft:PropTypes.number
}
CartView.defaultProps = {
	marginLeft:0
}
const sty = StyleSheet.create({
	hldr:{flexDirection:'row',width:'100%',height:60,backgroundColor:'#000',height:60},
	cart:{width:60,height:60,justifyContent:'center',alignItems:'center'},
	icon:{width:45,height:45,backgroundColor:helper.primaryColor,borderRadius:90,justifyContent:'center',alignItems:'center'},
	badge:{fontSize:12,color:'white',backgroundColor:'#f85454',paddingVertical:2,paddingHorizontal:5,position:'absolute',top:5,right:0,borderRadius:100,elevation:5},
	cst:{fontSize:18,fontWeight:'bold',color:helper.silver},
	csth:{height:60,justifyContent:'center'}
})