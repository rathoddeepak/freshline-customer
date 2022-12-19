import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ToastAndroid,
	Linking,
	TouchableOpacity,
	RefreshControl
}  from 'react-native';
import {
	Icon,	
	Dazar,
	Image,
	Button,
	CHeader,
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
export default class Updates extends Component {
	constructor(props) {
		super(props);
		this.state = {
			updates:[],
			loading:false,
			error:false,
			busy:false	
		}
		this.upItems = [];
	}

	componentDidMount() {
		this.loadingUpdates();
	}

	loadingUpdates = async () => {	    
		this.setState({loading: true,error:false,updates:[]})		
		try {
			const query = new Parse.Query(helper.tbls.TK);
			query.equalTo("user_id", user_id);
			query.greaterThan("status", helper.ORDER_CREATED);
			query.lessThan("status", helper.ORDER_DELIVERED);
			query.select(["status", "item_count", "time", "total_amt", "pay_mode"])
			const tasks = await query.find();
			const updates = [];
			for(let task of tasks){
				const {id, attributes:{status, item_count, time, total_amt, pay_mode}} = task;
				updates.push({id, status, item_count, time, total_amt, pay_mode})
			}
			this.setState({loading:false,updates});
		}catch(err){
			console.log(err)
			this.setState({loading:false,error:true})
		}
	}

	handleCall = (number) => {
		Linking.openURL(`tel:${number}`)
	}

	navBack = () => {
    	this.props.navigation.goBack();
    }

    navHistory = () => {
    	this.props.navigation.navigate("History");
    }

	render() {
		const {
			updates,			
			busy
		} = this.state;
		return (
			<View style={s.hldr}>
			 {this.renderBar()}
			 <FlatList
		      data={updates}
		      keyExtractor={(item) => item.id}
		      showsVerticalScrollIndicator={false}
		      stickySectionHeadersEnabled
		      refreshControl={<RefreshControl
	            colors={[helper.primaryColor, helper.blk]}
	            refreshing={false}
	            onRefresh={this.loadingUpdates.bind(this)} />
		      }
		      renderItem={this.renderItem}
		      ListFooterComponent={this.renderFooter}
		      ListHeaderComponent={this.renderHeader}
		    />	
		    {/*<View style={s.ftr}>
		     <Text style={s.ftrTxt}><Text style={{color:helper.white}}>Contact Us For</Text> Help!</Text>
		    </View>*/}
		    <LoadingModal visible={busy} />		
		    <DialogInput ref={ref => this.dialogInput = ref} />
			</View>
		)
	}
	renderBar = () => {
		return (
			<View style={s.headerCover}>			
			 <Text style={s.headerTxt}>Orders</Text>		
			 <View style={s.headerRow}>
				 <View style={s.headerButton1}>
				   <Text style={s.headerBtnTxt1}>Current Orders</Text>
				 </View>
				 <TouchableOpacity style={s.headerButton2} onPress={this.navHistory}>
				   <Text style={s.headerBtnTxt2}>Past Orders</Text>
				 </TouchableOpacity>
			 </View>
			</View>
		)
	}
	renderFooter = () => {
		return (
			<View style={{height:50}} />
		)
	}
	renderHeader = () => {
		return (
			<View style={{marginTop:15}}>
				<Dazar
			      loading={this.state.loading}
			      error={this.state.error}
			      length={this.state.updates.length}
			      onRetry={this.loadingUpdates}
			      emptyOther
				  emptyCustom="No Ongoing Orders..."
			    />
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
	       startLiveTracking={() => this.onTrackRq(item.id)}
	      />
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
			startLiveTracking			
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
					  style={{marginBottom:4,fontWeight:'bold'}}
					  icon={'cart'}
					 />
					 <TextIcon
					  color={helper.grey}					  
					  text={`Time: ${this.state.time}`}
					  size={14}
					  style={{marginBottom:4,width:'100%',fontWeight:'bold'}}
					  icon={lang.tm}
					 />	
				 </View>
				 <View style={{width:'50%',padding:5}}>
				     <Text style={s.itmDc}>Amount : {lang.rp}{data.total_amt}</Text>
				     <Text style={s.itmDc}>Pay Mode : {data.pay_method == 1 ? 'ONLINE' : 'COD'}</Text>				     
				 </View>
			 </View>
			 <TouchableOpacity activeOpacity={0.7} onPress={startLiveTracking} ><View style={s.vcrd}>
			  <Text style={s.ltr}>Live Tracking</Text>
			 </View></TouchableOpacity>
			</View>
		)
	}
}

const s = StyleSheet.create({
	headerCover:{
		paddingBottom:7,
		width:'100%',
		elevation:24,
		backgroundColor:helper.primaryColor
	},
	headerTxt:{
		fontSize:22,
		color:helper.white,
		marginLeft:7,
		marginBottom:5,
		marginTop:10		
	},
	headerRow:{
		flexDirection:'row',
		justifyContent:'space-around',
		height:35,
		alignItems:'center'
	},
	headerButton1:{
		height:30,
		width:'45%',
		borderRadius:7,
		backgroundColor:helper.white,
		elevation:17,
		justifyContent:'center',
	},
	headerBtnTxt1:{
		color:helper.primaryColor,
		textAlign:'center',
		fontFamily:'sans-serif-medium',
		fontSize:15
	},
	headerButton2:{
		height:30,
		width:'45%',
		borderRadius:7,		
		justifyContent:'center',
		backgroundColor:helper.secondaryColor
	},
	headerBtnTxt2:{
		color:helper.primaryColor,
		textAlign:'center',
		fontFamily:'sans-serif-medium',
		fontSize:15
	},
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
		elevation:26,
		width:'93%',
		marginBottom:15,
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
	vcrd:{borderRadius:10,padding:10,marginTop:5,width:'95%',alignSelf:'center', backgroundColor:helper.primaryColor},
	qq:{backgroundColor:'#242424',paddingVertical:3,paddingHorizontal:10,fontSize:14,fontWeight:'bold',position:'absolute',top:-14,right:5,borderTopLeftRadius:6,borderTopRightRadius:6}
})