import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
	Pressable
} from 'react-native';
import Pulse from 'components/pulse'
import helper from 'assets/helper';
const SQUARE = 50;
const R_LESS = [60, 35];
const R_MORE = [50, 32];
const CIRCLE = 200;
const ROUND = 5;

export default class Table extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inX:0,
			inY:0,
			selected:false
		}
	}
	toggle  = (selected) => {
		this.setState({
			selected:!this.state.selected
		})
		this.props.onSelect()
	}
	UNSAFE_componentWillMount(){		
		let {x, y, areaX, areaY, numChairs, index} = this.props;
		let xAdd, yAdd;
		if(numChairs > 2){
			xAdd = R_LESS[0]/2;
			yAdd = R_LESS[1]/2;
		}else if(numChairs > 4){			
			xAdd = R_MORE[0]/2;
			yAdd = R_MORE[1]/2;
		}else{			
			xAdd = SQUARE/2;
			yAdd = SQUARE/2;
		}
		
		let inX = (areaX * x / 100) + xAdd;
		let inY = (areaY * y / 100) + yAdd;		
		if((inX + 150) > areaY)this.props.onGX(inX + (xAdd + 50));		
		if((inY + 150) > areaX)this.props.onGY(inY + (yAdd + 50));		
		this.setState({
			xAdd,
			yAdd,
			inX,
			inY,
			oX:x,
			oY:y
		})
	}	
	render() {
		const {
			index,
			numChairs,
			status,
			text,
			y,
			x
		} = this.props;
		let table = {			
			backgroundColor:'#D0AA45',
			elevation:1.5,
			borderRadius:ROUND,
			cursor:'grab',
			zIndex:1000,
			justifyContent:'center',
			alignItems:'center'
		};		
		if(numChairs > 2){
			table['width'] = R_LESS[0];
			table['height'] = R_LESS[1];
		}else if(numChairs > 4){			
			table['width'] = R_MORE[0];
			table['height'] = R_MORE[1];
		}else{
			table['borderRadius'] = CIRCLE;
			table['width'] = SQUARE;
			table['height'] = SQUARE;	
		}		
		return (					
				<View style={{position: 'absolute',width:table['width'] + 20, height:table['height'] + 20,justifyContent:'center',alignItems:'center', transform:[
				{translateX:this.state.inX},
				{translateY:this.state.inY}
				]}}>
				 <Pressable style={table} onPress={this.toggle}>
				 <View style={s.badge}>
			 	  <Text style={s.btxt}>{index + 1}</Text>
			 	 </View>
			 	 {this.state.selected ? 
			 	 	<Pulse color='#3172D5' numPulses={3} diameter={60} speed={50} duration={2000} />
			 	 : null}
				 </Pressable>				 
				 {numChairs < 5 ? <View style={[s.chair, {bottom:0}]} /> : null}
				 {numChairs >= 5 ? <View style={[s.chair2, {bottom:0,left:20}]} /> : null}

				 {numChairs > 1 && numChairs <= 5 ? <View style={[s.chair, {top:0}]} /> : null}
				 {numChairs == 6 ? <View style={[s.chair2, {top:0,left:20}]} /> : null}

				 {numChairs > 2 ? <View style={[s.chair, {top:20,left:0}]} /> : null}

				 {numChairs > 3 ? <View style={[s.chair, {top:20,right:0}]} /> : null}

				 {numChairs >= 5 ? <View style={[s.chair2, {bottom:0,right:20}]} /> : null}

				 {numChairs == 6 ? <View style={[s.chair2, {top:0,right:20}]} /> : null}				    
				</View>			
		)
	}
}

const s = StyleSheet.create({
	chair:{width:25,height:20,position:'absolute',backgroundColor:'white',borderRadius:3},
	chair2:{width:18,height:25,position:'absolute',backgroundColor:'white',borderRadius:3},
	badge:{width:22,height:22,backgroundColor:helper.silver,elevation:9,borderRadius:100,justifyContent:'center',alignItems:'center'},
	btxt:{fontSize:8,fontWeight:'bold',color:'#000'},
})