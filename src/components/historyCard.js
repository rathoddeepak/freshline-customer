import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList
} from 'react-native';	
import Button from './button';
import Image from './image'
import TextIcon from './texticon';
import FoodCard2 from './foodCard2';
import helper from 'assets/helper';
import lang from 'assets/lang';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import tbl from 'libs/table';
function getAnim(anim) {	
	switch(anim){
		case 'dl':
			return require('assets/anims/delivered.json');
		case 'ck':
			return require('assets/anims/cooking.json');					
		case 'pp':
			return require('assets/anims/confirm.json');
		case 'ow':
			return require('assets/anims/delivery.json');
		case 'wt':
			return require('assets/anims/waiting.json');
		case 'cn':
			return require('assets/anims/sad.json');
	}
}

function getStatus(anim) {
	switch(anim){
		case 'dl':
			return 'Delivered';
		case 'ck':
			return 'Cooking';					
		case 'pp':
			return 'Food Prepared';
		case 'ow':
			return 'On The Way';
		case 'wt':
			return 'Waiting For Confirmation';
		case 'cn':
			return 'Cancelled';
	}
}

export default class HistoryCard extends Component {
	currentRef = () => {
		return this.current;
	}
	render() {
		const {
			data			
		} = this.props;
		if(data.type == helper.BOOKINGS){
			return (
				 <TableCard
				  ref={ref => this.current = ref}
				  data={data}
				  onInvoice={() => this.props.onTableInvoice(data)}
			      onCancel={() => this.props.onTableCancel(data.id)}
				 />
			)
		}else if(data.type == helper.ORDERS){
			return (
				<OrderCard
				  ref={ref => this.current = ref}
				  data={data}
				  onTrack={() => this.props.onTrackRq(data.id, data.order_code)}
				  onInvoice={() => this.props.onOrderInvoice(data)}
				/>
			)
		}		
	}
}


class OrderCard extends Component {
	render() {
		const {
			data,			
			onInvoice,
			onTrack
		} = this.props;		
		return (
			<View style={s.itmC}>
			 <Text style={s.itmTT}>{data.order_code}</Text>
			 <View style={{flexDirection: 'row'}}>
				 <View style={{width:'50%',padding:10,borderRightWidth:1,borderColor:helper.greyw}}>					 
					 <TextIcon
					  color={helper.silver}
					  text={`Order From ${data.vendors} Resturants`}
					  size={15}
					  style={{marginBottom:4}}
					  icon={lang.bdg}
					 />
					 <TextIcon
					  color={helper.silver}					  
					  text={`Time: ${data.time_string}`}
					  size={15}
					  style={{marginBottom:4}}
					  icon={lang.tm}
					 />	
					 <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
					    <Button
					       text={'Bill Of Your Food'}
					       size={14}
					       br={30}
					       style={{marginTop:4,marginRight:4,alignSelf:'center'}}					       
					       onPress={onInvoice}
					       hr={15}		       
					    />
						<Button
					       text={'Overview'}
					       size={14}
					       br={30}
					       style={{marginTop:4,marginRight:4,alignSelf:'center'}}					       
					       onPress={onTrack}
					       hr={15}		       
					    />				    
					 </View>					
				 </View>
				 <View style={{width:'50%',padding:5}}>
				     <Text style={s.itmDc}>Amount : {lang.rp}{data.total}</Text>
				     <Text style={s.itmDc}>Pay Mode : {data.pay_method == 1 ? 'ONLINE' : 'COD'}</Text>
				     <View style={{width:150,height:150,alignSelf:'center'}}>
				     <LottieView				        
				        autoPlay
				        loop				        
				        style={{alignSelf:'center'}}
				        source={getAnim(data.anim)}
				     />
				     </View>
				     <Text style={[s.itmDc, {textAlign:'center'}]}>{getStatus(data.anim)}</Text>
				 </View>
			 </View>
			 <View style={{width:'95%',alignSelf:'center'}}>
				 <Text numberOfLines={1} style={s.tt}>ITEMS</Text>
				 <FlatList				     
				     data={data.food_items}			     
				     showsHorizontalScrollIndicator={false}		     
				     horizontal={true}
				     renderItem={({item,index}) =>
				      <FoodCard2 data={item} width={240} cStyle={{margin:5}} />
				     }
		             keyExtractor={(item, index) => index.toString()}
				 />
			 </View>
			</View>
		)
	}
}


class TableCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fTime:'',
			tTime:''
		}
	}
	componentDidMount(){
		const {from_time, to_time, status} = this.props.data;
		let cancel = status === helper.CANCELED;
		let fTime = moment(parseInt(from_time) * 1000).format('hh:mm a');
		let tTime = moment(parseInt(to_time) * 1000).format('hh:mm a');
		this.setState({fTime,tTime,cancel});
	}
	cancel = () => {
		this.setState({cancel:true})
	}
	render() {
		const {
			data,
			onCancel,
			onInvoice
		} = this.props;
		const {
			fTime,
			tTime,
			cancel
		} = this.state;
		const {t, c} = tbl.status(data.status, data.id, data.tableno);
		return (
			<View style={s.itmC}>
			 <Text style={[s.itmTT, {color:helper.primaryColor}]}>Booking ID - {data.id}</Text>
			 <View style={s.srow}>
			  <View style={s.tbc}>
			   <Image
		        sty={{height:65,width:65}}
			    imgSty={helper.max}
			    borderRadius={100}
			    hash={data.vendor.hash}
			    source={{uri:helper.site_url + data.vendor.image}}
		       />
			  </View>
			  <View style={{width:190,marginLeft:5,marginTop:5}}>			   
			   <Text style={s.itmDc}>{data.vendor.name}</Text>
			   {data.tableno == 0 ? null : <Text style={s.itmDx}>You Got Table No. {data.tableno}</Text>}
			   <Text style={s.itmDz}>Form {fTime} to {tTime}</Text>
			   <Text style={s.itmDz}>Number of Peoples : {data.people}</Text>
			  </View>
			 </View>

			 {data.items?.length > 0 ? <View style={{width:'95%',alignSelf:'center'}}>
				 <Text numberOfLines={1} style={s.tt}>ITEMS</Text>
				 <FlatList				     
				     data={data.items}			     
				     showsHorizontalScrollIndicator={false}		     
				     horizontal={true}
				     renderItem={({item,index}) =>
				      <FoodCard2 data={item} width={240} cStyle={{margin:5}} />
				     }
		             keyExtractor={(item, index) => index.toString()}
				 />
			 </View> : null}
			 
			 {cancel ?			 
			  <Text style={s.csl}>{lang.z[cl].cnld}</Text>			 
			 : <View style={{flexDirection: 'row',justifyContent: 'flex-end'}}>
			  <Button
		       text={lang.z[cl].cnl}
		       size={16}
		       br={30}
		       style={{marginRight:5,marginTop:4}}
		       disabled={!data.canCancel}
		       bgColor={helper.greyw}
		       onPress={onCancel}
		       hr={20}		       
		      />
			  <Button
		       text={lang.z[cl].inv}
		       size={16}
		       br={30}
		       style={{marginRight:5,marginTop:4}}
		       onPress={onInvoice}
		       hr={20}		       
		      />		      
			 </View>}
			 <Text style={[s.qq, {color:c}]}>{t}</Text>
			</View>
		)
	}
}
const s = StyleSheet.create({	
	itmC:{
		backgroundColor:helper.grey5,
		width:'93%',
		marginBottom:10,		
		borderRadius:12,
		marginTop:20,
		alignSelf:'center',
		paddingBottom:10,
		paddingTop:3,
		paddingHorizontal:5
	},
	itmTT:{
		fontSize:18,
		fontWeight:'bold',
		color:helper.silver,
		margin:5,		
	},
	itmDc:{
		fontSize:14,
		fontWeight:'bold',
		color:helper.silver			
	},
	itmDz:{
		fontSize:13,		
		color:helper.silver,
		marginBottom:2,		
	},
	itmDx:{
		fontSize:12,		
		fontWeight:'bold',
		color:helper.white,
		marginBottom:2,
	},
	tt:{
		fontSize:14,
		fontWeight:'bold',
		color:helper.primaryColor,
		marginBottom:5,
		marginTop:5
	},
	csl:{fontSize:13,color:helper.silver,marginTop:12,fontWeight:'bold',width:'100%',textAlign:'center'},
	tbc:{height:70,width:70,justifyContent:'center',alignItems:'center'},
	srow:{
		flexDirection:'row',
		marginLeft:5
	},
	qq:{backgroundColor:helper.grey5,paddingVertical:3,paddingHorizontal:10,fontSize:14,fontWeight:'bold',position:'absolute',top:-14,right:5,borderTopLeftRadius:6,borderTopRightRadius:6}
})