import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	RefreshControl
} from 'react-native';
import {
	Dazar,
	NHeader
} from 'components';
import request from 'libs/request';
import lang from 'assets/lang';
import helper from 'assets/helper';
import Parse from 'parse/react-native';

const limit = 10;
export default class Refunds extends Component {
	constructor(props) {
		super(props)
		this.state = {
			refunds:[],
			error:false,
			loading:false
		}
	}
	componentDidMount() {
		this.loadRefunds();
	}
	loadRefunds = async () => {
		let refunds = this.state.refunds;
		const offset = refunds.length;
		this.setState({loading: true,error:false})		
		Parse.Cloud.run("getRefunds", {user_id, offset}).then(({status, data}) => {
			this.setState({loading:false})		
			if(status == 200){
				this.setState({refunds:[...this.state.refunds, ...data]});
			}else{
				this.setState({error:true});
			}
		}).catch(err => {
			this.setState({loading:false,error:true});
		});
	}
	refresh = () => {
		this.setState({end:false,refunds:[]}, () => {
			this.loadRefunds();
		});
	}
	navBack = () => {
    	this.props.navigation.goBack();
    }
	render() {
		const {		
			refunds,
			loading
		} = this.state;
		return (
			<View style={s.main}>
			 <NHeader loading={loading} title={lang.z[cl].rfds} onPressBack={this.navBack} />			 
			 <FlatList
			  data={refunds}
			  contentContainerStyle={{paddingTop:15}}		  
			  onEndReachedThreshold={0.01}
			  ListFooterComponent={this.renderFooter}
			  onEndReached={this.loadRefunds}			  
			  renderItem={this.renderItem}
			  refreshControl={<RefreshControl refreshing={false} onRefresh={this.refresh} colors={[helper.primaryColor, "#000"]} />}
			 />			 
			</View>
		)
	}
	renderItem = ({item}) => {
		const {title,desc} = getRfStatus(item.status);
		return (
			<View style={s.itm}>
				<View style={s.g}>
				 <Text style={s.tt}>#{item.id}</Text>
				 <Text style={s.dd}>{lang.z[cl].crtd}: {item.time}</Text>
				 <Text style={s.dd}>Status:{title}</Text>
			     <Text style={s.dd}>ORDER ID: {item.task_id}</Text>
				</View>
				<View style={s.gr}>
				 <Text style={s.am}>{lang.rp}{item.amt}</Text>				 
				</View>
			</View>
		)
	}

	renderFooter = () => {
		const {			
			error,
			loading,		
			refunds
		} = this.state;
		if(loading)return null;
		return (
			<Dazar
		      loading={loading}
		      error={error}
		      emptyOther
		      onRetry={this.loadRefunds}
		      length={refunds.length}
		    />
		)
	}
}

const s = StyleSheet.create({
	g:{
		width:'70%',
		padding:6
	},
	main:{
		backgroundColor:helper.homeBgColor,
		height:'100%',
		width:'100%'
	},
	itm:{
		backgroundColor:helper.white,
		elevation:12,
		flexDirection:'row',		
		alignSelf:'center',
		borderRadius:10,
		marginBottom:20,
		width:'90%',
		padding:10
	},
	dd:{		
		color:helper.grey,
		fontSize:15,
		marginTop:5
	},
	tt:{
		fontWeight:'bold',
		color:helper.primaryColor,
		fontSize:16,		
	},
	am:{
		fontSize:22,
		fontWeight:'bold',
		color:helper.blk
	},
	gr:{
		width:'30%',
		alignItems:'center',
		justifyContent:'center'
	}
})

function getRfStatus (status) {
	if(status == helper.REFUND_CREATED){
		var title = "Request Submitted";
		var desc = "Your Money Will Refunded Soon!";        
	}else if(status == helper.REFUND_PROCESSED){
		var title = "Processed Successfully!";
		var desc = "You Should Able See Money In Account Now or Shortly";        
	}else if(status == helper.REFUND_SUCCESS){
		var title = "Successfully Refunded!";
		var desc = "You Should Able See Money In Account Now!";    
	}else if(status == helper.REFUND_FAILED){
		var title = "Pending!";
		var desc = "We Will Refund Your Amount Within 24 Hours, I problem persists we will call you!";    
	}
	return {title,desc}
}