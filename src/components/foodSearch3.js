import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Image,
	Modal,
	FlatList,
	TextInput,
	StyleSheet,	
	BackHandler,	
	TouchableWithoutFeedback
} from 'react-native';
import MyCart from 'libs/mycart';
import FoodCardSmall from './foodCardSmall4';
import Icon from './icon';
import Button from './button';
import helper from 'assets/helper';
import lang from 'assets/lang';
import {View as AniView} from 'react-native-animatable'
import request from 'libs/request';
export default class FoodSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cartCount:0,			
			result:[],
			mode:1,
			items:[],
			v:false
		}
		this.foodItem = [];		
	}		
	show = (dataList) => {
		this.setState({mode:1,v:true}, () => {
			MyCart.init((items) => {
				if(items != null){
					let totalCost = 0;
					let cartCount = 0;
					items.forEach((item) => {									
						cartCount += item.cartCount;
					});
					this.setState({cartCount,totalCost,dataList})
				}			
			});
		})
	}
	show2 = (dataList, {items,cartCount}) => {		
		this.setState({mode:2,items,dataList,cartCount,v:true})
	}
	addToCart = (item, index) => {
		if(this.state.mode == 1){
		    setTimeout(() => {
				this.setState({cartCount:this.state.cartCount + 1});
				MyCart.add(item);
				this.cartIcn.rubberBand();		
			})		
		}else{
			setTimeout(() => {
				item.cartCount = item.cartCount == undefined ? 1 : item.cartCount + 1				
				this.setState({cartCount:this.state.cartCount + 1});
				this.props.addItem(item);
				this.cartIcn.rubberBand();
			})						
		}		
	}
	removeFromCart = (item, index) => {
		if(this.state.mode == 1){
			setTimeout(() => {
				MyCart.remove(item);		
				this.setState({cartCount: this.state.cartCount == 0 ? 0 : this.state.cartCount - 1})
				this.cartIcn.rubberBand();
			});
		}else{
			setTimeout(() => {
				item.cartCount = item.cartCount == undefined ? 1 : item.cartCount - 1
				let items = this.state.items;
				items[index] = item;
			    this.props.removeItem(item);
				this.setState({items,cartCount: this.state.cartCount == 0 ? 0 : this.state.cartCount - 1})
				this.cartIcn.rubberBand();				
			});
		}		
	}
	navCart = () => {
		this.props.navigation.navigate('Cart');
	}
	onFCMount(id,idx){
		if(this.state.mode == 1){
			let c = MyCart.getItemCount(id);		
			if(c)this.foodItem[id]?.setCartCount(c);
		}else{
			this.state.items.forEach(item => {
				if(item.id == id){
					this.foodItem[id]?.setCartCount(item.cartCount);
				}
			})			
		}
	}
	close = () => {
		this.setState({v:false,items:[],dataList:[],result:[]}, () => {
			this.props?.onClose();
		})
	};
	search = (text) => {
		this.setState({
			text
		}, () => {
			if(request.isBlank(text)){
				this.setState({result:[]});
			}else{
				let result = this.state.dataList.filter(item => {				
					return item.name.toLowerCase().includes(
						text.toLowerCase()
					);
				});
				this.setState({result});
			}			
		})
	}
	render() {
		const {			
			result,
			cartCount,
			v
		} = this.state;
		const menuPrice = this.props.menuPrice == undefined ? false : true;
		return (			
			<Modal visible={v} transparent onRequestClose={this.close} animationType="fade">
			<View style={helper.model}><View style={sty.main}>
			 <View style={sty.hldr}>
			     <View style={{height:40,width:'80%',backgroundColor:helper.grey6,borderRadius:20,marginTop:10,flexDirection: 'row',alignItems:'center'}}>
				     <Icon name={lang.srch} color={helper.grey} size={20} style={{margin:5}}/>
				     <TextInput autoFocus onChangeText={this.search} style={{color:helper.white,width:'100%',fontSize:14,padding:0}} placeholder="Search Food" placeholderTextColor={helper.grey} />
				 </View>
				 <View style={sty.cart}>				  
				  <AniView ref={ref => { this.cartIcn = ref}} duration={2000} style={sty.icon}>
				   <Icon size={30} color="black" name={lang.bskt} />
				  </AniView>			  
				  <Text style={sty.badge}>{cartCount}</Text>
				 </View>
			 </View>
			 <FlatList
			  data={result}
			  keyExtractor={(item) => item.id}
			  renderItem={({ item, index}) =>
			      <FoodCardSmall 
			       ref={ref => this.foodItem[item.id] = ref}
			       onAdd={() => this.addToCart(item, index)}
			       onMount={() => this.onFCMount(item.id, index)}
				   menuPrice={menuPrice}
			       onRemove={() => this.removeFromCart(item, index)}
			       hasRating={false}
			       imgSize={50}
			       data={item}					       
			      />					      
		      }
			 />
			</View></View>
			</Modal>
		)
	}
}

const sty = StyleSheet.create({
	main:{width: '95%', height: '95%', elevation:10, backgroundColor:helper.grey6,borderRadius:10,overflow:'hidden'},
	hldr:{flexDirection:'row',width:'100%',height:60,backgroundColor:'#000',height:60},
	cart:{width:60,height:60,justifyContent:'center',alignItems:'center'},
	icon:{width:45,height:45,backgroundColor:helper.primaryColor,borderRadius:90,justifyContent:'center',alignItems:'center'},
	badge:{fontSize:12,color:'white',backgroundColor:'#f85454',paddingVertical:2,paddingHorizontal:5,position:'absolute',top:5,right:0,borderRadius:100,elevation:5},
	cst:{fontSize:18,fontWeight:'bold',color:helper.silver},
	csth:{height:60,justifyContent:'center'}
})