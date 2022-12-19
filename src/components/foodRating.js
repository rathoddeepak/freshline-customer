import React, { Component } from 'react';
import {
	View,
	Text
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from './icon';
import helper from 'assets/helper';
import lang from 'assets/lang';
export default class FoodRating extends Component {
	render() {
		const {
			style,
			verified,
			rating,
			fontSize
		} = this.props;
		const color = verified ? helper.primaryColor : helper.silver;
		const text = verified ? ' '+lang.z[cl].aprd : lang.z[cl].rtng;		
		return (
			<View style={[{marginLeft:13,flexDirection:'row'}, style]}>
			  {verified ? <Icon size={15} style={{marginTop:2}} name={lang.vrfd} color={color}/> : null}
			  <Text style={{color,fontSize,fontWeight:'bold'}}>{text} | {rating}</Text>
			</View>
		)
	}
}

FoodRating.defaultProps = {
	fontSize:14,
	rating:'Not Available',
	style:{},
	verified:false
}

FoodRating.propTypes = {
	fontSize:PropTypes.number,
	rating:PropTypes.string,
	style:PropTypes.object,
	verified:PropTypes.bool
}
