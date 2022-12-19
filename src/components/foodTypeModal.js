import React, {Component} from 'react';
import {
	Modal,
	View,
	Text,
	StyleSheet,
	LayoutAnimation,
	UIManager,
	Platform,
	TouchableNativeFeedback
} from 'react-native';
import helper from 'assets/helper';
import TypePicker from './typepicker'
const text = ['Both Veg & Non Veg', 'Only Pure Veg', 'Only Non Veg'];
export default class FoodTypeModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			v:false,			
			current:0,
			force:false
		}
	}
	show = (current, force = false) => this.setState({v:true,current,force})
	select = (current) => this.setState({current});
	hdlFdType = () => {
		this.setState({v:false}, () => {
			this.props.onSelect(this.state.current, this.state.force)
		})
	};
	close = () => {
		if(this.state.force == false){
			this.setState({v:false})
		}
	}
	render(){
		const {
			v,			
			current
		} = this.state;
		const context = text[current];		
		return (
			<Modal visible={v} onRequestClose={this.close} animationType="fade" transparent><View style={helper.model}>
			 <View style={s.cnt}>
			  <Text style={s.hk}>Show Me <Text style={{color:helper.silver,fontWeight:'bold'}}>{context}</Text> Hotels</Text>
			  <TypePicker initial={current} onSelect={this.select} />
			  <TouchableNativeFeedback onPress={this.hdlFdType}><View style={{width:'100%',height:45,alignSelf:'center',borderRadius:5,backgroundColor:helper.primaryColor,justifyContent:'center',alignItems:'center'}}>
			   <Text style={s.nl}>SUBMIT</Text>
			  </View></TouchableNativeFeedback>
			 </View>
			</View></Modal>
		)
	}
}

const s = StyleSheet.create({
	hk:{fontSize:20,color:helper.primaryColor,fontFamily:'sans-serif-medium',marginBottom:20},
	nl:{fontSize:20,color:helper.grey6,fontFamily:'sans-serif-medium'},
	cnt:{width:'90%',padding:10,backgroundColor:helper.grey4,borderRadius:10,elevation:10}
})