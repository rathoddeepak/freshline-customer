import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,	
	ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import helper from 'assets/helper';
import Icon from './icon';
import Image from './image';
import FoodRating from './foodRating'
export default class FoodCard3 extends Component {
	componentDidMount() {
		setTimeout(() => {
			if(this.props.onMount != undefined)
				this.props.onMount();
		})		
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
	render() {
		 const {
		   data,
		   onPress,
		   width,
		   borderRadius,
		   imgSize,
		   fontSize,
		   imgRadius,		   
		   backgroundColor,
		   cStyle,
		   menuPrice		   
		} = this.props;	
		let sF = fontSize + 1;		
		return (
			<View style={[s.item, cStyle, {width,backgroundColor,borderRadius}]}>
			  <View style={s.cntr}>
			   <Image
			    sty={{width:imgSize,height:imgSize,marginHorizontal:7}}
			    imgSty={{width:'100%',height:'100%'}}
			    borderRadius={imgRadius}
			    hash={data.hash}
			    source={{uri:helper.site_url + data.image}}
			   />			   
			   <View style={{width:'67%',justifyContent:'center'}}>
			    <Text style={[s.tt, {fontSize:sF}]} numberOfLines={2}>{data.name}</Text>			    
				<Text style={[s.pr, {fontSize}]} numberOfLines={3}>₹{menuPrice == true ? data.menu_price : data.price}</Text>					
			   </View>
			  </View>
			</View>
		)
	}
}
FoodCard3.defaultProps = {
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
FoodCard3.propTypes = {
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
const s = StyleSheet.create({
	item:{alignSelf:"center",marginVertical:10},		
	tt:{fontWeight:'bold',color:helper.silver,width:'80%'},	
	pr:{color:helper.silver,width:'95%'},
	old:{textDecorationLine: 'line-through',color:helper.grey},
	cntr:{flexDirection: 'row',marginVertical:15}
})