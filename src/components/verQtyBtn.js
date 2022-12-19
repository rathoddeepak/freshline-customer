import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
	Animated,
	Easing,
	ToastAndroid,
    TouchableOpacity
} from 'react-native';
import {
  ScrollView,
  PanGestureHandler,
  TapGestureHandler,
  State
} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import Address from 'libs/address';
import helper from 'assets/helper'
import Parse from 'parse/react-native';
import errRes from 'assets/errRes';
import Cart from 'libs/cart';
import Icon from './icon';
import lang from 'assets/lang';
import MyCart from 'libs/mycart';
const tgCW = 50;
const tgItW = 25;
const tgIX = 30;
const tgcH = 30;

const rMx = 0;
const lMx = -1;
export default class VerQtyBtn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy:false,
			panX:new Animated.Value(0),
			hasChange:false,
			list:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			value:0,
			lock:false,
			ltype:0,
			msg:''
		}
	}	
    _onPanGestureEvent = ({nativeEvent}) => {    	
    	 if(this.state.hasChange)return;
    	 if(nativeEvent.translationY > rMx){    	 
    	 	this.removeWithAnim();
    	 	return;
    	 }
    	 if(nativeEvent.translationY < lMx){    	 
    	 	this.addWithAnim();
    	 	return;
    	 }    	 
    	 this.state.panX.setValue(nativeEvent.translationY);  	 
    }
    addWithAnim = async () => {
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
				// this.setState({qty:this.state.qty + 1}, () => {
					Cart.changed(data);
					if(this.props.newQty != undefined){
						this.props.newQty(this.state.qty + 1);
					}
					this.startAddAnim();
				// })
			}else{
				ToastAndroid.show(data, ToastAndroid.SHORT);
			}			
		}).catch(err => {
			alert(err)
			this.setState({busy:false})
			ToastAndroid.show("Please Try Again!", ToastAndroid.SHORT);
		});
    }
    startAddAnim = () => {
    	Animated.timing(this.state.panX, {
    		toValue:lMx,
    		duration:299,
            useNativeDriver:false
    	}).start(); 
    	setTimeout(() => {
    		this.triggerI();
    	}, 310)
    }
    removeWithAnim = (all_qty = false) => {
        if(this.state.busy)return
		if(this.state.qty <= 0){
			return;
		}
		let newQty = all_qty ? 0 : this.state.qty - 1;
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
		Parse.Cloud.run('removeFromCart', data).then(({status, data}) => {
			this.setState({busy:false})
			if(status == 200){
				// this.setState({qty:this.state.qty - 1}, () => {
					Cart.changed(data);
					if(this.props.newQty != undefined){
						this.props.newQty(newQty);
					}
					if(all_qty == true){
						this.dispatch(0, this.state.avl_qty);
					}else{
						this.startRemoveAnim();
					}
				// })
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
    startRemoveAnim = () => {
    	Animated.timing(this.state.panX, {
            toValue:rMx,
            duration:299,
            useNativeDriver:false
        }).start(); 
        setTimeout(() => {
            this.triggerD();
        }, 310)
    }
    lock = (lock, ltype, msg) => {
    	this.setState({lock:this.state.value, ltype, msg})
    }
    normal = () => {
    	Animated.timing(this.state.panX, {
				    toValue:0,
				    easing:Easing.elastic(1),
				    duration:500,
			        useNativeDriver:false
		}).start();        
    }
    triggerI = () => {
    	this.normal();
    	let v = this.state.qty;
    	if((v + 1) > this.state.lock && this.state.ltype == 1){    		
    		ToastAndroid.show(this.state.msg, ToastAndroid.SHORT);
    		return;
    	}
    	this.setState({hasChange:true});    	
    	let x = v == 0 ? 1 : (v + 1);
    	let len = this.state.list.length;
    	if((v + 2) == len){
    		let list = this.state.list;
    		for(let i = len; i < (len + 9); i++ )list.push(i);    		
    		this.setState({list});
    	}
    	x = tgIX * x;
    	v++;
    	/*if(v == this.props.maxLimit){
    		this.props.onMax();
    		return
    	}*/
    	this.setState({qty:v});
    	this.counterScroll.scrollTo({x:0, y:x, animated:true});
    }
    dispatch = (qty, avl_qty) => {    	   	
    	let len = this.state.list.length;        
    	if((qty + 2) > len){
    		let list = this.state.list;
    		for(let i = len; i < qty + 5; i++ )list.push(i);    		
    		this.setState({list});
    	}
    	setTimeout(() => {
    		this.setState({qty,avl_qty,outOfStock:avl_qty == 0})
    		this.counterScroll.scrollTo({x:0, y:tgIX * qty, animated:false});
    	})
    }
    triggerD = () => {
    	this.normal();
    	let v = this.state.qty;
    	if((v - 1) < this.state.lock && this.state.ltype == -1){
    		ToastAndroid.show(this.state.msg, ToastAndroid.SHORT);
    		return;
    	}
    	this.setState({hasChange:true})    	
    	if(v == 0)return;v--;
    	let x = (tgIX * v);  	
    	this.setState({qty:v})
    	this.counterScroll.scrollTo({x:0, y:x, animated:true})
    }
	_onHandlerStateChange = ({nativeEvent}) => {
		if(nativeEvent.state == State.BEGAN){
			this.setState({hasChange:false})
		}else if(nativeEvent.state === State.END && !this.state.hasChange){
			this.normal();
		}
	}
	render() {
		const translateY = this.state.panX.interpolate({
			inputRange:[lMx, 0, rMx],
			outputRange:[-5, 0, 10],
			extrapolate: 'clamp',
			useNativeDriver:true
		})	
		const {
			style,
            addons
		} = this.props;
		const busy = this.state.busy;
		return (
            <View style={[s.btnIcon, {flexDirection:'row',opacity:busy ? 0.6 : 1}]}>                
                <TouchableOpacity disabled={busy} onPress={this.removeWithAnim} style={s.icn}>
                           <Icon name={lang.mns} color={helper.white} size={15} />
                </TouchableOpacity>
    			{/*<PanGestureHandler onGestureEvent={this._onPanGestureEvent} onHandlerStateChange={this._onHandlerStateChange}>*/}
    				 <View style={s.icn}>    				  
    				  <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} snapToInterval={tgIX} ref={ref => this.counterScroll = ref}>
    			       {this.state.list.map((item, index) => {
    			       	return (
    			       		<View key={index} style={{width:'100%',height:30,justifyContent:'center',alignItems:'center'}}>
    					        <Text style={{width:'100%',textAlign:'center',fontSize:16,color:'#fff',fontWeight:'bold'}}>{item}</Text>
    					    </View>
    			       	)
    			       })}
    			      </ScrollView>    				  
    				 </View>                  
				{/*</PanGestureHandler>*/}
				<TouchableOpacity disabled={busy} onPress={this.addWithAnim} style={s.icn}>
                           <Icon name={lang.pls} color={helper.white} size={15} />
                </TouchableOpacity>                          
            </View>
		)
	}
}


const s = {
	icn:{width:'33%',height:30,justifyContent:'center',alignItems:'center'},
	btnIcon:{height:30,width:80,backgroundColor:helper.primaryColor,borderRadius:10}
}

VerQtyBtn.propTypes = {
	style:PropTypes.object,
	maxLimit:PropTypes.number
}

VerQtyBtn.defaultProps = {
	style:{},
	maxLimit:50
}