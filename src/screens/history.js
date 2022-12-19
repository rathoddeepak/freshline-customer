import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ToastAndroid,
	Linking,
	TouchableOpacity,
	RefreshControl,
	DeviceEventEmitter
}  from 'react-native';
import {
	Icon,	
	Dazar,
	Image,
	Button,
	NHeader,
	TextIcon,	
	FoodCard2,
	DialogInput,
	LoadingModal	
} from 'components';
import LottieView from 'lottie-react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
import tbl from 'libs/table';
import moment from 'moment';
import Parse from 'parse/react-native';
import {Bar as Progressbar} from 'react-native-progress';

export default class Updates extends Component {
	constructor(props) {
		super(props);
		this.state = {
			updates:[],
			loading:true,
			error:false,
			busy:false,
			rateTags:[]
		}
		this.upItems = [];
	}

	componentDidMount() {
		this.loadUpdates();
		DeviceEventEmitter.addListener(helper.RATE_ADDED_HOOK, this.updateTask);
	}

	componentWillUnmount() {
		DeviceEventEmitter.removeAllListeners(helper.RATE_ADDED_HOOK);
	}

	updateTask = (data) => {
		const updates = this.state.updates;
		const index = this.state.updates.findIndex(t => t.id == data.task_id);
		if(index == -1){
			return
		}else{
			updates[index].rating = data.rating;
			updates[index].rating_id = data.id;
			this.setState({updates});
		}
	}

	loadUpdates = async () => {	    
		this.setState({loading: true,error:false})		
		const skip = this.state.updates.length;
		const r_tags = skip == 0;
		const limit = 10;
		Parse.Cloud.run("getOrderHistory", {limit,user_id,r_tags,skip}).then(({status, data}) => {			
			this.setState({loading:false,updates:[...this.state.updates, ...data.updates]}, () => {
				if(r_tags){
					this.setState({
						rateTags:data.rateTags
					})
				}
			});

		}).catch(err => {
			console.log(err)
			ToastAndroid.show('Unable To Load Data!', ToastAndroid.SHORT);
			this.setState({error:true})
		});
	}

	handlerOrderAgain = (order_id) => {
		this.setState({busy: true});
		Parse.Cloud.run("orderAgain", {order_id}).then(({data, status}) => {
			this.setState({busy: false});
			if(status == 200){
				ToastAndroid.show('Items added to cart successfully!', ToastAndroid.SHORT);
				this.props.navigation.navigate('Cart')
			}else{
				ToastAndroid.show(data, ToastAndroid.SHORT);
			}
		}).catch(err => {
			this.setState({busy:false}, () => {
				ToastAndroid.show('Please try again!', ToastAndroid.SHORT);
			})
		})
	}

	handleCall = (number) => {
		Linking.openURL(`tel:${number}`)
	}

	rateCurrentOrder(task_id, rating_id){
		this.props.navigation.navigate('RateService', {
			task_id,
			rating_id,
			rateTags:this.state.rateTags
		})
	}

	navBack = () => {
    	this.props.navigation.goBack();
    }

    refresh = () => {
    	this.setState({
    		updates:[]
    	}, this.loadUpdates)
    }
	render() {
		const {
			updates,			
			loading
		} = this.state;
		return (
			<View style={s.hldr}>
			 <NHeader
			  color={helper.white}
			  title={"Order History"}
			  loading={loading}
			  onPressBack={this.navBack}
			 />
			 <FlatList
		      data={updates}
		      keyExtractor={(item) => item.id}
		      renderItem={this.renderItem}
		      onEndReached={this.loadUpdates}
		      style={{paddingTop:10}}
			  onEndReachedThreshold={0.01}
			  refreshControl={<RefreshControl refreshing={false} onRefresh={this.refresh} colors={[helper.primaryColor, "#000"]} />}
		    />
		    <DialogInput ref={ref => this.dialogInput = ref} />
			</View>
		)
	}
	onTrackRq(task_id){
		this.props.navigation.navigate('LiveTracking', {task_id})
	}
	renderItem = ({ item }) => {
	  	return (
	  	  <Order      
	       data={item}
	       rateOrder={rating_id => this.rateCurrentOrder(item.id, rating_id)}
	       orderAgain={() => this.handlerOrderAgain(item.order_id)}
	       startLiveTracking={() => this.onTrackRq(item.id)}
	      />
	  	)			      	
	}
	renderHistory = () => {
		return (
			<TouchableOpacity activeOpacity={0.9} style={{width:50,height:'100%',justifyContent:'center',alignItems:'center'}}>
			 <Icon name={'recent'} size={30} color={helper.primaryColor} />
			</TouchableOpacity>
		)
	}
		      
}

class Order extends Component {
	constructor(props){
		super(props)
		this.state = {

		}
	}
	componentDidMount(){
		let time = moment.unix(this.props.data.time).format('HH:MM A')
		this.setState({time})
	}
	call = (phoneNumber) => {
		if(phoneNumber.length > 0){
			Linking.openURL(`tel:${phoneNumber[0]}`)
		}		
	}
	render() {
		const {
			data,
			startLiveTracking,
			orderAgain,
			rateOrder
		} = this.props;		
		return (
			<View style={s.itmC}>
			 <Text style={s.itmTT}>#{data.id}</Text>
			 <View style={{flexDirection: 'row'}}>
				 <View style={{width:'50%',padding:10,borderRightWidth:1,borderColor:helper.greyw}}>					 
					 <TextIcon
					  color={helper.grey}
					  text={`${data.item_count > 1 ? `${data.item_count} Items` : '1 Item'}  Ordered!`}
					  size={15}
					  style={{marginBottom:4}}
					  icon={'cart'}
					 />
					 <TextIcon
					  color={helper.grey}					  
					  text={`Time: ${this.state.time}`}
					  size={14}
					  style={{marginBottom:4,width:'100%'}}
					  icon={lang.tm}
					 />	
				 </View>
				 <View style={{width:'50%',padding:5}}>
				     <Text style={s.itmDc}>Amount : {lang.rp}{data.total_amt}</Text>
				     <Text style={s.itmDc}>Pay Mode : {data.pay_method == 1 ? 'ONLINE' : 'COD'}</Text>				     
				 </View>
			 </View>
			 
			 {/*data.status != helper.ORDER_DELIVERED ? <TouchableOpacity activeOpacity={0.7} onPress={orderAgain} ><View style={s.vcrd2}>
			  <Text style={[s.ltr, {color:helper.primaryColor}]}>Order Again</Text>
			 </View></TouchableOpacity> : null*/}

			 {data.status == helper.ORDER_DELIVERED ? this.renderRating(data, rateOrder) : null}

			 <TouchableOpacity activeOpacity={0.7} onPress={startLiveTracking} ><View style={s.vcrd}>
			  <Text style={s.ltr}>View Details</Text>
			 </View></TouchableOpacity>
			</View>
		)
	}

	renderRating = (data, rateOrder) => {
		if(data.rating_id == undefined || data.rating_id == ''){
			return (				
				<TouchableOpacity activeOpacity={0.7} onPress={() => rateOrder(false)} ><View style={s.vcrd2}>
				  <Text style={[s.ltr, {color:helper.primaryColor}]}>Rate Order</Text>
				</View></TouchableOpacity>
			)
		}else{
			return (
				<TouchableOpacity activeOpacity={0.7} onPress={() => rateOrder(data.rating_id)}><View style={s.vcrd2}>
				  <Text style={[s.ltr, {color:helper.primaryColor}]}>Your Rating • {data.rating}</Text>
				</View></TouchableOpacity>
			)
		}	
	}
}

const s = StyleSheet.create({
	hldr:{		
		backgroundColor:helper.homeBgColor,
		height:'100%',
		width:'100%'
	},
	csl:{fontSize:13,color:helper.silver,marginTop:12,fontWeight:'bold',width:'100%',textAlign:'center'},
	sec:{width:80,height:90,justifyContent:'center',alignItems:'center',backgroundColor:'black'},
	sect:{fontSize:13,textAlign:'center',fontWeight:'bold',color:helper.primaryColor},
	itmC:{
		backgroundColor:helper.white,
		elevation:12,
		width:'93%',
		marginBottom:17,
		borderRadius:12,
		alignSelf:'center',
		paddingBottom:10,
		paddingTop:3,
		paddingHorizontal:5
	},
	itmTT:{
		fontSize:16,
		color:helper.grey,
		margin:5,
		color:helper.primaryColor
	},
	tt:{
		fontSize:14,
		fontWeight:'bold',
		color:helper.primaryColor,
		marginBottom:5,
		marginTop:5
	},
	itmDc:{
		fontSize:14,
		fontWeight:'bold',
		color:helper.grey,
		marginLeft:18		
	},
	itmDx:{
		fontSize:12,		
		fontWeight:'bold',
		color:helper.white,
		marginBottom:2,
	},
	itmDz:{
		fontSize:13,		
		color:helper.grey,
		marginBottom:2,		
	},
	seprator:{
		backgroundColor:helper.grey5,
		width:'100%',
		height:34,
		marginBottom:10
	},	
	spt:{
		justifyContent:'center',
		height:30
	},
	ftr:{
		height:40,
		width:'100%',
		justifyContent:'center',
		paddingLeft:10,
		borderTopWidth:1,
		borderColor:helper.borderColor
	},
	ftrTxt:{
		color:helper.green,
		width:'90%',
		fontSize:16,
	},
	stxt:{
		fontSize:15,
		fontWeight:'bold',
		color:helper.silver,
		marginHorizontal:5
	},
	tbc:{height:70,width:70,justifyContent:'center',alignItems:'center'},
	srow:{
		flexDirection:'row',
		marginLeft:5
	},
	ltr:{
		fontSize:16,
		color:helper.white,
		textAlign:'center'
	},
	vcrd2:{borderRadius:10,borderWidth:1,padding:10,marginTop:5,width:'95%',alignSelf:'center', borderColor:helper.primaryColor},
	vcrd:{borderRadius:10,padding:10,marginTop:5,width:'95%',alignSelf:'center', backgroundColor:helper.primaryColor},
	qq:{backgroundColor:'#242424',paddingVertical:3,paddingHorizontal:10,fontSize:14,fontWeight:'bold',position:'absolute',top:-14,right:5,borderTopLeftRadius:6,borderTopRightRadius:6}
})