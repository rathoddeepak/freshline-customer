import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,	
	Animated,
	FlatList,
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import {
	TypePicker,
	HeuButton,
	Slider,
	Dazar,
	Icon
} from 'components';
import ViewPager from '@react-native-community/viewpager';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
const maxHeight = 440;
const visible = 390;
const typeHeight = 300;
const distanceHeight = 120;
const bottomHeight = 50;
const third = Dimensions.get('window').width * 33 / 100;
export default class Filter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pageOffset:new Animated.Value(0),
			distance:this.props.maxDistance+'.00',
			categories:[],
			loading:true,
			v:false,
			catS:[],
			silv:1,
			type:3,
			error:false,
			refresh:false
		}
		this.callback = null;
	}
	componentDidMount() {
		this.loadCats();
	}
	show = ({cat,type,distance}, callback) => {
		this.callback = callback;		
		const silv = parseFloat(distance) / this.props.maxDistance;
		this.setState({type,distance,catS:cat,silv}, () => {
			this.setState({v:true});
		})
	}
	loadCats = async () => {		
		this.setState({loading: true,error:false})		
		var res = await request.perform('vendor2', {
			req:'cats',
			user_id,			
		});		
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200){					
			this.setState({categories:res.data});
		} else {			
			this.setState({error:true});
		}
	}
	setPage(page){
		this.pager.setPage(page);
	}
	onPageScroll = (e) => {
		this.state.pageOffset.setValue(e.nativeEvent.position + e.nativeEvent.offset)
	};
	onSlideEnd = (e) => {				
		this.setState({distance:Number(e * this.props.maxDistance).toFixed(2)})
	}
	close = (ma = true) => {
		if(ma)this.callback(false);
		this.setState({v:false}, () => {
			this.callback = null;
		})
	}
	sbmt = () => {		
		if(this.callback != null){
		    this.callback({
				type:this.state.type,
				distance:this.state.distance,
				cat:this.state.catS
			})
			this.close(false);
		}			
	}
	render() {
		const {
		  categories,
		  pageOffset,
		  distance,
		  loading,
		  v,
		  silv,
		  type,
		  error,
		  refresh
		} = this.state;
		const translateX = pageOffset.interpolate({
			inputRange:[0, 1, 2],
			outputRange:[0, third, third*2]
		})
		const tY = pageOffset.interpolate({
			inputRange:[0, 1],
			outputRange:[0, typeHeight],
			extrapolate:'clamp'
		})
		const tO = pageOffset.interpolate({
			inputRange:[0, 1],
			outputRange:[1, 0],
			extrapolate:'clamp'
		})

		const dY = pageOffset.interpolate({
			inputRange:[0, 1, 2],
			outputRange:[distanceHeight, 0, distanceHeight],
			extrapolate:'clamp'
		})
		const dO = pageOffset.interpolate({
			inputRange:[0, 1, 2],
			outputRange:[0, 1, 0],
			extrapolate:'clamp'
		})

		const cY = pageOffset.interpolate({
			inputRange:[1, 2],
			outputRange:[visible, 0],
			extrapolate:'clamp'
		})
		const cO = pageOffset.interpolate({
			inputRange:[1, 2],
			outputRange:[0, 1],
			extrapolate:'clamp'
		})		
		return (		
			<Modal visible={v} transparent onRequestClose={this.close} animationType="fade"><TouchableWithoutFeedback onPress={this.close}>
		    <View style={s.mn}>		 
			 <ViewPager scrollEnabled={false} style={s.hldr} ref={ref => (this.pager = ref)} onPageScroll={this.onPageScroll}>
				 
				 <View style={helper.max}>
					 <Animated.View style={[s.vnt, 
					 	{justifyContent:'center',opacity:tO,height:typeHeight,transform:[{translateY:tY}]}
					 ]}>
						 <TypePicker initial={type} onSelect={type => this.setState({type})} />

						 <View style={s.pa}><HeuButton style={s.lgt} onPress={this.sbmt}>
						   <Icon name={lang.chk} size={25} color={helper.primaryColor} />
						 </HeuButton></View>

					 </Animated.View>
				 </View>

				 <View style={helper.max}>
					 <Animated.View style={[s.vnt,
					 	{opacity:dO,height:distanceHeight,transform:[{translateY:dY}]}
					 ]}>
					  <Text  style={s.dft}>We Rank Food By Rating</Text>
					  <Text  style={s.vh}>Choose Distance</Text>
					   <View style={s.hu}>
					       <View style={{width:'70%'}}>
							<Slider						          
					          maximumTrackTintColor={"#524b38"}				          
					          minimumTrackTintColor={helper.primaryColor}
					          thumbTintColor={helper.white}
					          value={silv}
					          trackStyle={{height:4}}
					          onSlidingComplete={this.onSlideEnd}					          
					        />
					       </View>
					       
					       <View style={{width:'25%',justifyContent:'center',alignItems:'center'}}>
					        <Text style={{fontWeight:'bold',fontSize:15,color:'white'}}>{distance} KM</Text>
					       </View>					      
				        </View>
				        <View style={s.pa}><HeuButton style={s.lgt} onPress={this.sbmt}>
							   <Icon name={lang.chk} size={25} color={helper.primaryColor} />
						   </HeuButton></View>
					 </Animated.View>
				 </View>

				 <View style={helper.max}>
					 <Animated.View style={[s.vnt, 
					 	{opacity:cO,height:visible,transform:[{translateY:cY}]}
					 ]}>
					 <View style={s.pa}><HeuButton style={s.lgt} onPress={this.sbmt}>
						<Icon name={lang.chk} size={25} color={helper.primaryColor} />
					 </HeuButton></View>
					 <Text  style={s.dft}>Categories</Text>
					 <Dazar
				      loading={loading}
				      error={error}
				      emptyOther
				      onRetry={this.loadCats}
				      length={categories.length}				      
				     />
					 <FlatList
					  renderItem={this.renderItem}
					  data={categories}
					  extraData={refresh}
					  keyExtractor={(item) => item.id.toString()}
					 />					
					 </Animated.View>					 
				 </View>


			 </ViewPager>

			 <View style={s.btm}>
			  
			  <TouchableOpacity style={s.bts} activeOpacity={0.7} onPress={() => this.setPage(0)}>
			   <Text style={s.tf}>Type</Text>
			  </TouchableOpacity>

			  <TouchableOpacity style={s.bts} activeOpacity={0.7} onPress={() => this.setPage(1)}>
			   <Text style={s.tf}>Distance</Text>
			  </TouchableOpacity>

			  <TouchableOpacity style={s.bts} activeOpacity={0.7} onPress={() => this.setPage(2)}>
			   <Text style={s.tf}>Categories</Text>
			  </TouchableOpacity>

			  <Animated.View style={[s.nh, {transform:[{translateX}]}]} />

			 </View>

			</View>
			</TouchableWithoutFeedback></Modal>			
		)
	}
	handleAdd = (id, add) => {
		let catS = this.state.catS;
		if(add == -1)catS.push(id);
		else catS.splice(add, 1);
		this.setState({catS,refresh:!this.state.refresh});
	}
	renderItem = ({item, index}) => {
		const bg = this.state.catS.indexOf(item.id);		
		return (
			<TouchableOpacity onPress={() => this.handleAdd(item.id, bg)} style={{width:'100%',height:35,marginVertical:3,backgroundColor:bg == -1 ? '#3d3d3d' : '#524b38',justifyContent:'center'}} activeOpacity={0.7}>
			 <Text style={{fontSize:14,fontWeight:'bold',marginLeft:10,color:helper.white}}>{item.name}</Text>
			</TouchableOpacity>
		)
	}
}
Filter.defaultProps = {
	maxDistance:15
}
Filter.propTypes = {
	maxDistance:PropTypes.number
}
const s = StyleSheet.create({
	mn:{justifyContent:'flex-end',height:'100%',width:'100%',backgroundColor:'#00000099'},
	hldr:{height:maxHeight,width:'100%'},
	tf:{fontWeight:'bold',color:helper.silver,fontSize:14},
	nh:{width:third,backgroundColor:helper.primaryColor,bottom:0,height:4,position:'absolute'},
	dft:{fontSize:15,fontWeight:'bold',marginLeft:'2%',color:'#898989',marginVertical:10},
	vnt:{bottom:50,width:'100%',backgroundColor:'#353535',position:'absolute'},
	hu:{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center'},
	vh:{fontSize:14,marginLeft:'2%',color:helper.white,marginTop:20},
	btm:{height:bottomHeight,width:'100%',position:'absolute',bottom:0,backgroundColor:'#242424',flexDirection:'row'},
	bts:{width:third,height:50,justifyContent:'center',alignItems:'center'},
	lgt:{height:36,width:36,borderRadius:90,backgroundColor:'#56491e',justifyContent:'center',alignItems:'center'},
	pa:{position:'absolute',top:5,right:5}
})