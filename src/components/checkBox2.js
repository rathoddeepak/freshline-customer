import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Pressable,
	View,
	Animated
} from 'react-native';
import Icon from './icon';
import lang from 'assets/lang';
import helper from 'assets/helper';
const AniIcon = Animated.createAnimatedComponent(Icon);
const border = '#757575';
export default class Checkbox2 extends Component {	
	constructor(props){
		super(props);
		this.state = {
			animation:false,
			checked:false,
			centerScale:new Animated.Value(0),
			iconScale:new Animated.Value(1)
		}		
	}
	componentDidMount() {
		let checked = this.props.checked;
		this.state.centerScale.setValue(checked ? 0 : 1);
		this.state.iconScale.setValue(checked ? 1 : 0);
	}
	handlePress = (callback = true) => {	
	    let checked = !this.state.checked;	
		this.setState({checked}, () => {
			if(this.props.onChange && callback)
				this.props.onChange(checked);
			Animated.parallel([
				Animated.timing(this.state.centerScale, {
					toValue:checked ? 0 : 1,
					duration:400,
					useNativeDriver:true
				}),
				Animated.spring(this.state.iconScale, {
					toValue:checked ? 1 : 0,					
					useNativeDriver:true
				})
			]).start();
		})	
	}
	setValue = (value) => {	
	   if(this.state.value == this.state.checked)return;
	   this.handlePress(false);
	}
	render() {
		const {
			size,
			style,
			color
		} = this.props;		
		const ick = size/1.8;
		return (
			<Pressable onPress={this.handlePress}><Animated.View style={{borderRadius:100,backgroundColor:color,justifyContent:'center',alignItems:'center',width:size,height:size}}>
			 <Animated.View style={{borderRadius:100,backgroundColor:'#423F37',width:size - 5,height:size - 5, transform:[
			 {scale:this.state.centerScale}
			 ]}} />
			 <AniIcon size={ick} name={lang.chk} style={{position:'absolute',transform:[
			 {scale:this.state.iconScale}
			 ]}} />
			</Animated.View></Pressable>
		)
	}
}

Checkbox2.propTypes = {
	size: PropTypes.number,
	color: PropTypes.string,
	borderColor: PropTypes.string,
	style: PropTypes.object,
	selected: PropTypes.bool
}

Checkbox2.defaultProps = {
	size:40,
	borderColor:border,
	color:helper.primaryColor,
	style:{},
	selected:false
}