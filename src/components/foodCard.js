import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,	
	ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Icon from './icon';
import HeuButton from './HeuButton/';
import Image from './image';
import FoodRating from './foodRating'
import CounterInput from './counterInput';
import MyCart from 'libs/mycart';
export default class FoodCard extends Component {	
	componentDidMount() {		
		let c = MyCart.getItemCount(this.props.data.id);
		if(c)this.counter.directI(c);
	}
	handleAdd = (x, trigger) => {
		if(trigger == -1)MyCart.remove(this.props.data);
		else MyCart.add(this.props.data);
	}
	setCount = (c) => {
		this.counter.directI(c);
	}
	maxLimit = () => {

	}
	render() {
		  const {
		    data,		    
		    onPress		    		 
		  } = this.props;
		  let percent = parseInt((data.old_price * (data.old_price - data.price)) / 100);
		return (
			<HeuButton style={s.item} onPress={onPress}>
			  <View style={s.cntr}>
			   <Image
			    sty={{width:60,height:60,marginHorizontal:15}}
			    imgSty={{width:'100%',height:'100%'}}
			    borderRadius={10}
			    hash={data.hash}
			    source={{uri:helper.site_url + data.image}}
			   />	   
			   <View style={{width:'67%'}}>
			    <Text style={s.tt} numberOfLines={1}>{data.name}</Text>
			    {data.about?.length > 1 ? <Text style={s.dd} numberOfLines={2}>{data.about}</Text> : null}
			    <Text style={s.dd} numberOfLines={1}>From {data.restaurant_name}</Text>
			    <Text style={s.pr} numberOfLines={1}>₹{data.price} {data.old_price != 0 ? <Text style={s.old}>₹{data.old_price}</Text> : null} {percent > 0 ? <Text style={[s.pr, {color:helper.primaryColor}]}>{percent}% off</Text> : null}</Text>
			   </View>
			  </View>
			  <FoodRating 
			   verified={data.verified} 
			   rating={data.rating == null ? undefined : data.rating}
			   style={{backgroundColor:'transparent',borderRadius:0,marginBottom:10}}
			  />
			  <CounterInput
			   style={{position:'absolute',bottom:12,right:8}}
			   ref={ref => (this.counter) = ref}
			   onChange={this.handleAdd}
			   onMax={this.maxLimit}
			  />
			</HeuButton>
		)
	}
}

const s = StyleSheet.create({
	item:{width:"95%",alignSelf:"center",marginVertical:10,backgroundColor:helper.grey4,borderRadius:5},		
	tt:{fontSize:16,fontWeight:'bold',color:helper.silver,width:'95%'},
	dd:{fontSize:13,color:helper.grey,width:'95%'},
	pr:{fontSize:15,color:helper.silver,width:'95%'},
	old:{textDecorationLine: 'line-through',fontSize:15,color:helper.grey},
	cntr:{flexDirection: 'row',marginVertical:15}
})