import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	Animated,
	StyleSheet
} from 'react-native';
import helper from 'assets/helper';
const stks = [20, 60, 100, 140, 180];
export default class Reviewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stkAnims:[
			 new Animated.Value(stks[0] * 2),
			 new Animated.Value(stks[1] * 2),
			 new Animated.Value(stks[2] * 2),
			 new Animated.Value(stks[3] * 2),
			 new Animated.Value(stks[4] * 2),
			],
			average:'0.0',
			people:0
		}
	}	
	startAnimation = (data, {average,people}) => {
		const stkAnims = this.state.stkAnims;
		const useNativeDriver = true;
		let anims = [];
		let counter = 0;
		data.forEach(d => {
			if(d > 0){
				d = 100 - d;
				let toValue = (stks[counter] * d / 100);			
				anims.push(Animated.timing(stkAnims[counter], {toValue,useNativeDriver}));
			}		
			counter++;
		})
		Animated.parallel(anims).start(() => {
			this.setState({average,people})
		});
	}
	render() {
		const {
			stkAnims,
			average,
			people
		} = this.state;
		return (
			<View style={s.rf}>			 
			 {stks.map((height, index) =>
			 	<View style={{alignItems:'center'}} key={index}>
				 	<View style={[s.stk, {height}]}>
				 	 <Animated.View style={{width:15,backgroundColor:helper.primaryColor,height,
				 	 	 transform:[
				 	 	  {translateY:stkAnims[index]}
				 	 	 ]
				 	 }} />
					</View>
					<Text style={s.tw}>{index + 1}</Text>
				</View>
			 )}
			 <View style={s.rt}>
			  <Text style={{fontSize:55,fontWeight:'bold',color:helper.silver}}>{average}</Text>
			  <Text style={{fontSize:12,fontWeight:'bold',color:helper.silver}}>{people} People</Text>
			 </View>
			</View>
		)
	}
}

const s = StyleSheet.create({
	rf:{height:200,width:'100%',flexDirection:'row',justifyContent:'space-around',alignItems:'flex-end'},
	stk:{width:15,backgroundColor:'#424242',overflow:'hidden'},
	tw:{fontSize:12,color:'white'},
	rt:{height:200,justifyContent:'center',alignItems:'center'},
})