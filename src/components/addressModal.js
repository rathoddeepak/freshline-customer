import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Modal,
	Text,
	StyleSheet
} from 'react-native';
import Icon from './icon';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import helper from 'assets/helper';
import lang from 'assets/lang';
import addressController from 'libs/address';
import Address from 'screens/addresses';
export default class AddressModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			cl_address:'',
			id:0,
			visible:false
		}
	}
	dispatch = (address) => {
		if(address == undefined){
			this.show();
		}else{
			this.chngAdd(address, false)
		}
	}
	chngAdd = (address, cb = true) => {
		const {cl_address, id} = address;
		this.setState({visible:false,cl_address,id, address}, () => {
			if(cb)this.props.onReceive(id);
		})
	}
	show = () => {
		this.setState({visible:true})
	}
	render(){
		const {
			cl_address,
			visible
		} = this.state;
		const backgroundColor = this.props.backgroundColor;
		return (
			<View>
			 <TouchableNativeFeedback onPress={this.show}><View style={[s.main, {backgroundColor}]}>
				 <Icon name={lang.pin} size={15} color={helper.white} style={s.ic}/>
				 <Text style={s.tc}>{cl_address}</Text>
				 <Icon name={lang.cvd} size={15} color={helper.white} style={s.ic}/>
			 </View></TouchableNativeFeedback>
			 <Modal onRequestClose={() => this.setState({visible: false})} visible={visible} transparent animationType="slide">
			  <View style={{flex: 1,backgroundColor:'#00000099',justifyContent:'flex-end'}}><View style={{width:'100%',height:'80%'}}>
			   <Address
			    isModal={true}
			    onSelect={this.chngAdd}
			   />
			  </View></View>
			 </Modal>
			</View>
		)
	}
}

AddressModal.defaultProps = {
	backgroundColor:helper.faintColor
}

const s = StyleSheet.create({
	main:{
		height:50,
		width:'100%',
		flexDirection:'row',
		alignItems:'center',
		elevation:24
	},
	ic:{
		marginHorizontal:4
	},
	tc:{
		fontSize:14,
		flex:1,
		color:helper.white
	}
})