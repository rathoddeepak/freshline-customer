import React, { Component } from 'react';
import {
	View,
	Text
} from 'react-native';
import Icon from './icon';
import helper from 'assets/helper';
import lang from 'assets/lang';
export default class RstrntRating extends Component {
	render() {
		const {
			style,
			verified,
			rating
		} = this.props;
		const color = verified ? helper.primaryColor : helper.silver;
		const text = verified ? ' '+lang.z[cl].aprd : lang.z[cl].rtng;
		return (
			<View style={[{paddingVertical:3,paddingHorizontal:5,backgroundColor:'#000000b4',borderRadius:9,flexDirection:'row'}, style]}>
			  {verified ? <Icon size={13} style={{marginTop:2}} name={lang.vrfd} color={color}/> : null}
			  <Text style={{color,fontSize:12,fontWeight:'bold'}}>{text} | {rating}</Text>
			</View>
		)
	}
}