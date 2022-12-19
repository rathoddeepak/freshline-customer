import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,	
	ScrollView,
	TouchableNativeFeedback
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Image from './image';
import FoodRating from './foodRating'
import CounterInput from './counterInput';
import MyCart from 'libs/mycart';
export default class FoodCard extends Component {
	render() {
		  const {
		    data,		    
		    onPress		    		 
		  } = this.props;
		  let percent = parseInt((data.old_price * (data.old_price - data.price)) / 100);
		return (
			<View style={s.item}>
			  <View style={{flexDirection:'row',height:70,width:'100%',alignItems:'center',backgroundColor:'#2e2e2e',borderTopLeftRadius:6,borderTopRightRadius:6}}>
			   <Image
			    sty={{width:50,height:50,marginHorizontal:15}}
			    imgSty={{width:'100%',height:'100%'}}
			    borderRadius={100}
			    hash={data.logo_hash}
			    source={{uri:helper.site_url + data.logo}}
			   />	   
			   <View style={{width:'67%'}}>
			    <Text style={s.fwq} numberOfLines={2}>{data.restaurant_name}</Text>			    
			   </View>
			  </View>
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
			    <Text style={s.pr} numberOfLines={1}>₹{data.price}</Text>
			   </View>
			  </View>
			  <TouchableNativeFeedback onPress={onPress}><View style={{width:'92%',height:40,borderRadius:5,borderWidth:0.5,borderColor:helper.primaryColor,alignSelf:'center',marginTop:5,marginBottom:10,justifyContent:'center',alignItems:'center'}}>
			   <Text style={s.bn} numberOfLines={1}>VIEW FULL MENU</Text>
			  </View></TouchableNativeFeedback>
			</View>
		)
	}
}

const s = StyleSheet.create({
	item:{width:"95%",alignSelf:"center",marginVertical:10,backgroundColor:helper.grey4,borderRadius:5},		
	tt:{fontSize:16,fontWeight:'bold',color:helper.silver,width:'95%'},
	fwq:{fontSize:16,fontFamily:'sans-serif-light',color:helper.silver,width:'95%'},
	dd:{fontSize:13,color:helper.grey,width:'95%'},
	pr:{fontSize:15,color:helper.silver,width:'95%'},
	bn:{fontSize:15,color:helper.primaryColor},
	old:{textDecorationLine: 'line-through',fontSize:15,color:helper.grey},
	cntr:{flexDirection: 'row',marginVertical:15}
})