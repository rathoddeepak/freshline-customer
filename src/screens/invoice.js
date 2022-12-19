import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	Animated,
	Vibration,
	BackHandler
} from 'react-native';
import {
	Hr,
	HeuButton,
	Icon
} from 'components';
import LinearGradient from 'react-native-linear-gradient';
import helper from 'assets/helper';
import lang from 'assets/lang';
import UserDB from 'libs/userdb';
import Sound from 'react-native-sound';
const {width, height} = Dimensions.get('window');
const maxHeight = height - 200;
import Animated2 from 'react-native-reanimated';
import { CommonActions } from '@react-navigation/native';
import {PanGestureHandler, PinchGestureHandler, RotationGestureHandler, State} from 'react-native-gesture-handler';
export default class Invoice extends Component {
	constructor(props){
		super(props);
		this.state = {
			translateY:new Animated.Value(-1000),
			entities:[],
			name:'',
			taxes:[],
			rptHeight:0,
			action:false,
			mounted:false,
		}
		this.whoosh = null;
	}

	componentDidMount(){		
		let {
			totalAmount,entities,title,title2,time,navPage,taxes,name
		} = this.props.route.params;
		const {
			first_name,
			last_name
		} = UserDB.getUser();
		const action = navPage != undefined;
		taxes = taxes == undefined ? [] : taxes;		
		this.setState({name,navPage,action,totalAmount,entities,title2,title,taxes,time,mounted:true});
		this.blur = this.props.navigation.addListener('blur', () => {
	      if(this.whoosh != null)this.whoosh.stop();
	    });	    
	    Vibration.vibrate(700);
	    setTimeout(() => {
	    		Vibration.vibrate(700);
	    }, 2500);
	    BackHandler.addEventListener("hardwareBackPress", this.backAction);
	}
	componentWillUnmount(){
	    if(this.blur != undefined)this.blur();
	    Vibration?.cancel();
	    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
	}

	backAction = () => {		
		if(this.state.action){
			this.props.navigation.dispatch(
			  CommonActions.reset({
			    index: 1,
			    routes: [
			      { name: 'HomeActivity'},
			      { name: this.state.navPage }			      
			    ],
			  })
			);
			return true;
		}else{
			return false;
		}
	}	

	startAnimation = () => {
		this.whoosh = new Sound('printing.mp3', Sound.MAIN_BUNDLE, (error) => {		  	 
		  Animated.timing(this.state.translateY,{
				toValue:0,
				duration:3500,
				useNativeDriver:true
		  }).start();
		  if (error)return;	
		  this.whoosh.play();
		})
	}

	handleLayout = ({nativeEvent}) => {
		if(this.state.mounted){
			const rptHeight = nativeEvent.layout.height;
			let diff = -(rptHeight - maxHeight);				
			this.setState({diff,rptHeight,scroll:rptHeight > maxHeight})
			this.state.translateY.setValue(-rptHeight)
			this.startAnimation()
		}
	}

	_onPanGestureEvent = ({nativeEvent}) => {
		if(this.state.scroll){			
			let value = Animated2.interpolate(nativeEvent.translationY, {
				inputRange:[-100, 0],
				outputRange:[this.state.diff, 0],
				extrapolate:'clamp'
			})
			this.state.translateY.setValue(value.__getValue())
		}			
	}

	action = () => {
		this.props.navigation.dispatch(
		  CommonActions.reset({
		    index: 1,
		    routes: [
		      { name: 'HomeActivity'},
		      { name: this.state.navPage }     
		    ],
		  })
		);
	}

	render(){
		const {
			totalAmount,
			translateY,
			entities,
			taxes,
			title2,
			action,
			title,
			time,
			name,
		} = this.state;
		return (
			<View style={s.main}>
			 <View style={helper.max}>
			    <View style={{width:'100%',height:55,justifyContent:'center',alignItems:'center',backgroundColor:helper.primaryColor,elevation:24}}>
				  <Text style={s.tt}>{title2} | RECEIPT</Text>
				</View>
			  
			  <View style={{width:'95%',alignSelf:'center',marginTop:16,height:80,borderRadius:20,backgroundColor:'#A4E3FF',justifyContent:'center',alignItems:'center'}}>
			  	<View style={{width:'95%',alignSelf:'center',height:25,borderRadius:60,backgroundColor:helper.primaryColor}}>			  	
			  	<PanGestureHandler onGestureEvent={this._onPanGestureEvent} style={{width:'95%',maxHeight,overflow:'hidden',alignSelf:'center'}}><View style={{width:'99%',alignSelf:'center',height:maxHeight,overflow:'hidden',marginTop:10}}>
			  	<Animated.View style={{width:'100%',backgroundColor:'#EAEAEA',transform:[
			  	{translateY}
			  	]}} onLayout={this.handleLayout}><View style={{width:'90%',alignSelf:'center',overflow:'hidden'}}>
			  	  
			  	  <View style={{height:40,justifyContent:'center',borderTopWidth:1,marginTop:10,borderBottomWidth:1}}>
			  	   <Text style={{fontFamily:'sans-serif-medium',fontSize:14,textAlign:'center',width:'100%',fontFamily:'sans-serif-medium'}}>RECEIPT</Text>
			  	  </View>

			  	  <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,marginTop:5,paddingBottom:5}}>
			  	      <Text style={{fontFamily:'sans-serif-medium',fontSize:14}}>Name</Text>			  	      
				  	  <Text style={{fontFamily:'sans-serif-medium',fontSize:14,fontWeight:'bold'}}>{name}</Text>				  	  
			  	  </View>  

			  	  <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,marginTop:5,paddingBottom:5}}>
				  	  <Text style={{fontFamily:'sans-serif-medium',fontSize:14}}>{title}</Text>
				  	  <Text style={{fontFamily:'sans-serif-medium',fontSize:14}}>{time}</Text>
			  	  </View>			  	
			  	  			  	  
			  	  {entities.map(({title, amount, quantity, total, rowType}) => {			  	  	
			  	  	if(rowType == 1){
			  	  		return (
			  	  			<View style={{flexDirection:'row',marginVertical:5}}>
			  	  		      <Text numberOfLines={1} style={{fontFamily:'sans-serif-medium',fontSize:12,width:'90%'}}>↳ {quantity} x {lang.rp}{total} {title}</Text>						  	  
					  	    </View>
					  	)
			  	  	}else{
			  	  		return (
				  	  		<View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:5}}>
						  	  <Text numberOfLines={2} style={{fontFamily:'sans-serif-medium',fontSize:14,width:150}}>{title}</Text>
						  	  <Text style={{fontFamily:'sans-serif-medium',fontSize:14}}>{amount} x {quantity} = {lang.rp}{total}</Text>
					  	    </View>
				  	  	)
			  	  	}			  	  	
			  	  })}

				  {taxes.map(({name, percent, amount}) => 
				    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:5}}>
						<Text style={{fontFamily:'sans-serif-medium',fontSize:14}}>TAX</Text>
						<Text style={{fontFamily:'sans-serif-medium',fontSize:14}}>@{name} {percent}% {lang.rp}{amount}</Text>
					</View>			  	  	
			  	  )}

			  	  <View style={{height:40,flexDirection:'row',justifyContent:'space-between',borderTopWidth:1,marginTop:5}}>
			  	   <Text style={{fontFamily:'sans-serif-medium',fontSize:14,fontWeight:'bold'}}>TOTAL</Text>
			  	   <Text style={{fontFamily:'sans-serif-medium',fontSize:14,fontWeight:'bold'}}>{lang.rp}{totalAmount}</Text>				   			  	   
			  	  </View>


			  	  <View style={{height:40,justifyContent:'center',borderTopWidth:1}}>
			  	   <Text style={{fontFamily:'sans-serif-medium',fontSize:14,textAlign:'center',width:'100%',fontWeight:'bold'}}>Thank You Using Fresh Line</Text>
			  	  </View>
			  	  <View style={{height:40,justifyContent:'center',borderTopWidth:1}}>
			  	   <Text style={{fontFamily:'sans-serif-medium',fontSize:15,textAlign:'center',width:'100%'}}>Fresh Line</Text>
			  	  </View>

			  	</View></Animated.View></View></PanGestureHandler>			  	
			  	<LinearGradient colors={[helper.primaryColor, 'transparent']} style={{width:'100%',position:'absolute',top:8,height:10,borderRadius:60,}} />
				</View>
			  </View>

			 </View>
			 <View style={s.btm}>
			  {action ?
			  	<HeuButton onPress={this.action} style={{width:40,height:40,backgroundColor:helper.primaryColor,justifyContent:'center',alignItems:'center',borderRadius:100}}>
				  	<Icon name={lang.arwfrw} color={helper.white} size={25} />
			  	</HeuButton>
			  : null}
			 </View>

			</View>
		)
	}
}

const s = StyleSheet.create({
	tt:{fontFamily:"sans-serif",fontSize:17,marginVertical:20,fontWeight:'bold',textAlign:'center',color:helper.white},
	btm:{height:70,position:'absolute',bottom:0,width:'100%',justifyContent:'center',alignItems:'center'},
	main:{height:'100%', width:'100%',backgroundColor:helper.white},
})