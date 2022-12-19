import React, { Component } from 'react';
import {
	Text,	
	View,
	ScrollView
} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import helper from 'assets/helper';
export default class CatProvider extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
    		current:0
    	}
    }	
	scrollTo = (index) => {
		this.scrollView.scrollTo({x: 0, y: index * 60, animated: true})
	}
	setIndex = (current) => {
		this.scrollView.scrollTo({x: 0, y: current * 60, animated: true})
		this.setState({current})
	}
	handlePress = (current) => {
		this.setState({current}, () => {
			this.props.onPress(current)
		})
	}
	render (){
		let {
			data			
		} = this.props;
		return (
			<ScrollView ref={ref => this.scrollView = ref}>
				{data.map((cat, i) => {
					return (
						<TouchableNativeFeedback onPress={() => this.handlePress(i)} style={{padding:5,marginVertical:4,borderLeftWidth:this.state.current == i ? 4 : 0,justifyContent:'center',borderColor:helper.primaryColor,minHeight:60}}>						 
						 <Text style={{fontSize:14,color:"white",fontWeight:'bold',textAlign:"center"}} numberOfLines={2}>{cat.title}</Text>
						 <View style={{paddingHorizontal:10,borderRadius:3,alignSelf:'center',backgroundColor:helper.primaryColor}}>
						  <Text style={{fontSize:12,color:helper.blk,textAlign:"center",fontWeight:'bold'}} numberOfLines={2}>50% OFF</Text>
						 </View>
						</TouchableNativeFeedback>
					)
				})}
			</ScrollView>
		)
	}
}