import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	TouchableOpacity
} from 'react-native';
import helper from 'assets/helper';
import {
  WheelPicker
} from "react-native-wheel-picker-android";
import lang from 'assets/lang';
import Button from './button';
export default class Picker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v:false,
			selected:0,
			data:[]
		}
		this.callbackInstance = null;	
	}	
	hc = () => {
		this.setState({v:false})
	}
	show = (callbackInstance) => {		    
		if(this.state.data.length == 0)return;
		this.callbackInstance = callbackInstance;
		this.setState({v:true});
	}
	setForNumeric = (from, to) => {		
		let data = [];
		for(let i = from; i <= to; i++)data.push(i.toString());		
		this.setState({data})
	}
	setForValues = (data) => {
		this.setState({data})
	}
	slt = () => {		
		if(this.callbackInstance != null)
			this.callbackInstance(this.state.data[this.state.selected], this.state.selected);
		this.setState({v:false})
	}	
	onItemSelected = (selected) => {
		this.setState({selected})
	}
	render() {
		const {
			selectedItem,
			data,			
			v
		} = this.state;
		return (
			<Modal visible={v} transparent onRequestClose={this.hc} animationType="fade"><TouchableWithoutFeedback onPress={this.hc}>
			 <View style={s.main}>			    
			    <TouchableOpacity activeOpacity={1} style={s.cont}>
			      <Text style={s.tt}>{this.props.title}</Text>
			        <WheelPicker
			          selectedItem={selectedItem}
			          data={data}
			          onItemSelected={this.onItemSelected}
			          indicatorColor={helper.greyw}
			          itemTextColor={helper.silver}
			          selectedItemTextColor={helper.primaryColor}
			        />
		          <Button
			       text={lang.z[cl].slt}
			       size={16}			       
			       onPress={this.slt}
			       hr={17}		       
			      />
			    </TouchableOpacity>
			 </View>
			</TouchableWithoutFeedback></Modal>
		)
	}
}
Picker.propTypes = {
	values: PropTypes.array
}
Picker.defaultProps = {
	values: []
}
const s = StyleSheet.create({
	tt:{marginBottom:20,fontSize:18,color:helper.primaryColor,fontFamily:'sans-serif-medium'},
	main:{height:'100%',width:'100%',backgroundColor:'#000000b4',justifyContent:'center',alignItems:'center'},
	cont:{width:'90%',paddingTop:17,paddingBottom:25,elevation:20,borderRadius:10,backgroundColor:helper.grey2,justifyContent:'center',alignItems:'center'}
})