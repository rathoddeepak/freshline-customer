import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Modal,
	StyleSheet
} from 'react-native';
import Image from './image';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Calender from 'libs/calender';
import {View as AniView} from 'react-native-animatable';
export default class MessTBView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			foods:[],
			title:'',
			closing:false,
			desc:''
		}
		this.anims = [];
	}
	show = (details, timeTable = true) => {		
		const {
			time,
			date,
			month,
			foodTime,
			foods
		} = details;
		let title = '';
		if(timeTable)title = Calender.messTime(time);
		else title = `${Calender.messTime(time)} | ${date} ${Calender.getMonth(month)}`;
		this.setState({
			visible: true,
			title,
			desc:Calender.messClockTime(time),
			foods
		});
	}
	handleClose = () => {
		if(this.state.closing == false)this.setState({closing:true})
		else return;
		this.anims.forEach(anim => anim?.fadeOutDown());
		setTimeout(() => this.setState({ visible: false }), 1000)				
	}
	render() {
		const {
			desc,
			title,
			foods,
			visible			
		} = this.state;
		return (
			<Modal visible={visible} transparent animationType="fade" onRequestClose={this.handleClose}><View style={helper.model}>
			  <Text style={s.tt}>{title}</Text>
			  <Text style={s.dd}>{desc}</Text>
			  {foods.map((item, index) => 
			  	<AniView ref={ref => this.anims[index] = ref} duration={900} animation="fadeInUp" style={{width:'90%',height:100,marginBottom:9,flexDirection:'row',alignItems:'center',backgroundColor:helper.grey2,borderRadius:10}}>
				     <Image
				        sty={{height:80,width:80,backgroundColor:helper.grey,marginLeft:10}}
					    imgSty={helper.max}
					    borderRadius={100}
					    hash={'LEHV6nWB2yk8pyo0adR*.7kCMdnj'}
					    source={{uri:item.image}}
				     />
				     <View style={{position: 'absolute', top:10,left:70,height:25,width:25,justifyContent:'center',alignItems:'center',borderRadius:60,elevation:10,backgroundColor:helper.primaryColor}}>
				      <Text style={[s.itt, {color:'#fff'}]}>1</Text> 
				     </View>
				    <View style={s.itm}>
				     <Text style={s.itt}>{item.name}</Text>
				     <Text style={s.idd}>Served In Bowl</Text>
				     <Text style={s.idd}>{`${lang.rp}${item.amount}`} <Text style={s.idc}>{`${lang.rp}${item.amount}`}</Text></Text>
				    </View>
				 </AniView>
			  )}			  
			</View></Modal>
		)
	}
}

const s = StyleSheet.create({
	tt:{fontSize:16,fontWeight:'bold',marginBottom:5,color:'white'},
	dd:{fontSize:14,fontWeight:'bold',marginBottom:6,color:'white'},
	itm:{marginLeft:10},
	itt:{fontSize:16,fontWeight:'bold',marginBottom:2,color:helper.silver},
	idd:{fontSize:14,color:helper.silver},
	idc:{textDecorationLine: 'line-through',color:helper.greyw}
})