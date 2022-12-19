import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	Animated,
	Easing
} from 'react-native';
import helper from 'assets/helper';
import request from 'libs/request';
import Dizzer from 'components/dizzer';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
const fimgs = [
  'https://i.ibb.co/ZcMxfwH/map.png',
  'https://i.ibb.co/Nrw0KH9/map2.png',
  'https://i.ibb.co/jk2mF8T/map3.png'
]
export default class FloorSelectionView extends Component {
	floorT = new Animated.Value(0);
	floorO = new Animated.Value(0);
	constructor(props) {
		super(props);
		this.state = {
			sc:-1,
			floors:[
			 {},
			 {},
			 {}
			],
			fImages:[
			  '',
			  '',
			  ''		  
			]			
		}
	}
	componentDidMount() {

		Animated.timing(this.floorT, {
		 	toValue:-120,
		 	duration:1000,
		 	easing: Easing.inOut(Easing.ease),
		 	useNativeDriver:true
		}).start();		
		Animated.timing(this.floorO, {
		 	toValue:1,
		 	duration:1000,
		 	easing: Easing.inOut(Easing.ease),
		 	useNativeDriver:true
		}).start(() => {
			this.loadFloors();
		});		
	}
	loadFloors = async () => {		
		this.setState({loading: true,error:false,fImages:['','','']})		
		var res = await request.perform('vendor', {
			req:'ld_flr',
			v_id:this.props.v_id,
			user_id,
			s
		});		
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200)
			this.setState({
				floors:res.data,
				fImages:fimgs			
			});
		else this.setState({error:true});
	}
	hPress(z, id){
		let sc = this.state.sc == z ? -1 : z;
		this.setState({sc}, () => {
			this.props.onFloorSelected(sc, id);
		});
	}
	render () {
		const {floors,fImages,sc,loading,error} = this.state;
		const transform = [{translateY:this.floorT}, {rotateX:'72deg'}, {rotateY:'2deg'}, {rotateZ:'-20deg'}, {perspective: 500}]
		return (
			<View style={s.viewPort}>			 
			 {floors.map((f, idx) => {
			 	return (
			 	 <TouchableOpacity disabled={loading} key={idx} onPress={() => this.hPress(idx, f.id)} activeOpacity={0.8} style={s.vhldr}>
					 <Animated.View style={[s.floor, {transform,opacity:this.floorO,backgroundColor:sc == idx ? '#D0AA45b4' : '#9e9e9eb4'}]}>
					  <Image source={{uri:fImages[idx]}}  resizeMode='stretch' style={{width:250,height:250}}/>
					  <Text style={s.ftxt}>Floor {f.floor == 0 ? 'G' : f.floor}</Text>
					  <SkeletonContent
					   containerStyle={{width:'102%',height:'102%',position:'absolute'}}
				       isLoading={loading}
				       boneColor="#121212"
				       highlightColor="#333333"
				       animationType="pulse"
				       layout={[
				        { key: 'someId', width:'100%',height:'100%', marginBottom: 6 },				        
				       ]}
					  />					  
					 </Animated.View>
				 </TouchableOpacity>
			 	)
			 })}
			 {error ?			 	
			 	 <Dizzer onPress={this.loading} />
			 : null}
			</View>
		)
	}
}
const s = StyleSheet.create({
	viewPort:{
		backgroundColor:"#000",
		flex:1		
	},
	vhldr:{
		height:100,
	    alignSelf:"center"
	},
	floor:{		
		height: 250,
	    width: 250,	    
	    borderRadius: 5,	     
	    marginVertical: 40,	       
	    alignItems: "center",
	    justifyContent: "center"	    
	},
	ftxt:{fontSize:18,color:'white',position:'absolute',top:'50%',left:'40%',backgroundColor:helper.primaryColor,borderRadius:6,padding:6},

})