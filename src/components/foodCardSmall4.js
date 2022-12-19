import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,	
	ScrollView,
	Animated,
	PanResponder,
	TouchableOpacity,
	Easing
} from 'react-native';
import PropTypes from 'prop-types';
import helper from 'assets/helper';
import Button from './button';
import Icon from './icon';
import Image from './image';
import FoodRating from './foodRating';
import lang from 'assets/lang';
const tgCW = 50;
const tgItW = 25;
const tgIX = 30;
const tgcH = 30;
const rMx = 25;
const lMx = -25;
export default class FoodCardSmall4 extends Component {
	constructor(props){
		super(props);
		this.state = {
			addMode:true
		}
	}
	
	setLock = (lock, inc, msg) => {
		this.counter.lock(lock, inc, msg)
	}

	handleAdd = (count, add) => {		
		if(add == 1)
			this.props.onAdd();		
	    else
	    	this.props.onRemove();
	}
	maxLimit = () => {

	}
	setCartCount = (v) => {
		this.counter.directI(v);
	}
	startAdd = () => {
		this.setState({addMode:false}, this.props.onMount);
	}
	render() {
		 const {
		   data,
		   onPress,
		   width,
		   borderRadius,
		   imgSize,
		   fontSize,
		   imgRadius,
		   menuPrice,
		   hasRating,
		   backgroundColor,
		   cStyle,
		   showCutP,
		   addonReq,
		   adons
		} = this.props;			
		const hasAdon = adons?.length > 0;
		let sF = fontSize + 1;
		let nM = hasRating ? 1 : 2;
		let closed = data?.closed ? true : false;
		let percent = parseInt((data.old_price * (data.old_price - data.price)) / 100);
		return (
			<View pointerEvents={closed ? "none" : undefined} style={[s.item, cStyle, {width,backgroundColor,borderRadius,opacity:closed ? 0.3 : 1}]}>
			  <View style={s.cntr}>
			   <Image
			    sty={{width:imgSize,height:imgSize,marginHorizontal:7}}
			    imgSty={{width:'100%',height:'100%'}}
			    borderRadius={imgRadius}
			    hash={data.hash}
			    source={{uri:helper.site_url + data.image}}
			   />			   
			   <View style={{width:'67%'}}>
			    <Text style={[s.tt, {fontSize:sF}]} numberOfLines={nM}>{data.name}</Text>
			     {hasRating ? <FoodRating 
				   verified={data.verified} 
				   rating={data.rating}		
				   fontSize={13}	   
				   style={{backgroundColor:'transparent',borderRadius:0,marginVertical:5,marginLeft:0}}
				 /> : null}
			    {menuPrice == true 
				    ? <Text style={[s.pr, {fontSize}]} numberOfLines={3}>₹{data.menu_price}</Text>
					: <Text style={[s.pr, {fontSize}]} numberOfLines={3}>₹{data.price} {showCutP && data.old_price != 0 ? <Text style={[s.old, {fontSize}]}>₹{data.old_price}</Text> : null} {percent > 0 ? <Text style={[s.pr, {color:helper.primaryColor}]}>{percent}% off</Text> : null}</Text>}
			   </View>
			  </View>			  
			  {this.state.addMode ?
			  	<Text onPress={this.startAdd} style={{position:'absolute',top:"41%",right:8,fontSize:16,fontWeight:'bold',color:helper.primaryColor}}>Add</Text>
			  : <CounterInput
			   style={{position:'absolute',top:10,right:8}}
			   onChange={this.handleAdd}
			   onMax={this.maxLimit}
			   adonAct={addonReq}
			   hasAdon={hasAdon}
			   ref={ref => (this.counter = ref)}
			  />}
			</View>
		)
	}
}
FoodCardSmall4.defaultProps = {
	width:"95%",
	imgSize:65,
	fontSize:13,
	hasRating:true,
	cStyle:{},
	imgRadius:10,
	borderRadius:5,
	showCutP:true,
	backgroundColor:helper.grey4
}
FoodCardSmall4.propTypes = {
	width:PropTypes.any,
	cStyle:PropTypes.object,
	imgSize:PropTypes.number,
	fontSize:PropTypes.number,
	borderRadius:PropTypes.number,
	imgRadius:PropTypes.number,
	hasRating:PropTypes.bool,
	showCutP:PropTypes.bool,
	backgroundColor:PropTypes.string,
}

class CounterInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			panX:new Animated.Value(0),
			hasChange:false,
			list:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			value:0,
			lock:false,
			ltype:0,
			msg:''
		}
		this.pan = new Animated.ValueXY();
		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (evt, gestureState) => true,
		    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
		    onMoveShouldSetPanResponder: (evt, gestureState) => true,
		    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,		    
		    onPanResponderGrant: () => {
		    	this.setState({hasChange:false})				
		    },
		    onPanResponderMove: (s, gestureState) => {
		    	if(this.state.hasChange)return;
		    	if(gestureState.dy > rMx){    	 
		    	 	this.triggerD();
		    	 	return;
		    	}
		    	if(gestureState.dy < lMx){    	 
		    	 	this.triggerI();
		    	 	return;
		    	}    	 
		    	this.state.panX.setValue(gestureState.dy);   
		    },
		    onPanResponderRelease: () => {
		    	if(!this.state.hasChange){
					this.normal();
				}
		    }
  	    });		
	}
	addWithAnim = () => {
		if(this.props.hasAdon){
            this.props.adonAct(this.reciveCall, 1);
            return;
        }
    	Animated.timing(this.state.panX, {
    		toValue:lMx,
    		duration:299,
            useNativeDriver:false
    	}).start(); 
    	setTimeout(() => {
    		this.triggerI();
    	}, 310)
    }
    removeWithAnim = () => {
    	if(this.props.hasAdon){
		    this.props.adonAct(this.reciveCall, -1);
		    return;
		}
        Animated.timing(this.state.panX, {
            toValue:rMx,
            duration:299,
            useNativeDriver:false
        }).start(); 
        setTimeout(() => {
            this.triggerD();
        }, 310)
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
    	let v = this.state.value;
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
    	if(v == this.props.maxLimit){
    		this.props.onMax();
    		return
    	}
    	this.setState({value:v}, () => {
    		this.props.onChange(v, 1);
    	});
    	this.counterScroll?.scrollTo({x:0, y:x, animated:true});
    }
    directI = (v) => {    	
        this.setState({v});    	
    	let len = this.state.list.length;    	
    	if((v + 2) == len){
    		let list = this.state.list;
    		for(let i = len; i < (len + 9); i++ )list.push(i);    		
    		this.setState({list});
    	}
    	setTimeout(() => {
    		this.setState({value:v})
    		this.counterScroll?.scrollTo({x:0, y:tgIX * v, animated:false});
    	})
    }
    triggerD = () => {
    	this.normal();
    	let v = this.state.value;
    	if((v - 1) < this.state.lock && this.state.ltype == -1){
    		ToastAndroid.show(this.state.msg, ToastAndroid.SHORT);
    		return;
    	}
    	this.setState({hasChange:true})    	
    	if(v == 0)return;v--;
    	let x = (tgIX * v);  	
    	this.setState({value:v}, () => {
    		this.props.onChange(v, -1);
    	})
    	this.counterScroll?.scrollTo({x:0, y:x, animated:true})
    }	
	render() {
		const translateY = this.state.panX.interpolate({
			inputRange:[lMx, 0, rMx],
			outputRange:[-5, 0, 13],
			extrapolate: 'clamp',
			useNativeDriver:true
		})	
		const {
			style
		} = this.props;
		return (
			<View style={style}>
			    <TouchableOpacity onPress={this.addWithAnim} style={{width:'100%',justifyContent:'center',top:-10,transform:[
                   {rotate:'-90deg'}
                  ]}}>
                       <Icon name={lang.pls} color={helper.silver} size={20} />
                </TouchableOpacity>
				<Animated.View {...this.panResponder.panHandlers}><TouchableOpacity>
				 <View style={{width:25,height:tgcH}}>
				  <Animated.View style={{width:tgItW, height:tgcH,elevation:10,backgroundColor:helper.primaryColor,borderRadius:100,transform:[
					  {translateY}
				  ]}}>	
				  <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} snapToInterval={tgIX} ref={ref => this.counterScroll = ref}>
			       {this.state.list.map((item, index) => {
			       	return (
			       		<View key={index} style={{width:'100%',height:tgIX,justifyContent:'center',alignItems:'center'}}>
					        <Text style={{fontSize:16,color:'#fff',fontWeight:'bold'}}>{item}</Text>
					    </View>
			       	)
			       })}
			      </ScrollView>
				  </Animated.View>
				 </View>
				</TouchableOpacity></Animated.View>				
				<TouchableOpacity onPress={this.removeWithAnim} style={{width:'100%',justifyContent:'center',bottom:-3}}>
				           <Icon name={lang.mns} color={helper.silver} size={22} />
				</TouchableOpacity>		
			</View>
		)
	}
}
const s = StyleSheet.create({
	item:{marginVertical:10,height:80,alignSelf:"center"},		
	tt:{fontWeight:'bold',color:helper.silver,width:'80%'},	
	pr:{color:helper.silver,width:'95%'},
	old:{textDecorationLine: 'line-through',color:helper.grey},
	cntr:{flexDirection: 'row',marginVertical:15}
})