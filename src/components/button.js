import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text,TouchableOpacity} from 'react-native';
import helper from 'assets/helper';
import HeuButton from './HeuButton/';
export default class Button extends Component {
	render(){
		const {onPress,size,style,vr,hr,br,bgColor,color,disabled} = this.props;
		return (
			<HeuButton disabled={disabled} onPress={onPress} style={[{paddingVertical:vr,paddingHorizontal:hr,borderRadius:br,backgroundColor:bgColor,opacity:disabled ? 0.4 : 1 }, style]}>
			 <Text numberOfLines={1} style={{width:'100%',fontSize:size,color,textAlign:'center'}}>{this.props.text}</Text>
			</HeuButton>
		)
	}
}

Button.defaultProps = {
	size:14,
	style:{},
	vr:4,
	br:7,
	hr:7,
	disabled:false,
	bgColor:helper.primaryColor,
	color:helper.white
}

Button.propTypes = {
	size:PropTypes.number,
	vr:PropTypes.number,
	hr:PropTypes.number,
	br:PropTypes.number,
	style:PropTypes.object,
	disabled:PropTypes.bool,
	bgColor:PropTypes.string,
	color:PropTypes.string
}
