import React, {Component} from 'react';
import {
	Text,
	View
} from 'react-native';
export default class Text2 extends Component {
	render() {
		const {
			left,
			right,
			children
		} = this.props;
		const l = left == undefined ? '' : '  ';
		const r = right == undefined ? '' : ' ';
		return (
			<View style={{flexDirection:'row'}}>
			    {left === undefined ? null : left()}			    
				<Text {...this.props}>{l}{children}{r}</Text>
			    {right === undefined ? null : right()}
			</View>
		)
	}
}