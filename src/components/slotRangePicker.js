import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Modal,
	ScrollView,
	StyleSheet,
	ToastAndroid,
	TouchableOpacity	
} from 'react-native';
import helper from 'assets/helper';
import Icon from './icon';
import SButton from './sButton';
import lang from 'assets/lang';
import Button from './button';
function addZero (number) {
	number = parseInt(number)
	if(number < 10)return '0' + number;
	else return number.toString();
}
export default class SlotRangePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v:false,
			fslots:[],
			tslots:[],
			from_slt:-1,
			to_slt:-1
		}
		this.fromSlt = [];
		this.toSlt = [];
		this.callback = null;
	}
	
	show = ({slots, from_slt, to_slt}, cb) => {
	    this.callback = cb;	
		let currentSlot = slots[0];
		let fslots = JSON.parse(JSON.stringify(slots)); 
		fslots.splice(slots.length - 1, 1)		
		let tslots = JSON.parse(JSON.stringify(slots));
		tslots.splice(0, 1);		
		this.setState({slots,fslots:fslots,tslots,v:true}, () => {
			if(from_slt != -1 && to_slt != -1){
				let fromIdx = fslots.findIndex(item => item.id === from_slt);
				let toIdx = tslots.findIndex(item => item.id === to_slt);
				this.toSlt[toIdx].act(true)
				this.fromSlt[fromIdx].act(true);
				this.setState({from_slt:fromIdx,to_slt:toIdx})		
			}
		});
	}
	
	selectFrom = (from_slt) => {		
	    this.fromSlt[this.state.from_slt]?.act(false);
		this.setState({from_slt})
		let currentSlot = this.state.slots[from_slt];
		let tempSlot = this.state.slots;
		let tslots = tempSlot.filter(data => data.sorter > currentSlot.sorter);
		this.toSlt[this.state.to_slt]?.act(false);
		this.setState({tslots,to_slt:-1});
	}

	selectTo = (to_slt) => {
		this.toSlt[this.state.to_slt]?.act(false);
		this.setState({to_slt});
	}

	select = () => {
		let from_slt = this.state.from_slt;
		let to_slt = this.state.to_slt;		
		if(from_slt == -1){
			ToastAndroid.show(lang.z[cl].psft, ToastAndroid.SHORT);
		}else if(to_slt == -1){
			ToastAndroid.show(lang.z[cl].pstt, ToastAndroid.SHORT);
		}else{
			let fromSlot = this.state.fslots[from_slt];
			let toSlot = this.state.tslots[to_slt];			
			let date = new Date();
			let from_time = Date.parse(`${addZero(date.getMonth() + 1)}/${addZero(date.getDate())}/${date.getFullYear()} ${addZero(fromSlot.time24)}:${addZero(fromSlot.timemin)}:00`) / 1000;
			let to_time = Date.parse(`${addZero(date.getMonth() + 1)}/${addZero(date.getDate())}/${date.getFullYear()} ${addZero(toSlot.time24)}:${addZero(toSlot.timemin)}:00`) / 1000;

			const hr12 = fromSlot.time24 - 12;
			const time24 = fromSlot.apm == "PM" ? addZero(parseInt(hr12 == 0 ? 12 : hr12)) : addZero(fromSlot.time24);
			const timemin = addZero(fromSlot.timemin);			

			const hr122 = toSlot.time24 - 12;
			const time242 = toSlot.apm == "PM" ? addZero(parseInt(hr122 == 0 ? 12 : hr122)) : addZero(toSlot.time24);
			const timemin2 = addZero(toSlot.timemin);			

			const timeString = `${time24}:${timemin} ${fromSlot.apm} to ${time242}:${timemin2} ${toSlot.apm}`;

			if(this.callback != null){				
				this.callback({
					from_slt:fromSlot.id,
					to_slt:toSlot.id,
					from_time,
					to_time,
					timeString
				});
				this.setState({v:false}, () => {
					this.callback = null
				})
			}
		}
	}

	hc = () => {
		this.callback = null;
		this.setState({v:false});
	}

	render() {
		const {
			v,
			fslots,
			tslots
		} = this.state;
		return (
		<Modal visible={this.state.v} transparent onRequestClose={this.hc} animationType="fade">
			 <View style={helper.model} >
			    <View activeOpacity={1} style={s.cont}>
			      <Text style={s.tt}>{lang.z[cl].sltr}</Text>
			      
			      <Text style={s.ttr}>{lang.z[cl].frm}</Text>
			      <View style={{justifyContent:'space-between',width:'95%'}}>			      	
				      <ScrollView horizontal>
				        {fslots.map((data, index) => {
				        	const hr12 = data.time24 - 12;
							const full = data.remaining == 0;
							const left = data.booked > 0 ? data.remaining : false;
				        	const time24 = data.apm == "PM" ? addZero(parseInt(hr12 == 0 ? 12 : hr12)) : addZero(data.time24);
				        	const timemin = addZero(data.timemin);
				        	return (
				        		<View>
									<SButton
									toggle={false}
									key={data.id}
									disabled={full}
									ref={ref => this.fromSlt[index] = ref }
									text={`${time24}:${timemin} ${data.apm}`}
									style={{margin:10,minWidth:40,height:40}}
									onPress={() => this.selectFrom(index)}
									/>
									{full ? <View style={s.vgr}>
										<Text style={s.pbo}>Full</Text>
									</View> : left ? <View style={[s.vgr, {backgroundColor:'#689f38'}]}>
										<Text style={s.pbo}>{left} Left</Text>
									</View> : null}
								</View>
				        	)
				        })}
				      </ScrollView> 
			      </View>

			      <Text style={s.ttr}>{lang.z[cl].to}</Text>
			      <View style={{justifyContent:'space-between',width:'95%'}}>			      	
				      <ScrollView horizontal>
				        {tslots.map((data, index) => {
				        	const hr12 = data.time24 - 12;
							const full = data.remaining == 0;
							const left = data.booked > 0 ? data.remaining : false;
				        	const time24 = data.apm == "PM" ? addZero(parseInt(hr12 == 0 ? 12 : hr12)) : addZero(data.time24);
				        	const timemin = addZero(data.timemin);							
				        	return (
				        		<View>
									<SButton
									toggle={false}
									key={data.id}
									disabled={full}
									ref={ref => this.toSlt[index] = ref }
									text={`${time24}:${timemin} ${data.apm}`}
									style={{margin:10,minWidth:40,height:40}}
									onPress={() => this.selectTo(index)}
									/>
									{full ? <View style={s.vgr}>
										<Text style={s.pbo}>Full</Text>
									</View> : left ? <View style={[s.vgr, {backgroundColor:'#43a047'}]}>
										<Text style={s.pbo}>{left} Left</Text>
									</View> : null}
								</View>
				        	)
				        })}
				      </ScrollView> 
			      </View>

		          <Button
			       text={lang.z[cl].slt}
			       size={16}
			       style={{marginTop:10}}	       
			       onPress={this.select}
			       hr={17}		       
			      />

				  <TouchableOpacity onPress={this.hc} style={{position:'absolute',backgroundColor:helper.grey,elevation:10,borderRadius:100,width:30,height:30,justifyContent:'center',alignItems:'center',top:3,right:3}}>
					  <Icon name="close" size={19} color={helper.white} />
				  </TouchableOpacity>

			    </View>
			 </View>
			</Modal>
		)
	}
}
const s = StyleSheet.create({		
	tt:{marginBottom:20,fontSize:18,color:helper.primaryColor,fontFamily:'sans-serif-medium'},	
	ttr:{fontWeight:'bold',fontSize:18,color:helper.silver},
	pbo:{fontSize:10,fontWeight:'bold',color:helper.white},
	vge:{position:'absolute',backgroundColor:helper.grey,elevation:10,borderRadius:100,width:30,height:30,justifyContent:'center',alignItems:'center',top:3,right:3},
	vgr:{position:'absolute',top:0,right:0,backgroundColor:helper.red,borderRadius:20,paddingVertical:3,paddingHorizontal:5,elevation:10,zIndex:100},
	cont:{width:'90%',paddingTop:17,paddingBottom:25,elevation:20,borderRadius:10,backgroundColor:helper.grey2,justifyContent:'center',alignItems:'center'}
})