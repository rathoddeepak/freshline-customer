import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
	TouchableNativeFeedback
} from 'react-native';
import helper from 'assets/helper';
import Icon from 'components/icon';
import Image from './image';
import RstrntRating from './rstrntRating';
export default class VendorCard extends Component {
	render() {
		const {
			item,
			onPress
		} = this.props;
		const opacity = item.delivery == 0 || item.closed ? 0.5 : 1;
		return (
			<View style={{width:'100%',opacity}}>
			  <TouchableNativeFeedback onPress={onPress}>
			  <View style={s.rsntChip}>
				<View style={{width:90,justifyContent:'center',height:100,alignItems:'center'}}>
					<Image 
					 sty={{width:80,height:80}}
					 borderRadius={100}
					 imgSty={{width:80,height:80}}
					 hash={item.logo_hash}
					 source={{uri:helper.site_url + item.logo}} />
					</View>
					<View style={{width:'75%',padding:10}}>
						<Text numberOfLines={2} style={s.tt2}>{item.name}</Text>
						{item.about?.length ? <Text numberOfLines={2} style={{fontSize:12,color:helper.grey,width:'90%'}}>{item.about}</Text> : null}
						<View style={{flexDirection:'row',marginTop:2}}>
						    {item.onlyveg == 1 ? <View style={{marginRight:2,paddingVertical:3,backgroundColor:'#757575',paddingHorizontal:5,alignItems:'center',flexDirection:'row',marginRight:4,borderRadius:5}}>
						     <Icon name="veg" color={helper.grey4} size={14} style={{marginRight:3}}/>
						     <Text style={{fontSize:12,color:helper.grey4,fontWeight:'bold'}}>VEG</Text>
							</View> : null}
						    <View style={{marginRight:2,paddingVertical:3,backgroundColor:'#757575',paddingHorizontal:5,alignItems:'center',flexDirection:'row',marginRight:4,borderRadius:5}}>
						     <Icon name="pin" color={helper.grey4} size={14} style={{marginRight:3}}/>
						     <Text style={{fontSize:12,color:helper.grey4,fontWeight:'bold'}}>{item.dr}</Text>
							</View>
							{item.rating > 0 ? <View style={{marginRight:2,paddingVertical:3,backgroundColor:'#757575',paddingHorizontal:5,alignItems:'center',flexDirection:'row',marginRight:4,borderRadius:5}}>
						     <Icon name="star" color={helper.grey4} size={14} style={{marginRight:3}}/>
						     <Text style={{fontSize:12,color:helper.grey4,fontWeight:'bold'}}>{item.rating}</Text>
							</View> : null}							
							{item.new == 1 ? <View style={{marginRight:2,paddingVertical:3,backgroundColor:helper.primaryColor,paddingHorizontal:5,alignItems:'center',flexDirection:'row',borderRadius:5}}>
						     <Text style={{fontSize:12,color:helper.grey4,fontWeight:'bold'}}>NEW</Text>
							</View> : null}
						</View>
						{item.delivery == 0 ? <Text style={s.ceq}>Opening In Few Hours..</Text> : <Text style={[s.ceq, {color:item.closed ? helper.green : item.time_diff.hrs < 2 ? helper.primaryColor : helper.grey}]}>{`${item.closed ? 'Opens' : 'Closes'} in ${item.time_diff.hrs} Hrs ${item.time_diff.mins} mins`}</Text>}
					</View>
			   </View>
			  </TouchableNativeFeedback>
			</View>
		)
	}
}

const s = StyleSheet.create({	
	ceq:{fontSize:12,color:helper.red2,width:'90%'},
	tt2:{fontSize:14,color:helper.silver,fontWeight:'bold',width:"60%"},
	rsntChip:{width:"97%",alignSelf:"center",marginVertical:5,padding:2,backgroundColor:helper.grey4,borderRadius:5,flexDirection:"row"}
})