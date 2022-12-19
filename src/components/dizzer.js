import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {	
	StyleSheet,
	View,
	Text
} from 'react-native';
import helper from 'assets/helper';

export default class Dizzer extends Component {
	render() {
		const {
			text,
			onPress
		} = this.props;
		return (
			<View style={s.hldr}>
			 <Text style={s.tt} onPress={onPress}>
			  {text}
			 </Text>
			</View>
		)
	}
}
Dizzer.propTypes = {
	text: PropTypes.string
}
Dizzer.defaultProps = {
	text: 'Retry'
}
const s = StyleSheet.create({
	hldr:{
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		backgroundColor: '#000000b4',
		position:'absolute'	
	},
	tt:{fontSize:17,color:helper.primaryColor}
})