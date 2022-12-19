import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback
} from 'react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Button from './button';

export default class DialogInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v:false,
			text:''			
		}
		this.callback = null;
	}	
	show = ({title, desc, placeholder, positive, negative}, callback) => {
		this.callback = callback;
		this.setState({title, desc,text:'',placeholder, positive, negative}, () => {
			this.setState({v:true});
		})
	}
	response(res){		
		this.callback(res, this.state.text);		
		this.setState({v:false}, () => {
			this.callback = null;
		});
	}
	render() {
		const {
		   v,
		   title,
		   desc,
		   placeholder,
		   text,
		   positive,
		   negative			
		} = this.state;
		return (
			<Modal visible={v} transparent onRequestClose={() => this.response(false)} animationType="fade"><TouchableWithoutFeedback onPress={() => this.response(false)}><View style={helper.model}>
			    <View style={s.cont}>
			       <Text style={s.tt}>{title}</Text>
			       <Text style={s.dd}>{desc}</Text>
			       <TextInput maxLength={320} underlineColorAndroid={helper.primaryColor} value={text} onChangeText={text => this.setState({text: text})}  multiline placeholderTextColor={helper.silver} placeholder={placeholder} style={s.inpt}/>
			       <View style={s.btm}>
			          <Button
				       text={negative}
				       size={16}
				       br={20}
				       onPress={() => this.response(false)}
				       style={{marginRight:5}}
				       hr={17}
				       bgColor={helper.greyw}
				      />
				      <Button
				       text={positive}
				       size={16}
				       br={20}
				       onPress={() => this.response(true)}
				       style={{marginRight:5}}
				       hr={17}		       
				      />
				   </View>

			    </View>
			 </View></TouchableWithoutFeedback></Modal>
		)
	}
}
const s = StyleSheet.create({
	btm:{flexDirection: 'row',justifyContent:'flex-end'},
	tt:{fontSize:18,fontWeight:'bold',color:helper.primaryColor,marginLeft:5},
	dd:{fontSize:16,color:helper.silver,marginVertical:3,marginLeft:5},
	inpt:{borderRadius:10,paddingVertical:10,color:'white',fontSize:15,marginBottom:5},
	cont:{width:'90%',padding:10,elevation:20,borderRadius:10,backgroundColor:helper.grey2}
})