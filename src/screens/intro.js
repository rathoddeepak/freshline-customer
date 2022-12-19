import React, { Component } from "react";
import {Animated,Image,View,Vibration,StyleSheet, Easing, Text, TouchableWithoutFeedback} from "react-native";
import helper from 'assets/helper';
import Icon from 'components/icon';
import SlideClose from 'components/slideClose'
import lang from 'assets/lang';
const holder = require('assets/images/lovelatur.png');
const heartImg = require('assets/images/heart.png');
export default class FoodControlTour extends Component {
	constructor(props) {
		super(props);
		this.state = {			
			scale:new Animated.Value(1),
			stage:0
		}
		this.animation = null;
		this.interval = null;
	}
	componentDidMount(){
	  this.startBeeping();
	}
	startBeeping = () => {
		this.interval = setInterval(() => {
			Animated.spring(this.state.scale, {
				toValue:0,
				easing: Easing.bounce,
				duration:200,
				useNativeDriver:true
			}).start();
			Vibration.vibrate(75);
			setTimeout(() => {
				Vibration.vibrate(75);
				Animated.spring(this.state.scale, {
					toValue:1,
					easing: Easing.bounce,
					useNativeDriver:true,
					duration:300,
				}).start();
			}, 300);
		}, 1000);
	}
	explore = () => {
		if(this.interval != null)clearInterval(this.interval);
		this.interval = null;
		this.props.navigation.navigate('Startup')
		this.slideClose.reset();
	}
	render() {
		const {						
			stage
		} = this.state;
		const scale = this.state.scale.interpolate({
			inputRange:[0, 0.5, 1],
			outputRange:[1, 0.9, 1]
		});
		return (			
            <View style={styles.container}>		               
               <View style={{width:200,height:200}}>		                
                <Image source={holder} style={{width:200,height:200}} />
                <Animated.Image source={heartImg} style={{transform:[{scale}],width:48,height:44,position:'absolute',top:70,left:17}} />
                <Text style={{fontSize:30,fontFamily:'cursive',color:helper.white,position:'absolute',top:10,left:-20}}>Presenting</Text>
                
                <View style={{flexDirection:'row',position:'absolute',bottom:0,right:0,}}>
                 <Text style={{fontSize:30,fontWeight:'bold',color:helper.white}}>With </Text>
                 <Animated.Text style={{fontFamily:'scriptmt',fontSize:30,color:helper.primaryColor,transform:[{scale}] }}>Clufter</Animated.Text>
                </View>		                		               
               </View>
               <View style={{width:'100%',alignItems:'center',position:'absolute',bottom:50}}>
                  <SlideClose onSubmit={this.explore} ref={ref => this.slideClose = ref} fSize={16} width={250} text={"Let's Explore"} />
                </View>
		    </View>		    
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#000',
    alignItems: "center",
    justifyContent: "center"    
  },
  cth:{width:'33%',justifyContent:'center',alignItems:'center'},
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: "blue",
    borderRadius: 5
  }
});