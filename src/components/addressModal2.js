import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Modal,
	ToastAndroid
} from 'react-native';
import Icon from './icon';
import helper from 'assets/helper';
import addressController from 'libs/address';
import Address from 'screens/addresses';
import lang from 'assets/lang';
export default class AddressModal2 extends Component {
	constructor(props){
		super(props);
		this.state = {			
			visible:false
		}
		this.cb = null;
	}	
	chngAdd = () => {
	    const address = addressController.getCurrentAddress();
	    console.log(address)
	    if(address != null){
	    	this.setState({visible:false});
			if(this.cb != null)this.cb(true, true);
	    }else{	    	
	    	//this.setState({visible:false});
	    }	
	}
	show = (c) => {
		this.cb = c;
		this.setState({visible:true})
	}
	close = () => {
		if(this.props.dNForce == true) {
			this.setState({visible:false})
		}else{
			ToastAndroid.show(lang.z[cl].pls +' '+ lang.z[cl].sltad, ToastAndroid.SHORT);
		}		
	}
	render(){
		const {		
			visible
		} = this.state;
		return (		
			 <Modal onRequestClose={this.close} visible={visible} transparent animationType="slide">
			  <View style={{flex: 1,backgroundColor:'#00000099',justifyContent:'flex-end'}}><View style={{width:'100%',height:'80%'}}>
			   <Address isModal={true} onSelect={this.chngAdd} />
			  </View></View>
			 </Modal>			
		)
	}
}