import React, { Component } from 'react';
import {
	View,
	Text,	
	Pressable,
	StyleSheet
} from 'react-native';
import Image from './image';
import Pager from './pager';
import helper from 'assets/helper';
import lang from 'assets/lang';
import RstrntRating from './rstrntRating';
const sliderWidth = helper.width * 60 / 100;
const sliderItem = sliderWidth - 20;
export default class TableCard extends Component {
	loopStart = () => {
		this.review.loopStart();
	}
	render() {
		const {
			item,
			index,
			onPress
		} = this.props;		
		return (
			<Pressable style={s.itemC} onPress={onPress}>
			 <Image source={{uri:helper.site_url + item.cover}} imgSty={{width:'100%',height:'100%'}} borderRadius={6} hash={item.cover_hash} />
			 <View style={s.item}>
			  <Text numberOfLines={2} style={s.title}>{item.name}</Text>
			  <Text numberOfLines={1} style={s.dstnc}>{item.dr} Away From You</Text>
			  {item.sltav > 0 ? <Text numberOfLines={1} style={s.title}>{item.sltav} Slots Available</Text> : null}

			  <View style={s.btnw}>
			   {item.closed ? <Text style={[s.btt, {color:helper.red}]}>{item.sltav == 0 ? 'All Slots Passed' : 'Closed'}</Text> : <Text style={s.btt}>{lang.z[cl].bk_nw}</Text>}
			  </View>			  

			  <Pressable style={s.cmts} onPress={() => this.props.onCommentPress(index)}>
			   <Pager vertical ref={(ref) => this.review = ref}>
			   	{item.reviews.map(review => {			   		
			   		return (
			   		  <Text numberOfLines={1} key={index} style={[s.dstnc, {width:'100%'}]}>{review.text}</Text>
			   		)
			   	})}
			   </Pager>
			  </Pressable>

			  <RstrntRating verified={item.verified} rating={item.rating} style={{position: 'absolute',top:5,right:5}}/>
			 </View>
			</Pressable>
		)
	}
}

const s = StyleSheet.create({
	itemC:{backgroundColor:helper.grey,borderRadius:6,width:'95%',marginVertical:10,height:200,alignSelf:'center'},
	item:{width:'100%',height:'100%',borderRadius:6,backgroundColor:'#00000066', justifyContent:'center', alignItems:'center',position:'absolute'},
	title:{fontSize:13,fontWeight:'bold',textAlign:'center',width:'95%',color:'white',textShadowColor: 'black',textShadowOffset: { width: -1, height: 0 },textShadowRadius:5},
	dstnc:{fontSize:10,textAlign:'center',width:'95%',color:'white',textShadowColor: 'black',textShadowOffset: { width: -1, height: 0 },textShadowRadius:5},
	btnw:{backgroundColor:'white',paddingVertical:3,paddingHorizontal:5,borderRadius:10,justifyContent:'center',alignItems:'center',position:'absolute',left:5,bottom:5},
	btt:{fontSize:13,fontWeight:'bold',color:helper.primaryColor},
	cmts:{height:65,width:sliderWidth,position:'absolute',right:0,bottom:5,width:'50%'},
	tt:{fontSize:20,fontWeight:'bold',color:helper.silver}	
})