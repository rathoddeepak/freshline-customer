import React, { Component } from "react";
import { Animated, Image, View, Modal, Easing, ToastAndroid, StyleSheet, ScrollView, PanResponder, Text, TouchableWithoutFeedback} from "react-native";
import FoodCardSmall from './foodCardSmall';
import Checkbox from './checkBox2';
import helper from 'assets/helper';
import Icon from './icon';
import lang from 'assets/lang';
const swimg = require('assets/images/arswipe.png');
const tgItW = 50;
const lkaw = tgItW*2;
const tgIX = 60;
const tgcH = 60;
const rMx = 50;
const lMx = -50;
function getStage (stage) {
	if(stage == 0){
		return {toTY:30,toTO:0}
	}else if(stage == 1){
		return {toTY:-10,toTO:30}
	}
}
export default class FoodControlTour extends Component {
	constructor(props) {
		super(props);
		this.state = {
			translateY:new Animated.Value(0),
			opacity:new Animated.Value(0.5),
			stage:0,
			v:false
		}
		this.animation = null;
	}	
	show = () => {
		this.setState({v:true}, this.startLoop)
	}
	handle = (a, add) => {
		if(add == -1){
			this.handleRemove();
		}else{
			this.handleAdd();
		}
	}
	handleAdd = () => {
		this.checkBox1.handlePress(false)
		this.animation.stop();		
		setTimeout(() => this.setState({stage:1,translateY:new Animated.Value(30),opacity:new Animated.Value(0.5)}, this.startLoop), 230)
	}
	handleRemove = () => {
		this.checkBox2.handlePress(false)
		this.animation.stop();		
		this.animation = null;
		setTimeout(() => {
			this.setState({v:false}, () => {
				this.props.onDone();
			})
		}, 600);
	}
	startLoop = () => {
		const {toTY, toTO} = getStage(this.state.stage);
		this.animation = Animated.loop(		  
			  Animated.sequence([
			    Animated.timing(this.state.translateY, {
			      toValue: toTY,
			      duration: 500,
			      delay: 500,
			      useNativeDriver:false
			    }),
			    Animated.timing(this.state.opacity, {
			      toValue: 0,
			      duration: 200,
			      useNativeDriver:false
			    }),
			    Animated.timing(this.state.translateY, {
			      toValue: toTO,
			      duration: 0,
			      useNativeDriver:false
			    }),			    
			    Animated.timing(this.state.opacity, {
			      toValue: 0.5,
			      duration: 300,
			      useNativeDriver:false
			    })
			  ]),			  
		  {
		    iterations: 10
		  }
		)
		this.animation.start();
	}
	render() {
		const {
			translateY,
			opacity,
			stage,
			v
		} = this.state;
		return (
			<Modal visible={v} animationType="fade" transparent coverSreen={false}>				
		            <View style={styles.container}><View>

		                    <View style={{flexDirection:'row'}}>
			                  
			                  <View style={{width:'50%',justifyContent:'center',alignItems:'center'}}>
			                   <Text style={{textAlign:'center',fontSize:17,marginBottom:10,fontWeight:'bold',color:helper.white}}>1</Text>
			                   <Checkbox
				                   ref={(ref) => this.checkBox1 = ref}
			                   />
			                   <Text style={{textAlign:'center',fontSize:17,marginTop:10,fontWeight:'bold',color:helper.white}}>SWIPE DOWN</Text>
			                  </View>


			                  <View style={{width:'50%',justifyContent:'center',alignItems:'center',opacity:stage == 1 ? 1 : 0.5}}>
			                   <Text style={{textAlign:'center',fontSize:17,marginBottom:10,fontWeight:'bold',color:helper.white}}>2</Text>
			                   <Checkbox
				                   ref={(ref) => this.checkBox2 = ref}
			                   />
			                   <Text style={{textAlign:'center',fontSize:17,marginTop:10,fontWeight:'bold',color:helper.white}}>SWIPE UP</Text>
			                  </View>

			                 </View>		                
		                    <View style={{overflow: 'visible',alignSelf:'center',justifyContent:'center',marginVertical:20}}>
						        <CounterInput						   
								   onChange={this.handle}
								   onMax={this.maxLimit}
								   ref={ref => (this.counter = ref)}
								/>
								<Animated.View pointerEvents="none" style={{transform:[
									{translateY}
								],height:155,left:50,width:100,opacity,position:'absolute'}}>
									 <Image source={swimg} style={helper.max} tintColor={helper.white} />
								</Animated.View>
							</View>
							<Text numberOfLines={2} style={{textAlign:'center',fontSize:22,marginTop:20,marginBottom:20,fontWeight:'bold',color:helper.silver}}>How to {stage == 0 ? 'Add' : 'Remove'} FOOD? 🤔</Text>
				    </View></View>
		    </Modal>
		)
	}
}

class CounterInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			panX:new Animated.Value(0),
			hasChange:false,
			list:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			value:0,
			lock:false,
			ltype:0,
			msg:''
		}
		this.pan = new Animated.ValueXY();
		this.panResponder = PanResponder.create({
		    onMoveShouldSetPanResponder: () => true,
		    onPanResponderGrant: () => {
		    	this.setState({hasChange:false})				
		    },
		    onPanResponderMove: (s, gestureState) => {
		    	if(this.state.hasChange)return;
		    	if(gestureState.dy > rMx){    	 
		    	 	this.triggerI();
		    	 	return;
		    	}
		    	if(gestureState.dy < lMx){    	 
		    	 	this.triggerD();
		    	 	return;
		    	}    	 
		    	this.state.panX.setValue(gestureState.dy);   
		    },
		    onPanResponderRelease: () => {
		    	if(!this.state.hasChange){
					this.normal();
				}
		    }
  	    });		
	}    
    normal = () => {    
    	Animated.timing(this.state.panX, {
				    toValue:0,
				    easing:Easing.elastic(1),
				    duration:500,
			        useNativeDriver:false
		}).start();
    }
    triggerI = () => {
    	this.normal();
    	let v = this.state.value;
    	if((v + 1) > this.state.lock && this.state.ltype == 1){    		
    		ToastAndroid.show(this.state.msg, ToastAndroid.SHORT);
    		return;
    	}
    	this.setState({hasChange:true});    	
    	let x = v == 0 ? 1 : (v + 1);
    	let len = this.state.list.length;
    	if((v + 2) == len){
    		let list = this.state.list;
    		for(let i = len; i < (len + 9); i++ )list.push(i);    		
    		this.setState({list});
    	}
    	x = tgIX * x;
    	v++;
    	if(v == this.props.maxLimit){
    		this.props.onMax();
    		return
    	}
    	this.setState({value:v}, () => {
    		this.props.onChange(v, 1);
    	});
    	this.counterScroll.scrollTo({x:0, y:x, animated:true});
    }
    directI = (v) => {    	
        this.setState({v});    	
    	let len = this.state.list.length;    	
    	if((v + 2) == len){
    		let list = this.state.list;
    		for(let i = len; i < (len + 9); i++ )list.push(i);    		
    		this.setState({list});
    	}
    	setTimeout(() => {
    		this.setState({value:v})
    		this.counterScroll.scrollTo({x:0, y:tgIX * v, animated:false});
    	})
    }
    triggerD = () => {
    	this.normal();
    	let v = this.state.value;
    	if((v - 1) < this.state.lock && this.state.ltype == -1){
    		ToastAndroid.show(this.state.msg, ToastAndroid.SHORT);
    		return;
    	}
    	this.setState({hasChange:true})    	
    	if(v == 0)return;v--;
    	let x = (tgIX * v);  	
    	this.setState({value:v}, () => {
    		this.props.onChange(v, -1);
    	})
    	this.counterScroll.scrollTo({x:0, y:x, animated:true})
    }	
	render() {
		const translateY = this.state.panX.interpolate({
			inputRange:[lMx, 0, rMx],
			outputRange:[-5, 10, 20],
			extrapolate: 'clamp',
			useNativeDriver:true
		})	
		const {
			style
		} = this.props;
		return (
			<View style={style}>
				<Animated.View {...this.panResponder.panHandlers}><TouchableWithoutFeedback>
				 <View style={{width:tgItW,height:lkaw}}>
				  <Animated.View style={{width:tgItW, height:tgcH,elevation:10,backgroundColor:helper.primaryColor,borderRadius:100,transform:[
					  {translateY}
				  ]}}>	
				  <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} snapToInterval={tgIX} ref={ref => this.counterScroll = ref}>
			       {this.state.list.map((item, index) => {
			       	return (
			       		<View key={index} style={{width:'100%',height:tgIX,justifyContent:'center',alignItems:'center'}}>
					        <Text style={{fontSize:27,color:'#fff',fontWeight:'bold'}}>{item}</Text>
					    </View>
			       	)
			       })}
			      </ScrollView>
				  </Animated.View>

				  <View style={{width:'100%',position:'absolute',justifyContent:'center',top:-30,transform:[
				   {rotate:'-90deg'}
				  ]}}>
				   <Icon name={lang.cvrgt} color={helper.primaryColor + 'b4'} size={18} />
				  </View>

				  <View style={{width:'100%',position:'absolute',justifyContent:'center',bottom:-15,transform:[
				   {rotate:'90deg'}
				  ]}}>
				   <Icon name={lang.cvrgt} color={helper.primaryColor + 'b4'} size={18} />
				  </View>

				 </View>
				</TouchableWithoutFeedback></Animated.View>			
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#000000c7',
    alignItems: "center",    
    justifyContent: "center",    
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