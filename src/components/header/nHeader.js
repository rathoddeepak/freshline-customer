import React, { Component } from 'react';
import {
	View,
	Text,
	ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import HeuButton from '../HeuButton/';
import Icon from '../icon';
import helper from 'assets/helper';
import lang from 'assets/lang';
export default class NHeader extends Component {	
	render() {
		const {
			title,
			color,
			fontSize,
			onPressBack,
			loading
		} = this.props;
		return (
			<View style={{flexDirection: 'row',height:50,width:'100%',backgroundColor:helper.primaryColor,elevation:24}}>
			 <HeuButton onPress={onPressBack} style={{height:50,width:50,justifyContent:'center',alignItems:'center'}}>
			  <Icon name={lang.arwbck} color={color} size={28} />
			 </HeuButton>
			 <View style={{height:50,justifyContent:'center',maxWidth:250}}>
			  <Text numberOfLines={1} style={{fontSize,color,fontFamily:'sans-serif-medium'}}>{title}</Text>
			 </View>

			 {loading == true ?
			 	<View style={{width:40,height:50,justifyContent:'center',alignItems:'center',position:'absolute',top:0,right:0}}>
			 	 <ActivityIndicator color={helper.white} size={30} />
			 	</View>
			 : null}

			</View>
		)
	}
}

NHeader.defaultProps = {
	color:helper.white,
	fontSize:21
}

NHeader.propTypes = {
	color:PropTypes.string,
	fontSize:PropTypes.number
}