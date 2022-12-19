import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import Image from './image';
import helper from 'assets/helper';
import Button from './button';
import lang from 'assets/lang';
import Calender from 'libs/calender';
import {View as AniView} from 'react-native-animatable';
export default class RefItems extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,			
			title:'Rewards',
			closing:false,
			desc:'Earn',
			items:[],
			sl:-1,
			m:0
		}
		this.anims = [];
		this.callback = null;
	}
	show = (items, points, m = 0) => {			
		let sl = m == 0 ? -1 : 0;		
		if(m != 0)this.callback = m;
		this.setState({
			visible: true,
			closing: false,			
			points,
			items,			
			sl			
		});
	}
	handleClose = () => {	    
		if(this.state.closing == false){
			this.setState({closing:true})
			if(this.callback != null)this.callback(false);		    
		}else{
			return;
		}
		this.anims.forEach(anim => anim?.fadeOutDown());
		setTimeout(() => {
			this.callback = null;
			this.setState({ visible: false });
		}, 700);
	}
	slt = (sl) => {
		if(this.state.sl == -1)return;
		this.setState({sl})
	}
	done = () => {
		if(this.state.sl != -1){
			let item = this.state.items[this.state.sl];
			if(this.callback != null)this.callback(item);		
			this.callback = null;
			this.handleClose();
		}else{
			this.handleClose();
			this.props.onPress();
		}
	}
	render() {
		const {
			sl,
			points,
			items,
			visible			
		} = this.state;
		return (
			<Modal visible={visible} transparent animationType="fade" onRequestClose={this.handleClose}><TouchableWithoutFeedback onPress={this.handleClose}><View style={helper.model}>
			  <Text style={s.tt}>Rewards</Text>
			  {sl == -1 ? <Text style={s.dd}>Earn {points} Points To Claim</Text> : null}
			  {items.map((item, index) => {
			  	const backgroundColor = sl == index ? helper.pColorDisable : helper.grey2;
			  	return (
			  		<AniView ref={ref => this.anims[index] = ref} key={index} duration={900} animation="fadeInUp" style={{width:'90%',height:70,marginBottom:9}}><TouchableOpacity activeOpacity={0.7} onPress={() => this.slt(index)} style={{flexDirection:'row',alignItems:'center',height:'100%',backgroundColor,borderRadius:10}}>
					    <Image
					        sty={{height:50,width:50,backgroundColor:helper.grey,marginLeft:10}}
						    imgSty={helper.max}
						    borderRadius={100}
						    hash={item.hash}
						    source={{uri:item.image}}
					    />				     
					    <View style={s.itm}>
					     <Text style={s.itt}>{item.name}</Text>				     				    
					    </View>
				    </TouchableOpacity></AniView>
			  	)
			  })}
			  <Button text={sl != -1 ? lang.z[cl].slt : 'View Cart'} onPress={this.done} size={14} style={{marginHorizontal:5}}/> 
			</View></TouchableWithoutFeedback></Modal>
		)
	}
}

const s = StyleSheet.create({
	tt:{fontSize:16,fontWeight:'bold',marginBottom:5,color:'white'},
	dd:{fontSize:14,fontWeight:'bold',marginBottom:6,color:'white'},
	itm:{marginLeft:10},
	itt:{fontSize:20,fontWeight:'bold',marginBottom:2,color:helper.silver},		
})