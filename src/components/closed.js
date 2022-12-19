import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Text,
	View,
	Modal,
	Animated,
	StyleSheet
} from 'react-native';
import { withAnchorPoint } from 'libs/anchorpoint';
import helper from 'assets/helper';
import lang from 'assets/lang';
import moment from 'moment';
const timeline = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
export default class Closed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v:false,
			name:'',
			hrs:-1,
			text:0,
			fromT:'',
			toT:'',
			mins:''
		}
		this._rotate = new Animated.Value(0);
		this._animation = null;
	}
	show = ({close_time,open_time,name,hrs,text,mins}) => {
		this._animation = Animated.loop(
			Animated.sequence([
				Animated.timing(this._rotate, {
					toValue:0,
					duration:1000,
					useNativeDriver:true
				}),
				Animated.timing(this._rotate, {
					toValue:1,
					duration:1000,
					useNativeDriver:true
				})
			])
		).start()
		if(hrs != undefined){
			this.setState({			
				hrs,
				mins,
				name,
				text:0,
				fromT:moment(open_time * 1000).format('hh:mm A'),
				toT:moment(close_time * 1000).format('hh:mm A'),			
			}, () => {
				this.setState({
					v:true
				})
			})
		}else{
			this.setState({			
				hrs:-1,
				text
			}, () => {
				this.setState({
					v:true
				})
			})
		}			
	}
	componentWillUnmount() {
		if(this._animation) {
	        this._animation.stop(); 
	        this._animation = null
	    }
	}
	getTransform = () => {
		const rotateZ = this._rotate.interpolate({
          inputRange: [0, 1], 
          outputRange: ['-10deg', '10deg'],
        })
	    let transform = {
	        transform: [{ perspective: 400 }, {rotateZ}],
	    };
	    return withAnchorPoint(transform, { x: 0.6, y: 0 }, { width: 150, height: 160 });
	};
	close = () => {	  
      this.setState({v:false}, () => {
      	this.props.onClose();
      })      
      if(this._animation) {
        this._animation.stop(); 
        this._animation = null
      }
	}
	render() {		
		const {
			v,
			toT,
			text,
			fromT,
			mins,
			name,
			hrs
		} = this.state;
		return (
		    <Modal visible={v} transparent animationType="fade" onRequestClose={this.close}>
			<View style={helper.model}>
			  <View style={s.ht}>
			   <Text style={s.tt}>{name}</Text>	
			   
			   {hrs != -1 ? <Text style={s.dd}>Opens in {hrs} Hrs {mins} Mins</Text> : null}
			   {hrs != -1 ? <Text style={s.add}>{fromT} - {toT}</Text> : null}

			   {text != 0 ? <Text style={s.add}>{text}</Text> : null}

			   <View style={s.hr} />
			   <View>
				   <Animated.View style={[{alignSelf:'center',alignItems:'center'}, this.getTransform()]}>
				    <View style={{width:100,height:100,
				   	    backgroundColor: "transparent",				    
					    borderLeftWidth: 50,
					    borderRightWidth: 50,
					    borderBottomWidth: 100,
					    borderLeftColor: "transparent",
					    borderRightColor: "transparent",
					    borderBottomColor: helper.grey				    
				    }} />
				    <View style={{width:98,height:98,
				   	    backgroundColor: "transparent",				    
					    borderLeftWidth: 48,
					    borderRightWidth: 48,
					    borderBottomWidth: 98,
					    borderLeftColor: "transparent",
					    borderRightColor: "transparent",
					    borderBottomColor: "#382c1e",
					    position: "absolute",
					    top:10,
					    left:20.5,				    
				   }} />
				   <View style={{justifyContent:'center',alignItems:'center',width:140,height:60,borderRadius:12,backgroundColor:helper.primaryColor}}>
				       <View style={{width:130,height:50,borderWidth:3,justifyContent:'center',alignItems:'center',borderColor:helper.white,borderRadius:12}}>
				        <Text style={{fontWeight:'bold',fontSize:26,color:helper.white}}>CLOSED</Text>
					   </View>
				   </View>			   
				   </Animated.View>
				   <View style={{width:30,height:30,borderRadius:60,elevation:10,backgroundColor:helper.white,position:'absolute',top:-5,left:148}} />
			   </View>		   

			  </View>
			</View>
		  </Modal>	
		)
	}
}

const s = StyleSheet.create({
	ht:{
		width:'90%'
	},
	tt:{
		fontSize:20,
		fontWeight:'bold',
		textAlign:'center',
		color:helper.silver,
		marginBottom:4
	},
	dd:{
		fontSize:17,
		textAlign:'center',
		color:helper.silver,
		marginBottom:7
	},
	add:{
		fontSize:15,
		fontWeight:'bold',
		textAlign:'center',
		color:helper.silver,
		marginBottom:7
	},
	hr:{
		width:'100%',height:2,backgroundColor:helper.silver,marginBottom:10
	}
})