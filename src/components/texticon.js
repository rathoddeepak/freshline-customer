import React, { Component } from 'react';
import {
	View,
	Text
} from 'react-native';
import Icon from './icon';

export default class TextIcon extends Component {
	render() {
		const {
			icon,
			size,
			text,
			color,
			style,
			cstyle
		} = this.props;
		return (
			<View style={[{flexDirection: 'row'}, cstyle]}>
				<Icon name={icon} color={color} size={size + 4} />				
				<Text style={[{color,fontSize:size,marginLeft:5}, style]}>{text}</Text>				
			</View>
		)
	}
}

TextIcon.defaultProps = {
	cstyle:{}
}