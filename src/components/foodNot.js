import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View
} from 'react-native';

export default class FoodNot extends Component {
	render() {
		const {
			size,
			veg,
			top,
			left,
			right,
			bottom
		} = this.props;
		const position = {};
		if(top > 0){position['top'] = top}
		if(left > 0){position['left'] = left}
		if(right > 0){position['right'] = right}
		if(bottom > 0){position['bottom'] = bottom}
		const color = parseInt(veg) == 0 ? '#007c01' : '#cd0000';
	    const size2 = size - 8;
		return (
			<View style={[{width:size,position:'absolute',borderRadius:2,justifyContent:'center',alignItems:'center',height:size, backgroundColor:'white', borderWidth:2.4,borderColor:color}, position]}>
			 <View style={{borderRadius:100,width:size2,height:size2,backgroundColor:color}} />
			</View>
		)
	}
}

FoodNot.propTypes = {
	size:PropTypes.number,
	veg:PropTypes.number | PropTypes.string,
	top:PropTypes.number,
	left:PropTypes.number,
	right:PropTypes.number,
	bottom:PropTypes.number
}

FoodNot.defaultProps = {
	size:20,
	veg:0,
	top:0,
	left:0,
	right:0,
	bottom:0
}