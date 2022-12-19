import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	TouchableNativeFeedback,
	StyleSheet
} from 'react-native';
import helper from 'assets/helper';

export default class ReasonStop extends Component {
	constructor(props){
		super(props)
		this.state = {
			itemName:'',
			title:'',
			desc:'',
			v:false
		}
	}
	show = ({data, outStock, addonOutStock}) => {		
		let itemName = data.name;
		let title = '';
		let desc = '';
		if(outStock){
			title = "Is Out Of Stock";
			desc = "You Need To Remove Item To Proceed Or Wait For Item, To Come In Stock, Or You Can Check Another Restaurant For Same Food";
		}else if(addonOutStock){
			title = "Addon Is Out Of Stock";
			desc = "Just Press On Reset Button, To Add Food Item Again, Because Addon Selected With Food Item Are Not In Stock";
		}
		this.setState({v:true, title, desc, itemName});
	}
	show2 = ({vendor, food}) => {		
		let itemName = 'Hotel Closed';
		let title = '';
		let desc = '';
		if(vendor){
			title = "Ohh! Hotel Closed";
			desc = "We Are Extremly Sorry For That, Please Look For Another Hotel!";
		}else if(food){
			itemName = 'Food Out Of Stock';
			title = "Ohh! Food Just Went Out Of Stock";
			desc = "We Are Extremly Sorry For That 😔";
		}
		this.setState({v:true, title, desc, itemName});
	}
	c = () => {
		this.setState({v:false})
	}
	render () {
		return (
			<Modal visible={this.state.v} onRequestClose={this.c} transparent animationType="fade"><View style={helper.model}><View style={{width:250,padding:5,backgroundColor:helper.grey4,borderRadius:10,elevation:10,justifyContent:'center',alignItems:'center'}}>			  
			  <View style={{width:'90%'}}>
			  	<Text style={{fontSize:20,color:helper.primaryColor,fontWeight:'bold',marginVertical:10}}>{this.state.itemName}</Text>
			  	<Text style={{fontSize:16,color:helper.silver,fontWeight:'bold',marginVertical:10}}>{this.state.title}</Text>
			  	<Text style={{fontSize:14,color:helper.primaryColor,marginVertical:10}}>{this.state.desc}</Text>
			  </View>
		      <TouchableNativeFeedback onPress={() => this.setState({v:false})}><View style={{width:'90%',backgroundColor:helper.primaryColor,borderRadius:5,height:40,marginBottom:10,justifyContent:'center',alignItems:'center'}}>
		       <Text style={{fontSize:20,color:helper.white,fontWeight:'bold'}}>OK</Text>
		      </View></TouchableNativeFeedback>
			</View></View></Modal>
		)
	}
}