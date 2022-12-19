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
	Button,
	NHeader,
	Image,
	FoodCard3
} from 'components';
import request from 'libs/request';
import lang from 'assets/lang';
import helper from 'assets/helper';
import moment from 'moment';
const limit = 10;
export default class HotelVisits extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visits:[],
			error:false,
			loading:false
		}
	}
	componentDidMount() {
		this.loadVisits();
	}
	loadVisits = async () => {
		if(this.state.end)return;		
		let visits = this.state.visits;
		const offset = visits.length;		
		this.setState({loading: true,error:false})		
		var res = await request.perform('visits', {
			req:'gevst',
			limit,
			user_id,
			offset	
		});		
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200){
			visits = offset == 0 ? res.data : [...visits, ...res.data];
			const end = res.data.length < limit;
			this.setState({visits,end});
		} else if(offset == 0){			
			this.setState({error:true});
		}
	}
	refresh = () => {
		this.setState({end:false,visits:[]}, () => {
			this.loadVisits();
		});
	}

	invoice = ({items, taxes, total_amt}, time) => {
		if(items.length == 0){
			this.pls();
			return;
		} 
		let entities = [];		
		items.forEach((item) => {
			let total = item.price * item.quantity;			
			entities.push({
				title: item.name,
				quantity: item.quantity,
				total,
				amount:item.price
			})
		});
		let title = 'Food Ordering';		
		this.props.navigation.navigate('Invoice', {
			title2:'Food Ordering',
			totalAmount:total_amt,
			entities,
			taxes,
			title,
			time
		});
	}
	navBack = () => {
    	this.props.navigation.goBack();
    }
	render() {
		const {			
			error,
			loading,		
			visits
		} = this.state;
		return (
			<View style={helper.main2}>
			 <NHeader title={lang.z[cl].myvst} onPressBack={this.navBack} />
			 <FlatList
			  data={visits}
			  onEndReachedThreshold={0.01}
			  ListHeaderComponent={() => 
			    <Dazar
			      loading={loading}
			      error={error}
			      emptyOther
			      onRetry={this.loadVisits}
			      length={visits.length}
			    />
			  }
			  onEndReached={this.loadVisits}
			  renderItem={this.renderItem}
			  refreshControl={<RefreshControl refreshing={false} onRefresh={this.refresh} colors={[helper.primaryColor, "#000"]} />}
			 />
			</View>
		)
	}
	renderItem = ({item}) => {		
		const date = moment(item.timestamp).format('DD-MM-YYYY');
		const time = moment(item.timestamp).format('HH:mm a');
		return (
			<View style={s.itm}>
			    
			    <View style={helper.row}>
					<View style={{width:'74%'}}>
					 <Text style={s.tt}>{item.vendor_name}</Text>
					 <Text style={s.dd}>You Visited on {date} at {time}</Text>				 
					</View>
					<View style={s.gr}>
					    <Image
					        sty={s.vimg}
						    imgSty={helper.max}
						    borderRadius={100}
						    hash={item.vendor_hash}
						    source={{uri:helper.site_url + item.vendor_logo}}
					     />
					</View>
				</View>
				<FlatList				     
			     data={item.items}			     
			     showsHorizontalScrollIndicator={false}		     			     
			     contentContainerStyle={{maxHeight:230,flexDirection:'column',flexWrap:'wrap'}}    
			     horizontal
			     renderItem={bunch =>
			      <FoodCard3
			       imgRadius={100}
			       borderRadius={10}			       
			       data={bunch.item}
				   menuPrice
			       width={240}
			       cStyle={{margin:5}}
			      />
			     }
	             keyExtractor={(item, index) => index.toString()}
			   />
			   <Button
			       text={lang.z[cl].inv}
			       size={16}
			       br={30}
			       onPress={() => this.invoice(item, item.time)}
			       hr={20}
			       style={{alignSelf:'flex-end'}}		       
			      />

			</View>
		)
	}
}

const s = StyleSheet.create({
	itm:{
		backgroundColor:helper.grey2,		
		alignSelf:'center',
		borderRadius:10,
		marginBottom:5,
		width:'90%',
		marginTop:5,
		padding:10
	},
	dd:{		
		color:helper.white,
		fontWeight:'bold',
		fontSize:12,
		marginTop:5
	},
	tt:{
		fontWeight:'bold',
		color:helper.primaryColor,
		fontSize:16,		
	},
	vimg:{
		width:55,
		height:55
	},
	gr:{
		width:'26%',
		alignItems:'center',
		justifyContent:'center'
	}
})