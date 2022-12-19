import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text,TouchableOpacity} from 'react-native';
import Icon from './icon';
import helper from 'assets/helper';
import HeuButton from './HeuButton/';
export default class ButtonIcon extends Component {
	render(){
		const {onPress,size,icon,style,vr,hr,br,bgColor,color} = this.props;
		return (
			<HeuButton onPress={onPress} style={[{paddingVertical:vr,paddingHorizontal:hr,borderRadius:br,backgroundColor:bgColor,flexDirection:'row',alignItems:'center'}, style]}>
			 <Icon name={icon} color={color} size={size + 7} />
			 <Text numberOfLines={1} style={{fontSize:size,color,fontWeight:'bold',marginLeft:4}}>{this.props.text}</Text>
			</HeuButton>
		)
	}
}

ButtonIcon.defaultProps = {
	size:14,
	style:{},
	vr:4,
	br:7,
	hr:7,
	bgColor:helper.primaryColor,
	color:helper.white,
	icon:'home',
}

ButtonIcon.propTypes = {
	size:PropTypes.number,
	vr:PropTypes.number,
	hr:PropTypes.number,
	br:PropTypes.number,
	style:PropTypes.object,
	bgColor:PropTypes.string,
	icon:PropTypes.string,
	color:PropTypes.string
}
