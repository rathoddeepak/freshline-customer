import React, { Component } from "react";
import {View, StyleSheet, ToastAndroid, SectionList, Text, FlatList, ScrollView, TouchableNativeFeedback, Linking, Modal, Image} from "react-native";
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {TextIcon,FoodCard2,Icon,Dazar} from 'components';
import ProgressBar from 'react-native-progress/Bar';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import Order from 'libs/order';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Game from 'game';
import Parse from 'parse/react-native';
import ChatWootWidget from '@chatwoot/react-native-widget';
import _ from 'lodash';
import UserDB from 'libs/userdb';

function getMinOrMax(markersObj, minOrMax, latOrLng){
	if(minOrMax == 'max'){
	  return _.maxBy(markersObj, (value) => value[latOrLng])[latOrLng];
	}else{
	  return _.minBy(markersObj, (value) => value[latOrLng])[latOrLng];
	}
}
function getBounds (markersObj) {
	var maxLat = getMinOrMax(markersObj, "max", 1);
	var minLat = getMinOrMax(markersObj, "min", 1);
	var maxLng = getMinOrMax(markersObj, "max", 0);
	var minLng = getMinOrMax(markersObj, "min", 0);

	var southWest = {longitude:minLng, latitude:minLat};
	var northWest = {longitude:maxLng, latitude:maxLat};
	return [southWest, northWest];
}


const dimColor = '#E8F8FF';

const deliveryStages = [
 {icon:'bill2', percent:0.05,dot:false},
 {icon:'food', percent:0.15},
 {icon:'riderBike', percent:0.75},
 {icon:'checkbox', percent:1}
]

export default class LiveTracking extends Component {
	constructor(props) {
		super(props);
		this.state = {			
			order:{
				hotel:'',
				phone:'',
				status:'',
				desc:'',
				time_string:'',
				total_amt:0,
				pay_mode:1,
				order_code:'',
				food_items:[],
				anim:'wt'
			},
			title:'',
			pickupList:[],
			morigin:false,
			origin:null,
			destination:null,
			latitude: 0,
			longitude: 0,
			playing:false,
			percent:false	,
			pickups:[],
			showWidget:false
		}

		this.updatePickup = null;
		this.updateTaskSub = null;
		this.heroSub = null;
	}

	componentDidMount(){		
		this.loadData();
		this.setName();
	}

	setName = () => {
		let {name, user_id} = UserDB.getUser();
		this.setState({userName:name,user_id});		
	}

	componentWillUnmount () {
		this.removeListener();
	}

	loadData = async () => {
		let {task_id} = this.props.route.params;
		this.setState({task_id,loading: true,error:false,pickups:[],pickupList:[]});
		Parse.Cloud.run("startTracking", {task_id}).then(({status, data}) => {
			if(status == 200){
				data.time_string = moment.unix(data.time).format('hh:MM A | DD/MM/YY')
				this.setState({
					loading:false,
					order:data,
					pickups:data.pickups
				}, () => {
					this.processTracking(true);
					this.setPickupList()
				});
			}else{
				this.setState({loading:false,error:true});
			}
		}).catch(err => {
			this.setState({loading:false,error:true});
		});
	}

	processTracking = (attach = false) => {
		const {anim, pickups, deliveries, rider} = this.state.order;
		let percent = 5;
		let title = 'Processing Pickups!';		
		let destination = deliveries[0].location;
		let morigin = false;
		if(anim == 'ow'){
		  morigin = {
		  	latitude:rider.lat,
		  	longitude:rider.lng
		  } 
			title = 'Heading To Your Location!';
			percent = 75;		
		}else if(anim == 'lk'){
			title = 'Picking All Orders!';
			percent = 15;								
		}else if(anim == 'dl' || anim == 'cn'){
			if(anim == 'dl'){
				title = 'Delivered!';				
			}else if(anim == 'cn'){
				title = 'Sorry Cancelled 😔';				
			}
			let order = this.state.order;
			order['rider'] = undefined;
			this.setState({percent:1,morigin:null,title,order,origin:null,destination:null})
			return;
		}
		percent /= 100;
		let bounds = [];
		for(let pickup of pickups){
			bounds.push([
				pickup.location.longitude,
				pickup.location.latitude
			])
		}
		for(let delivery of deliveries){
			bounds.push([
				delivery.location.longitude,
				delivery.location.latitude
			])
		}
		let finalBounds = getBounds(bounds);
		this.setState({percent,morigin,title,destination})
		setTimeout(() => {
			this?.mapRef?.fitToCoordinates([finalBounds[0], finalBounds[1]],  {
			    edgePadding: { top: 150, right: 150, bottom: 150, left: 150 },animated:true
			})
			if(attach == true)this.liveAttach();
		}, 500)
	}

	setPickupList = () => {
		const pickups = this.state.pickups
		let pickupList = [];
		for(let pickup of pickups){
			const {id, items, name, status, agent_status} = pickup;
			pickupList.push({
				data:items,
				name,
				status:Order.getAgentStatus(status)
			});
		}
		this.setState({pickupList});
	}

	removeListener = () => {
		if(this.updatePickup != null)this.updatePickup.unsubscribe();
		if(this.updateTaskSub != null)this.updateTaskSub.unsubscribe();
		if(this.heroSub != null)this.heroSub.unsubscribe();		
	}

	liveAttach = async () => {
		this.removeListener();
		try {
			let order = this.state.order;
			const q = new Parse.Query(helper.tbls.PK);
			q.equalTo("task_id", order.id);
			q.select(["status", "agent_status", "task_id"]);
			this.updatePickup = await q.subscribe();
			this.updatePickup.on('update', (object) => {
				let pickups = this.state.pickups;
				let pickupIdx = pickups.findIndex(i => i.id == object.id);
				if(pickupIdx != -1){
					let updated = object.attributes;
					if(pickupIdx != -1){
						pickups[pickupIdx].status = updated.status;
						pickups[pickupIdx].agent_status = updated.agent_status;
					}					
					this.setState({pickups}, this.setPickupList);
				}
			});

			
			const q1 = new Parse.Query(helper.tbls.TK);
			q1.equalTo("objectId", order.id);
			q1.select(["status", "agent_status", "hero_id"]);
			this.updateTaskSub = await q1.subscribe();
			this.updateTaskSub.on('update', (object) => {
				let updated = object.attributes;
				if(order.rider.id != updated.hero_id){
					this.loadData();
					ToastAndroid.show("Delivery Hero Assigned!", ToastAndroid.SHORT);
					return;
				}
				order.anim = getTrackAnim(updated.status);
				this.setState({
					order
				}, () => {
					this.processTracking(false)
				})
			});


			if(order.rider != undefined){
				const q2 = new Parse.Query(helper.tbls.AG);
				q2.equalTo("objectId", order.rider.id);
				q2.select(["status", "location"]);
				this.heroSub = await q2.subscribe();
				this.heroSub.on('update', (object) => {
					let destination = {
						latitude:object.attributes.location.latitude,
						longitude:object.attributes.location.longitude,
					}
					this.setState({destination});
				});
			}

		}catch(err){
			
		}
	}

	makeCall = () => Linking.openURL(`tel:${this.state.order.rider.phone}`);
	callResturant = () => Linking.openURL(`tel:${this.state.order.phone}`);
	support = async () => {
		try {	      
	      Linking.openURL(`whatsapp://send?text=Help Me For Order Id = ${this.state.order.id}&phone=+917038193132`)
    } catch (error) {
      //Alert.alert(error.message)
    }
	}
	stopPlaying = () => {
		this.game?.exit()
		this.setState({playing:false})		
	}	
	onOrderInvoice = () => {
		let item = this.state.order;
		let entities = [];
		let totalAmount = 0;		
		for(let pickup of item.pickups){
			for(let item of pickup.items){
				entities.push({
					title: item.name,
					quantity: item.qty,
					total:item.total,
					amount:item.mrp
				})
			}
		}
		
		if(item.tip_amt != 0 && item.tip_amt != undefined){
			entities.push({title: 'Tip 🙏',quantity: 1,total:item.tmp_amt,amount:item.tmp_amt});
		}
		item.charges.forEach(charge => {
			entities.push({title:charge.name,quantity: 1,total:charge.amount,amount:charge.amount});
		});
		if(item.wallet != 0 && item.wallet != undefined){
			entities.push({title: 'Wallet -',quantity: 1,total:item.wallet,amount:item.wallet});
		}
		if(item.discount_amt != 0 && item.discount_amt != undefined){
			entities.push({title: 'Discount -',quantity: 1,total:item.discount_amt,amount:item.discount_amt});
		}
		entities.push({
				title: 'Delivery Charge',
				quantity: 1,
				total:item.delivery_fee,
				amount:item.delivery_fee
		});
		let title = 'Fresh Line Order';		
		this.props.navigation.navigate('Invoice', {
			title2:'Fresh Line Order',
			totalAmount:item.total_amt,
			entities,
			title,
			time:item.time_string,
			name:item.deliveries[0].name
		});
	}
	startPlaying = () => this.setState({playing:true})
	render() {
		const {
			order,
			playing,
			percent,
			title,			
			destination,
			morigin,
			loading,
			error,
			pickups,
			pickupList,
			showWidget,
			userName,
			user_id
		} = this.state;
		const anim = Order.getAnim(order.anim);
		const status = Order.getStatus(order.anim, order?.rider?.name);
		return (			
            <View style={s.main}>
						<View style={s.header}>
							<Text style={s.title}>ORDER ID: #{order.id}</Text>
						</View>
						<Dazar
						 length={1}
						 loading={loading}
						 error={error}
						 onRetry={this.loadData}
						/>
				    {loading == false && error == false ? <><ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
					  <View style={s.mapView}>
						 <MapView
						   style={{ ...StyleSheet.absoluteFillObject }}
						   ref={(ref) => { this.mapRef = ref }}
						   initialRegion={{
						      latitude: 18.4088,
						      longitude: 76.5604,
						      latitudeDelta: .005,
						      longitudeDelta: .005
						   }} >
						   
						   {morigin ? <MapViewDirections
							    origin={morigin}
							    destination={destination}
							    apikey={'AIzaSyDsyUiH0s5Vn2J25bYl8uihy29ZCWQeeeg'}
							    strokeWidth={5}
							    strokeColor={'#008bcf'}
						   /> : null}
						   
						   {order?.rider != undefined ? <Marker
						      coordinate={{ latitude:order.rider.lat, longitude:order.rider.lng }}
						      title={order.rider.name}
						      description='Our Delivery Hero'
						   >
						     <Image resizeMode="contain" source={require('assets/icons/hero.png')} style={{height: 35, width:35 }} />
						   </Marker>: null}

						   {pickups.map(this.renderPickups)}

						   {destination != null ? <Marker
						      coordinate={{latitude:destination.latitude, longitude:destination.longitude}}
						      title={'You Are Here'}
						      description='Your Location'
						   >
							    <Image resizeMode="contain" source={require('assets/icons/um.png')} style={{height: 35, width:35 }} />
						   </Marker>: null}
						</MapView>
					</View>



					<View><View style={s.dlvStat}>
						<View style={{width:'70%',height:'100%',justifyContent:'center'}}>
							<Text style={s.status}>{title}</Text>
							<Text style={s.desc}>{status}</Text>							
						</View>
						<View style={{width:'30%',height:'100%',justifyContent:'center'}}>
							<LottieView				        
								autoPlay
								loop
								style={{width:anim.size,height:anim.size,alignSelf:'center'}}
								source={anim.file}
							/>
						</View>              
						<View style={[{left:-3,position:'absolute',width:'101.55%',height:24,backgroundColor:helper.white,bottom:-23}, s.borderExtra]} />
					</View></View>

					<View style={[s.progressHolder, s.borderExtra]}>
						{this.renderIndicator(percent)}
					</View>

					<View style={s.borderExtra}>
					{order.rider != undefined ? 
						<View style={{borderRadius:10,alignSelf:'center',height:80,flexDirection:'row',justifyContent:'space-between',backgroundColor:helper.primaryColor,marginTop:9,width:'95%',marginTop:10}}>
						    <View style={{height:'100%',justifyContent:'center'}}>								
								<Text style={[s.status, {marginBottom:3,fontSize:22,color:helper.white}]}>{order.rider.name}</Text>
								<Text style={[s.desc, {color:helper.white}]}>Our Delivery Hero</Text>
							</View>
							<TouchableNativeFeedback onPress={this.makeCall}><View style={{width:45,marginRight:10,elevation:2,alignItems:'center',height:45,backgroundColor:helper.white,borderRadius:100,alignSelf:'center',justifyContent:'center'}}>
								<Icon name={lang.phn} size={30} color={helper.primaryColor} />							
							</View></TouchableNativeFeedback>
						</View>
					: null}
					
					<TouchableNativeFeedback onPress={this.startPlaying}>
					 <View style={s.play}>
					  <Text style={s.plyTxt}>Play Game</Text>
					 </View>
					</TouchableNativeFeedback>

					<Text style={s.itmTT}>#{order.id}</Text>
					<TextIcon
						color={helper.grey}
						text={`${order.item_count} ${order.item_count == 1 ? 'Item' : 'Items'} Ordered`}
						size={15}
						cstyle={s.mcw}
						style={s.mve}
						icon={lang.bdg}
					/>
					<TextIcon
						color={helper.grey}					  
						text={`Time: ${order.time_string}`}
						size={15}
						cstyle={s.mcw}
						style={s.mve}
						icon={lang.tm}
					/>
					<TextIcon
						color={helper.grey}					  
						text={`Amount : ${lang.rp}${order.total_amt}`}
						size={15}
						cstyle={s.mcw}
						style={s.mve}
						icon={lang.rup}
					/>
					<TextIcon
						color={helper.grey}					  
						text={`Pay Mode : ${order.pay_mode == 1 ? 'ONLINE' : 'COD'}`}
						size={15}
						cstyle={s.mcw}
						style={s.mve}
						icon={order.pay_mode == 1 ? lang.onl : lang.cod}
					/>
					{/*<SectionList				     
				     sections={pickupList}
				     renderItem={this.renderProductItem}
				     renderSectionHeader={this.renderPickupHeader}
				     keyExtractor={(item, index) => index.toString()}
					 />*/}
					 <Text style={{fontSize:50,color:helper.black,textAlign:'center',marginLeft:10,marginTop:20}}>Fresh Line</Text>
					<Text style={{color:helper.primaryColor,fontSize:15,width:'100%',textAlign:'center',marginBottom:35,top:-5}}>Online Meat Delivery App</Text>
					</View>								
				</ScrollView>
				<View style={{height:60,flexDirection:'row',backgroundColor:helper.white,elevation:24}}>
				 <TouchableNativeFeedback onPress={() => this.setState({showWidget:true})}><View style={{width:'50%',borderRightWidth:1, borderColor:helper.borderColor, justifyContent:'center',alignItems:'center'}}>
				    <MixIcon name={lang.hlctr} text={'Support'}  />
				 </View></TouchableNativeFeedback>
				 <TouchableNativeFeedback onPress={this.onOrderInvoice}><View style={{width:'50%',justifyContent:'center',alignItems:'center'}}>
				    <MixIcon name={lang.bl} text={'Receipt'}  />
				 </View></TouchableNativeFeedback>
				 {/*<TouchableNativeFeedback onPress={this.callResturant}><View style={{width:'33%',backgroundColor:helper.grey6,justifyContent:'center',alignItems:'center'}}>
				    <MixIcon name={lang.phn} text={'Restaurant'}  />
				 </View></TouchableNativeFeedback>*/}
				</View>
				</>
				: null}				
				<Modal visible={playing} onRequestClose={this.stopPlaying} animationType="slide">
				 <Game ref={ref => this.game = ref} />
				</Modal>

				{showWidget ? 
		          <ChatWootWidget
		            websiteToken={helper.chatwoot}
		            locale={'en'}
		            baseUrl={helper.chatwoot_base}
		            closeModal={() => this.setState({showWidget:false})}
		            isModalVisible={showWidget}
		            user={{name:`${userName} | ${user_id}`,identifier:`${user_id}@freshlineapp.com`}}
		            customAttributes={{type:'help'}}
		          />
		     : null}

        </View>
		)
	}

	renderIndicator = (stage) => {
		return (
			<View style={s.stageRow}>
				{deliveryStages.map((data, index) => {
					const color = data.percent <= stage ? helper.primaryColor : '#B7E9FF';
					return (					
						<>
						{data.dot == false ? null : <Text style={{fontSize:25,color:color}}> .........</Text>}
						<View style={{height:50,alignItems:'center',flexDirection:'row'}}>
						 <Icon name={data.icon} size={25} color={color} />
						</View>						
						</>
					)
				})}
			</View>
		)
	}

	renderPickups = (pickup) => {
		const {latitude, longitude} = pickup.location
		return <Marker
		      coordinate={{latitude, longitude}}
		      title={pickup.name}
		      description='Pickup Location'
		   >
		        <Image resizeMode="contain" source={require('assets/icons/hm.png')} style={{height: 35, width:35 }} />
		   </Marker>
	}

	renderProductItem = ({item}) => {
		return (
			<Text numberOfLines={2} style={s.itmName}>{item.qty}x  {item.name}</Text>
		)
	}

	renderPickupHeader = ({section : {name, status}}) => {
		return (
			<View style={{width:'95%',marginLeft:10,paddingTop:10,borderTopWidth:1,borderColor:helper.primaryColor}}>
			 <Text numberOfLines={1} style={{color:helper.white,fontSize:17}}>{name} <Text style={{fontSize:13}}>(STORE PARTNER)</Text></Text>
			 <Text numberOfLines={1} style={{color:status.color,fontSize:13,marginTop:1}}>> {status.text}</Text>
			</View>
		)
	}

}

class MixIcon extends Component {
	render(){
		const {name,text} = this.props;
		return (
			<>
			 <Icon name={name} size={30} color={helper.primaryColor} />
			 <Text style={{fontSize:12,marginTop:2,color:helper.primaryColor,width:'100%',textAlign:'center'}}>{text}</Text>
			</>
		)
	}
}


function getTrackAnim(status){
  if(status == helper.ORDER_DELIVERED){        
    return 'dl';
  }else if(status == helper.ORDER_PLACED){
    return 'wt';
  }else if(status == helper.PICKUP_START){
    return 'lk';
  }else if(status == helper.ORDER_PICKED){
    return 'ow';
  }else if(status == helper.ORDER_CANCEL){
    return 'cn';
  }else{
    return null;
  }
}

const s = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor:helper.white
  },
  borderExtra:{
  	borderRightWidth:3,
  	borderLeftWidth:3,
  	borderColor:helper.primaryColor
  },
  header:{
  	height:40,
  	backgroundColor:helper.primaryColor,
  	justifyContent:'center',
  	position:'absolute',
  	top:10,
  	borderTopRightRadius:10,
  	elevation:24,
  	borderBottomRightRadius:10,
  	width:175,
  	zIndex:1000
  },
  title:{
  	fontSize:12,
  	color:helper.white,
  	fontWeight:'bold',
  	marginLeft:10
  },
  mapView:{
  	height:390,
  	width:'100%',
  	backgroundColor:helper.bgColor
  },
  dlvStat:{
  	height:90,
  	backgroundColor:helper.white,
  	width:'100%',
  	flexDirection:'row',
  	borderTopLeftRadius:20,
  	borderTopRightRadius:20,
  	borderWidth:3,
  	borderColor:helper.primaryColor,
  	top:-20
  },
  status:{
  	fontSize:19,
  	color:helper.primaryColor,
  	marginLeft:10,
  	marginBottom:3  	
  },
  play:{
  	padding:10,
  	borderRadius:10,
  	marginTop:17,
  	marginBottom:10,
  	width:'96%',
  	alignSelf:'center',
  	backgroundColor:dimColor
  },
  plyTxt:{
  	fontSize:20,
  	textAlign:'center',
  	color:helper.primaryColor
  },
  desc:{
  	fontSize:14,
  	color:helper.grey,  	
  	marginLeft:10,
  },
  itmTT:{
		fontSize:18,
		fontWeight:'bold',
		margin:5,
		color:helper.primaryColor
  },
  stageRow:{
  	flexDirection:'row',
  	width:'85%',
  	alignSelf:'center'
  },
  progressHolder:{paddingBottom:10,width:'100%',height:70,justifyContent:'center',alignItems:'center',backgroundColor:helper.white, borderBottomWidth:1, borderColor:helper.borderColor},
  itmName:{width:'80%',fontSize:15,marginLeft:10,marginTop:5,color:helper.white},
  mve:{marginBottom:4,width:'100%'},
  mcw:{marginLeft:10}
});