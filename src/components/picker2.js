import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableNativeFeedback
} from 'react-native';
import helper from 'assets/helper';
export default class Picker2 extends Component {
	constructor(props){
	  super(props);	
	  this.state = {
	    values:[],
	    title:'',
	    subtitle:'',
	    v:false
	  },
	  this.callback = null;
	}
	show = ({values, title, subtitle, onSelection}) => {
		this.callback = onSelection;
		this.setState({v:true,values,title,subtitle})
	}
	optPress = (option) => {
		this.setState({v:false}, () => {
			if(this.callback != null){
				this.callback(option.value);
				this.callback = null;
			}
		})
	}
	close = () => this.setState({v:false}, () => {
		this.callback(false);
		this.callback = null;
	})
	render(){
	  const {
	  	values, 
	  	title,
	  	subtitle,
	  	v
	  } = this.state;
	  return (
	    <Modal onRequestClose={this.close} visible={v} transparent animationType="fade"><View style={helper.model}>
		     <View style={s.dailog}>
			      <Text style={s.tt}>{title}</Text>
			      <Text style={s.dd}>{subtitle}</Text>
			      {values.map((opt, i) => {
			      	const color = getColor(opt.type);
			      	return (<TouchableNativeFeedback key={i} onPress={() => this.optPress(opt)}><View style={s.opt}>
			      	 <Text style={[s.dd, {color,marginBottom:0}]}>{opt.value}</Text>
			      	</View></TouchableNativeFeedback>)
			      })}
		     </View>
	    </View></Modal>
	  )
	}
}

function getColor(type){
	if(type == 2){
		return helper.red;
	}else if(type == 1){
		return helper.green;
	}else {
		return helper.silver
	}
}

const s = StyleSheet.create({
	dailog:{borderRadius:10,elevation:10,width:260,backgroundColor:helper.grey4},
	tt:{fontSize:14,color:helper.white,textAlign:'center',marginTop:10,marginBottom:5},
	dd:{fontSize:12,color:helper.blight,textAlign:'center',marginBottom:10},
	opt:{height:47,width:'100%',justifyContent:'center',alignItems:'center',borderTopWidth:0.4,borderColor:helper.grey},
})