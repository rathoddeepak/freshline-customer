import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,	
	ScrollView,
	TouchableNativeFeedback,
	TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import helper from 'assets/helper';
import Icon from './icon';
import Image from './image';
import FoodRating from './foodRating'
import CounterInput from './counterInput';

export default class FoodCardSmall extends Component {
	constructor(props){
		super(props);
		this.state = {
			addonOutStock:false,
			outStock:false
		}
	}
	componentDidMount() {
		setTimeout(() => {
			if(this.props.onMount != undefined)
				this.props.onMount();
		})		
	}
	setLock = (lock, inc, msg) => {
		this.counter.lock(lock, inc, msg)
	}
	getData = () => {
		const {outStock, addonOutStock} = this.state;
		return {data:this.props.data, outStock, addonOutStock};
	}
	handleAdd = (count, add) => {
		if(add == 1){
			this.props.onAdd();		
		}else{
	    	this.props.onRemove();
	    }
	}
	setCartCount = (v) => {
		this.counter?.directI(v);
	}
	setAddonCount = (v) => {
		this.setState({addonOutStock:false}, () => {
			setTimeout(() => {
				this.counter?.directI(v)
			}, 100)
		});
	}
	hdlAddAnim = () => {
		this.counter?.addWithAnim();
	}
	setAddonOutStock = (addonOutStock) => {		
		this.setState({addonOutStock})
	}
	setOutStock = (outStock) => {		
		this.setState({outStock})
	}
	canProceed = () => {
		const {outStock, addonOutStock} = this.state;
		return !outStock && !addonOutStock;
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
		   addonReq,
		   adons,
		   reset,
		   itemRemove,
		   countColor,
		   hideCounter
		} = this.props;
		const {
			addonOutStock,
			outStock
		} = this.state;
		let sF = fontSize + 1;
		let nM = hasRating ? 1 : 2;
		const closed = data?.closed ? true : false;		
		const hasAdon = adons?.length > 0;
		return (
			<View style={[s.item, cStyle, {justifyContent:'center',width,backgroundColor,borderRadius,overflow:'hidden',opacity:closed ? 0.3 : 1}]}>
			  <View style={s.cntr}>
			   <Image
			    sty={{width:imgSize,height:imgSize,marginHorizontal:7}}
			    imgSty={{width:'100%',height:'100%'}}
			    borderRadius={imgRadius}
			    hash={data.hash}
			    source={{uri:helper.site_url + data.image}}
			   />		   
			   <View style={{width:'67%',height:'100%'}}>
			    <Text style={[s.tt, {fontSize:sF}]} numberOfLines={nM}>{data.name}</Text>
			     {hasRating ? <FoodRating 
				   verified={data.verified} 
				   rating={data.rating}		
				   fontSize={13}	   
				   style={{backgroundColor:'transparent',borderRadius:0,marginVertical:5,marginLeft:0}}
				 /> : null}
				{data.out_stock == 1 ? <Text style={s.cs} numberOfLines={3}>OUT OF STOCK</Text> : addonOutStock ? <Text style={s.cs} numberOfLines={3}>ITEM OUT OF STOCK</Text> : hasAdon
				    ? <Text style={s.cs} numberOfLines={3}>CUSTIMZE</Text>
					: null}
			    {menuPrice == true 
				    ? <Text style={[s.pr, {fontSize}]} numberOfLines={3}>₹{data.menu_price}</Text>
					: <Text style={[s.pr, {fontSize}]} numberOfLines={3}>₹{data.price}</Text>}				
			   </View>
			  </View>			  
			  {data.out_stock == 1 ? <TouchableOpacity onPress={itemRemove} style={s.opt}>
			    <Icon name={'trash'} color={helper.white} size={30} />
			  </TouchableOpacity> : addonOutStock ? <TouchableOpacity onPress={reset} style={s.opt}>
			    <Icon name={'retry'} color={helper.white} size={30} />
			  </TouchableOpacity> : hideCounter ? null : <CounterInput
			   style={{position:'absolute',right:0,backgroundColor:countColor,padding:10,top:-1}}
			   onChange={this.handleAdd}
			   onMax={this.maxLimit}
			   hasAdon={hasAdon}
			   adonAct={addonReq}
			   ref={ref => this.counter = ref}
			  />}
			</View>
		)
	}
}
FoodCardSmall.defaultProps = {
	width:"95%",
	imgSize:65,
	fontSize:13,
	hasRating:true,
	cStyle:{},
	imgRadius:10,
	borderRadius:5,
	showCutP:true,
	countColor:helper.grey6,
	backgroundColor:helper.grey4,
	hideCounter:false
}
FoodCardSmall.propTypes = {
	width:PropTypes.any,
	cStyle:PropTypes.object,
	imgSize:PropTypes.number,
	fontSize:PropTypes.number,
	borderRadius:PropTypes.number,
	imgRadius:PropTypes.number,
	hasRating:PropTypes.bool,
	hideCounter:PropTypes.bool,
	showCutP:PropTypes.bool,
	backgroundColor:PropTypes.string,
	countColor:PropTypes.string,
}
const s = StyleSheet.create({
	item:{marginVertical:10,height:80,alignSelf:"center"},		
	tt:{fontWeight:'bold',color:helper.silver,width:'80%'},	
	pr:{color:helper.silver,width:'95%'},
	old:{textDecorationLine: 'line-through',color:helper.grey},
	cntr:{flexDirection: 'row',alignItems:'center'},
	cs:{fontSize:9,fontWeight:'bold',marginVertical:3,color:helper.silver},
	opt:{position:'absolute',right:0,backgroundColor:helper.grey6,padding:10,top:-1,width:45,height:'100%',justifyContent:'center',alignItems:'center'}
})