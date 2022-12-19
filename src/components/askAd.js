import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableNativeFeedback
} from 'react-native';
import helper from 'assets/helper';

export default class AskAd extends Component {
	constructor(props){
		super(props);
		this.state = {
			v:false,
			address:''
		}		
	}
	cb = (change) => {		
		this.setState({v:false,address:''}, () => {
			this.props.hasChange(change)
		})
	}
	show = (address) => {
		this.setState({v:true,address})
	}
	render(){
		const {
			address
		} = this.state;
		return (
			<Modal visible={this.state.v} transparent animationType="fade"><View style={helper.model}>
			 <View style={s.d}>
			  <Text style={s.t}>Are Your Here?{'\n'}We Will Delivery Food To</Text>
			  <Text style={s.s}>"{address}"</Text>
			  <View style={s.h} />
			  <TouchableNativeFeedback onPress={() => this.cb(false)}><View style={s.b}>
				  <Text style={s.c}>Yes, I'm Here</Text>			   
			  </View></TouchableNativeFeedback>

			  <TouchableNativeFeedback style={s.b} onPress={() => this.cb(true)}><View style={s.b}>
				  <Text style={s.c}>No, Change Location</Text>
			  </View></TouchableNativeFeedback>

			 </View>
			</View></Modal>
		)
	}
}

const s = StyleSheet.create({
	t:{fontSize:15,color:helper.primaryColor,marginTop:7,fontWeight:'bold',textAlign:'center'},
	s:{fontSize:15,color:helper.white,marginTop:15,marginBottom:8,textAlign:'center'},
	d:{overflow:'hidden',width:250,borderRadius:10,backgroundColor:helper.grey4,elevation:10,justifyContent:'center',alignItems:"center"},
	b:{height:60,width:'100%',justifyContent:'center',backgroundColor:helper.grey4,alignItems:'center'},
	c:{fontSize:13.5,color:helper.silver,fontWeight:'bold'},
	h:{width:'100%',height:1,backgroundColor:helper.silver,marginBottom:4},
})