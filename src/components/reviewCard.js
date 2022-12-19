import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Image,
	StyleSheet
} from 'react-native';
import HeuButton from './HeuButton/';
import Icon from './icon';
import helper from 'assets/helper';
import lang from 'assets/lang';
const star = require('assets/icons/star.png');
export default class ReviewCard extends Component {
	delete = () => {

	}
	render() {
		const {
			id,
			name,
			time,
			text,
			rating,			
		} = this.props.data;
		const my_id = this.props.data.user_id;			
		return (
			<View style={s.hldr}>
			 <Text style={s.tt}>{name}</Text>
			 <View style={helper.row}>
			  <Text style={s.dd}>{time} • {rating}.0  </Text>
			  <Stars rating={rating} />
			 </View>
			 <Text style={s.dd}>{text}</Text>
			 {my_id == user_id ?
			 	<View style={{width:30,height:30,position:'absolute',top:5,right:5}}>
			 		<HeuButton onPress={this.props.onDelete} style={{height:30,width:30,justifyContent:'center',alignItems:'center',borderRadius:60,backgroundColor:helper.grey6}}>
			 		 <Icon name={lang.trh} color={helper.white}  size={17}/>
			 		</HeuButton>
			 	</View>
			 : null}
			</View>
		)
	}
}

class Stars extends Component {
	render() {
		const rating = this.props.rating;
		return (
			<View style={{width:90,flexDirection:'row',justifyContent:'space-around'}}>
			 {[1,2,3,4,5].map((s) =>
			 	<Image key={s} source={star} style={{width:15,height:15}} tintColor={s > rating ? helper.grey : helper.primaryColor}/>
			 )}
			</View>
		)
	}
}
const s = StyleSheet.create({
	hldr:{width:'100%',marginVertical:6,padding:10},
	tt:{fontWeight:'bold',color:helper.silver,marginBottom:4,fontSize:15},	
	dd:{color:helper.silver,marginBottom:4,fontSize:13}	
})