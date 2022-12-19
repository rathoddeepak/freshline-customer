import React, {Component} from 'react';
import {
	View,
	Text,
	Linking,
	BackHandler
} from 'react-native';
import Button from 'components/button';
import helper from 'assets/helper';
export default class Update extends Component {
	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);  
	}
	componentWillUnmount () {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);           
	}
	handleBackButton = () => {
		return true;
	}
	update = () => {
		Linking.openURL('https://play.google.com/store/apps/details?id=com.clufter')
	}
	render(){
		return (
			<View style={{flex:1,backgroundColor:helper.white,justifyContent:'center',alignItems:'center'}}>
			 <Text style={{fontWeight:'bold',marginBottom:10,color:helper.primaryColor,fontSize:20,width:'100%',textAlign:'center'}}>Update Required</Text>
			 <Text style={{marginBottom:10,color:helper.primaryColor,textAlign:'center',width:'90%',alignSelf:'center',fontSize:16}}>We Have Updated Our App We New Features, Test it Out By Updating Our App</Text>
			 <Button onPress={this.update} text="Update Now" style={{elevation:10}} hr={20} br={20} />
			</View>
		)
	}
}