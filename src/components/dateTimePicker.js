import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableWithoutFeedback
} from 'react-native';
import helper from 'assets/helper';
import {
  TimePicker,
  DatePicker
} from "react-native-wheel-picker-android";
import lang from 'assets/lang';
import Button from './button';
export default class DateTimePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v:false,
			selectedTime:null,
			initDate:new Date(),
			hours:[]
		}
	}	
	hc = () => {
		this.setState({v:false})
	}
	show = (hrs, initDate) => {		
		let hours = [];		
		hrs.forEach(a => hours.push(a + ''));
		this.setState({hours,initDate}, () => {
			this.setState({v:true})
		})
	}
	slt = () => {		
		this.props.onTimeSelected(this.state.selectedTime)
		this.setState({v:false})
	}
	tmC = (selectedTime) => {
		this.setState({selectedTime})		            
	}
	render() {
		const {
			mode			
		} = this.props;
		const {
			hours,
			initDate
		} = this.state;
		return (
			<Modal visible={this.state.v} transparent onRequestClose={this.hc} animationType="fade">
			<TouchableWithoutFeedback onPress={this.hc}>
			 <View style={s.main}>			    
			    <TouchableWithoutFeedback><View style={s.cont}>
			      <Text style={s.tt}>Select Time</Text>			      
			      <TimePicker 
		            initDate={initDate}
		            indicatorColor={helper.greyw}
		            itemTextColor={helper.silver}
		            minutes={["00", "30"]}
		            hours={hours}
		            format24		            
		            selectedItemTextColor={helper.primaryColor}
		            onTimeSelected={this.tmC}
		          />
		          <Button
			       text={lang.z[cl].slt}
			       size={16}			       
			       onPress={this.slt}
			       hr={17}		       
			      />
			    </View></TouchableWithoutFeedback>
			 </View>
			</TouchableWithoutFeedback>
			</Modal>
		)
	}
}
DateTimePicker.propTypes = {
	mode: PropTypes.string
}
DateTimePicker.defaultProps = {
	mode: 'time'
}
const s = StyleSheet.create({
	tt:{marginBottom:20,fontSize:18,color:helper.primaryColor,fontFamily:'sans-serif-medium'},
	main:{height:'100%',width:'100%',backgroundColor:'#000000b4',justifyContent:'center',alignItems:'center'},
	cont:{width:'90%',paddingTop:17,paddingBottom:25,elevation:20,borderRadius:10,backgroundColor:helper.grey2,justifyContent:'center',alignItems:'center'}
})