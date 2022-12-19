import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	ToastAndroid,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import helper from 'assets/helper';
import { WheelPicker } from "react-native-wheel-picker-android";
import lang from 'assets/lang';
import Button from './button';
const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
function addZero (number) {
	number = parseInt(number)
	if(number < 10)return '0' + number;
	else return number.toString();
}
export default class TimeRangePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v:false,
			selectedTime:null,			
			dIhours:'00',
			dIminutes:'00',
			fromHour:0,
			fromMin:0,
			toHour:0,
			toMin:0,
			dFHr:'00',
			dMF:'',
			dTHr:'00',
			dMR:'',
			validHours:[],
			validMinutes:[],
		}
		this.callback = null;
	}	
	show = (fromHour = 0, toHour = 23, minuteDiff = 5, initHour = 0, initMin = 0) => {		
		let fromIndex = hours.indexOf(parseInt(fromHour));
		let toIndex = hours.indexOf(parseInt(toHour));
		if(fromIndex == -1 || toIndex == -1 || fromIndex >= toIndex)return;
		let hoursRange = [];
		for(let i = fromIndex; i <= toIndex; i++)hoursRange.push(addZero(hours[i]));
		for(let i = 0; i <= 60; i += minuteDiff)minutesRange.push(addZero(i));
		this.final (hoursRange, minutesRange);		
	}
	showAutoMin = (maxHour = 23, minuteDiff = 5, callback) => {				
		let currentHour = new Date().getHours() + 1;
		if(currentHour == maxHour){
			callback(false);
			return;
		}else{
			this.callback = callback;
		}
		let fromIndex = hours.indexOf(currentHour);
		let toIndex = hours.indexOf(parseInt(maxHour));		
		if(fromIndex == -1 || toIndex == -1 || fromIndex >= toIndex)return;		
		let hoursRange = [], minutesRange = [];
		for(let i = fromIndex; i <= toIndex; i++)hoursRange.push(addZero(hours[i]));
		for(let i = 0; i <= 60; i += minuteDiff)
			if(i != 60)minutesRange.push(addZero(i));
		this.final (hoursRange, minutesRange);
	}	
	onFromSelectedHour = (fromHour) => {
		this.setState({fromHour}, () => {
			this.formalizeTime()
		});
	}
	onFromSelectedMin = (fromMin) => {
		this.setState({fromMin}, () => {
			this.formalizeTime()
		});
	}
	onToSelectedHour = (toHour) => {
		this.setState({toHour}, () => {
			this.formalizeTime()
		});
	}
	onToSelectedMin = (toMin) => {
		this.setState({toMin}, () => {
			this.formalizeTime()
		});
	}
	formalizeTime = () => {				
		let {fromHour, fromMin, toHour, toMin, validMinutes, validHours} = this.state;
		let dFHr, dMF = 'PM', dTHr, dMR = 'PM';
		let wrong = false;
		if(fromHour > toHour)wrong = true;		
		if(fromHour == toHour && fromMin > toMin)wrong = true;		
		if(wrong){
			toHour = fromHour + 1;
			toMin = 0;
			this.setState({toHour, toMin})
		}
		let fromMinTime = parseInt(validMinutes[fromMin]);
		let toMinTime = parseInt(validMinutes[toMin]);
		let fromMinutes = (parseInt(validHours[toHour]) - parseInt(validHours[fromHour])) * 60;
		fromMinutes -= fromMinTime;
		fromMinutes += toMinTime;
		let h = parseInt(fromMinutes / 60);
		let m = fromMinutes - (h * 60);	

		fromHour = parseInt(validHours[fromHour]);
		toHour = parseInt(validHours[toHour]);
		fromMin = parseInt(validMinutes[fromMin]);
		toMin = parseInt(validMinutes[toMin]);
		if(fromHour > 12){
			dFHr = fromHour - 12;			
		}else if(fromHour == 12 && fromMin > 0){
			dFHr = fromHour;			
		}else {
			dFHr = fromHour;
			dMF = 'AM';
		}		
		if(toHour > 12){
			dTHr = toHour - 12;			
		}else if(toHour == 12){
			dTHr = toHour;
			
		}else {
			dTHr = toHour;
			dMR = 'AM';
		}
		this.setState({dIhours:addZero(h),dIminutes:addZero(m),dFHr:addZero(dFHr), dMF, dTHr:addZero(dTHr), dMR})
	}
	final (validHours, validMinutes) {		
		this.setState({
			validHours,
			validMinutes
		}, () => {
			this.setState({v:true})
		});
	}
	select = () => {
		let dIhours = parseInt(this.state.dIhours), dIminutes = parseInt(this.state.dIminutes);
		if(dIhours == 0 && dIminutes == 0){
			ToastAndroid.show(lang.z[cl].ntdf, ToastAndroid.SHORT);
		}else if(this.callback != null){
			let {fromHour, fromMin, toHour, toMin, validHours, validMinutes, dMF, dFHr, dTHr, dMR} = this.state;
			let fromDate = new Date();
			fromDate.setHours(parseInt(validHours[fromHour]));
			fromDate.setMinutes(parseInt(validMinutes[fromMin]));
			let toDate = new Date();
			toDate.setHours(parseInt(validHours[toHour]));
			toDate.setMinutes(parseInt(validMinutes[toMin]));			
			this.callback({
				from:parseInt(fromDate.getTime()) / 1000,
				to:parseInt(toDate.getTime()) / 1000,
				timeString:`${dFHr}:${validMinutes[fromMin]} ${dMF} - ${dTHr}:${validMinutes[toMin]} ${dMR}`,
			});
			this.hc();
		}
	}
	hc = () => {
		this.setState({v:false}, () => {		
			this.callback = null;
		})
	}
	render() {
		const {
			mode			
		} = this.props;
		const {
			dMR,
			dMF,
			dFHr,			
			dTHr,		
			toMin,
			toHour,
			dIhours,
			fromMin,
			fromHour,
			dIminutes,
			validHours,
			validMinutes,			
		} = this.state;
		return (
			<Modal visible={this.state.v} transparent onRequestClose={this.hc} animationType="fade"><TouchableWithoutFeedback onPress={this.close}>
			 <View style={helper.model}>
			    <TouchableOpacity activeOpacity={1} style={s.cont}>
			      <Text style={s.tt}>{lang.z[cl].sltr}</Text>
			      <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>			      	
			      		<Text style={s.tx}>From {dFHr}:{validMinutes[fromMin]} {dMF}</Text>
			      		<Text style={s.tx}>To {dTHr}:{validMinutes[toMin]} {dMR}</Text>
			      </View>
			      <View style={{flexDirection: 'row',justifyContent:'center',alignItems:'center'}}>
			      	 <WheelPicker
			          selectedItem={fromHour}
			          data={validHours}
			          onItemSelected={this.onFromSelectedHour}
			          indicatorColor={helper.greyw}
			          itemTextColor={helper.silver}			          
			          style={{width:'20%',height:120,marginBottom:0}}
			          selectedItemTextColor={helper.primaryColor}
			         />
			         <WheelPicker
			          selectedItem={fromMin}
			          data={validMinutes}
			          onItemSelected={this.onFromSelectedMin}
			          indicatorColor={helper.greyw}
			          itemTextColor={helper.silver}			          
			          style={{width:'20%',height:120}}
			          selectedItemTextColor={helper.primaryColor}
			         />
			         <Text style={s.tsp}>{lang.z[cl].to.toUpperCase()}</Text>
			         <WheelPicker
			          selectedItem={toHour}
			          data={validHours}
			          onItemSelected={this.onToSelectedHour}
			          indicatorColor={helper.greyw}
			          itemTextColor={helper.silver}			          
			          style={{width:'20%',height:120}}
			          selectedItemTextColor={helper.primaryColor}
			         />
			         <WheelPicker
			          selectedItem={toMin}
			          data={validMinutes}
			          onItemSelected={this.onToSelectedMin}
			          indicatorColor={helper.greyw}
			          style={{width:'20%',height:120}}
			          itemTextColor={helper.silver}
			          selectedItemTextColor={helper.primaryColor}
			         />
			      </View>			      			      
			      <Text style={s.tx}>{dIhours} Hours {dIminutes} Minutes</Text>
		          <Button
			       text={lang.z[cl].slt}
			       size={16}			       
			       onPress={this.select}
			       hr={17}		       
			      />
			    </TouchableOpacity>
			 </View>
			</TouchableWithoutFeedback></Modal>
		)
	}
}
TimeRangePicker.propTypes = {
	mode: PropTypes.string
}
TimeRangePicker.defaultProps = {
	mode: 'time'
}
const s = StyleSheet.create({
	tx:{width:'40%',fontSize:12,fontWeight:'bold',color:helper.silver,marginVertical:10,textAlign:'center'},
	tsp:{width:'20%',textAlign:'center',fontSize:14,color:helper.silver,fontWeight:'bold'},
	tt:{marginBottom:20,fontSize:18,color:helper.primaryColor,fontFamily:'sans-serif-medium'},	
	cont:{width:'90%',paddingTop:17,paddingBottom:25,elevation:20,borderRadius:10,backgroundColor:helper.grey2,justifyContent:'center',alignItems:'center'}
})