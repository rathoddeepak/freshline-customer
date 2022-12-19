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
	CHeader	
} from 'components';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
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
		this.loadFeedbacks();
	}

	loadFeedbacks = async () => {    
		this.setState({loading: true,error:false,updates:[]})		
		try {
			Parse.Cloud.run('loadFeedbacks', {user_id,skip:this.state.updates.length}).then(({status, data}) => {
				this.setState({loading:false});
				if(status == 200){
					this.setState({
						updates:[...this.state.updates, ...data.list],types:data.types
					})
				}else{
					this.setState({loading:false,error:true})
				}
			}).catch(err => {
				console.log(err)
				this.setState({loading:false,error:true})
			})
		}catch(err){
			console.log(err)
			this.setState({loading:false,error:true})
		}
	}

    addNew = () => {
    	this.props.navigation.navigate("AddFeedback", {
    		types:this.state.types
    	});
    }

    openFeedback = (item) => {
    	const {id, type, time, status} = item;
    	this.props.navigation.navigate("FeedbackView", {id, type, time, status});
    }

	render() {
		const {
			updates,
			loading
		} = this.state;
		return (
			<View style={s.hldr}>
			 <CHeader
			  renderLeft={this.renderHistory}
			  text={"Feedbacks"}
			  loading={loading}
			 />	 
			 <FlatList
		      data={updates}
		      keyExtractor={(item) => item.id}
		      contentContainerStyle={{paddingTop:15,flex:1}}
		      showsVerticalScrollIndicator={false}
		      stickySectionHeadersEnabled
		      refreshControl={<RefreshControl
	            colors={[helper.primaryColor, helper.blk]}
	            refreshing={false}
	            onRefresh={this.loadFeedbacks.bind(this)} />
		      }
		      onEndReached={this.loadFeedbacks}
			  onEndReachedThreshold={0.01}
		      renderItem={this.renderItem}
		      ListFooterComponent={this.renderHeader}
		    />
			</View>
		)
	}
	renderHeader = () => {
		if(this.state.loading == true)return null;
		return (
			<Dazar
		      loading={this.state.loading}
		      error={this.state.error}
		      length={this.state.updates.length}
		      onRetry={this.loadFeedbacks}
		      emptyOther
			  emptyCustom="No Feedbacks Found..."
		    />
		)
	}
	renderItem = ({ item }) => {
	  	return (
	  	  <Feedback      
	       data={item}
	       navigate={() => this.openFeedback(item)}
	      />
	  	)			      	
	}
	renderHistory = () => {
		return (
			<TouchableOpacity onPress={this.addNew} activeOpacity={0.9} style={{width:50,height:'100%',justifyContent:'center',alignItems:'center'}}>
			 <Icon name={lang.pls} size={30} color={helper.white} />
			</TouchableOpacity>
		)
	}
		      
}

class Feedback extends Component {	
	render() {
		const {
			data,
			navigate			
		} = this.props;
		return (
			<>
			<TouchableOpacity activeOpacity={1} onPress={navigate} style={s.card}>
			 <View style={s.chipRow}>
			  <Text numberOfLines={1} style={s.tag}>{data.type}</Text>
			  {data.status == helper.FB_SEEN ? <Text style={[s.tag, {backgroundColor:helper.green}]}>Seen</Text> : null}
			 </View>
			 <Text style={s.text}>{data.text}</Text>
			 <Text style={s.crtTxt}>{data.time}</Text>
			</TouchableOpacity>
			{data.reply_count > 0 ? <View style={s.reply}>
			  <View style={s.arrow} />
			  <View style={s.replyBox}>
			   <Text style={s.replyTxt}>{data.reply_count} {data.reply_count == 1 ? 'Reply' : 'Replies'}</Text>
			  </View>
			 </View> : null}
			</>
		)
	}
}

const s = StyleSheet.create({
	hldr:{
		backgroundColor:helper.homeBgColor,
		height:'100%',
		width:'100%'
	},
	card:{
		width:'95%',
		borderRadius:10,
		elevation:12,
		backgroundColor:helper.white,
		padding:5,
		alignSelf:'center',
		paddingBottom:15
	},
	tag:{
		height:25,
		paddingVertical:3,
		paddingHorizontal:7,
		color:helper.bgColor,
		marginLeft:4,
		borderRadius:10,
		fontFamily:'sans-serif-medium',
		backgroundColor:helper.primaryColor
	},
	text:{
		fontSize:16,
		color:helper.grey,
		marginVertical:5,
		marginLeft:5,
		width:'98%'
	},
	chipRow:{
		flexDirection:'row',
		marginTop:3
	},
	crtTxt:{
		position:'absolute',
		bottom:4,
		right:10,
		fontSize:14,
		padding:0,
		fontFamily:'sans-serif-medium',
		color:helper.grey
	},
	reply:{
		flexDirection:'row',
		marginLeft:10,
		height:50
	},
	replyBox:{
		width:100,
		justifyContent:'center',
		alignItems:'center',		
		height:30,
		top:10,
		elevation:12,
		borderRadius:10,
		backgroundColor:helper.white
	},
	replyTxt:{
		fontSize:14,
		width:'100%',
		marginLeft:10,
		color:helper.primaryColor
	},
	arrow:{
		height:25,
		width:30,
		borderBottomWidth:2,
		borderLeftWidth:2,
		borderColor:helper.primaryColor
	}
})