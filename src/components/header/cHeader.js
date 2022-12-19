import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Image,
	StyleSheet,
	Pressable,
	ActivityIndicator
} from 'react-native';
import Icon from '../icon';
import helper from 'assets/helper';
import store from 'assets/store';
import lang from 'assets/lang';
export default class CHeader extends Component {
	render() {
		const {text, renderLeft, loading} = this.props;
		return (			
			<View style={s.header}>
			 <View style={s.logoHolder}>
				 <Text style={s.title}>{text}</Text>
			 </View>
			 
			 <Pressable style={s.lastHold} onPress={this.props.onLeftPress}>
			  {renderLeft == null ? null : (renderLeft ? renderLeft() : <>
			  	  <View style={s.icon}>
				   <Icon name={lang.pin} size={22} color={helper.white} />
				  </View>
				  <Text numberOfLines={1} style={s.loc}>Pakrshanvi, Latur</Text>
				  </>
			  )}			  

			 </Pressable>

			 {loading == true ?
			 	<View style={{width:40,height:55,justifyContent:'center',alignItems:'center',position:'absolute',top:0,right:0}}>
			 	 <ActivityIndicator color={helper.white} size={30} />
			 	</View>
			 : null}

			</View>
		)
	}
}

const s = StyleSheet.create({
	header:{
		height:55,
		width:'100%',
		backgroundColor:helper.primaryColor,
		flexDirection:'row',
		elevation:24
	},
	logoHolder:{
		height:'100%',
		justifyContent:'center'		
	},
	lastHold:{
		position:'absolute',
		right:0,	
		height:'100%',
		flexDirection:'row',		
		justifyContent:'space-around',
		alignItems:'center'
	},
	icon:{
		width:22,
		height:22
	},
	loc:{
		fontSize:15,
		fontWeight:'bold',
		marginHorizontal:5,
		maxWidth:120,
		color:helper.primaryColor
	},
	title:{
		fontSize:22,
		color:helper.white,
		marginLeft:7,
		width:150
	}
})