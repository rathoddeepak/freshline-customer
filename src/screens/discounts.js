import React, {Component} from 'react';
import {
	View,
	Text,
	Image,
	FlatList,
	TouchableOpacity,
	RefreshControl,
	DeviceEventEmitter
} from 'react-native';
import helper from 'assets/helper';
import Icon from 'components/icon';
import Empty from 'components/empty';
import Err from 'components/err';
import Parse from 'parse/react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import addressController from 'libs/address';
import lang from 'assets/lang';

const dimColor = '#E8F8FF';
export default class Discounts extends Component {
	constructor(props){
		super(props)
		this.state = {
			coupuns:[],
			busy:true,
			error:false
		}
	}

	componentDidMount () {
		const {discount, totalAmount} = this.props.route.params;
		this.setState({discount, totalAmount}, this.loadDiscounts)
	}

	applyCurrent = ({id, title, desc, type, amount, percent}) => {
		let current = {id, title, desc, type, amount, percent};
		DeviceEventEmitter.emit(helper.DISCOUNT_HOCK, current);
		this.props.navigation.goBack();
	}

	back = () => {
		this.props.navigation.goBack();
	}

	loadDiscounts = async () => {
		this.setState({busy:true});
		const address = addressController.getCurrentAddress();
		Parse.Cloud.run('getDiscounts', {address, activeOnly:true}).then(({status, data}) => {
			if(status == 200){
				this.setState({busy:false}, () => {
					this.validateApply(data)
				});
			}else{
				this.setState({error:true,busy:false});
			}
		}).catch(err => {
			this.setState({error:true,busy:false});
		})
	}

	validateApply = (data) => {
		const coupuns = [];
		for(let discount of data){
			discount.valid = this.state.totalAmount >= discount.min_order;
			coupuns.push(discount)
		}
		this.setState({coupuns})
	}

	render () {
		const {
			coupuns
		} = this.state;
		return (
			<View style={s.main}>
			 <View style={s.header}>
			  <TouchableOpacity onPress={this.back} style={s.arrow}>
			   <Icon name='arw_back' color={helper.white} size={30} />
			  </TouchableOpacity>
			  <Text style={s.title}>Discounts</Text>
			 </View>			 
			 <FlatList
			  data={coupuns}
			  ListHeaderComponent={this.renderIndicator}
			  renderItem={this.renderCoupun}
			  ListFooterComponent={this.renderFooter}
			  refreshControl={<RefreshControl
	            colors={[helper.primaryColor, helper.blk]}
	            refreshing={false}
	            onRefresh={this.loadDiscounts} />
	          }
			 />
			</View>
		)
	}
	renderFooter = () => {
		return <View style={{height:30}} />
	}
	renderIndicator = () => {
		const {
			busy,
			error,
			coupuns
		} = this.state;
		if(error == true){
			return (
				<Err onPress={this.loadDiscounts} />
			)
		}else if(busy == true){
			return (
				<View style={{width:'100%',height:'100%',flexDirection:'row'}}>
					<SkeletonContent
						containerStyle={{width:'100%'}}
						isLoading={true}
						boneColor={helper.faintColor}
						highlightColor={helper.secondaryColor}
						layout={[
							{width:'95%',height:170,marginLeft:10,borderRadius:10,marginTop:10},
							{width:'70%',height:15,marginLeft:10,borderRadius:10,marginTop:5},

							{width:'95%',height:170,marginLeft:10,borderRadius:10,marginTop:10},
							{width:'70%',height:15,marginLeft:10,borderRadius:10,marginTop:5},

							{width:'95%',height:170,marginLeft:10,borderRadius:10,marginTop:10},
							{width:'70%',height:15,marginLeft:10,borderRadius:10,marginTop:5},							
						]}
					/>
				</View>
			)
		}else if(coupuns.length == 0){
			return (
				<Empty />
			)
		}else{
			return <View />
		}	
	}

	renderCoupun = ({item, index}) => {
		return <DiscountCard onPress={() => this.applyCurrent(item)} data={item} current={this.state.discount} />
	}
}


class DiscountCard extends Component {
	constructor(props){
		super(props)
		this.state = {

		}
	}
	render () {
		const {
			data,
			current,
			onPress
		} = this.props
		const text = data.type == helper.DISCOUNT_TYPE_AMOUNT ? lang.rp + data.amount : data.percent + '%';
		return (
			<View style={[s.card, {opacity:data.valid ? 1 : 0.7,borderWidth:data.valid ? 2 : 1,borderColor:helper.primaryColor}]}>
			 <View style={s.display}>
			  <Text style={s.offDisplay}>{text}{'\n'}<Text style={{fontSize:20}}>OFF</Text></Text>
			 </View>
			 {data.valid ? <Image source={require('assets/images/cutter.png')} resizeMode='contain' style={{width:16,height:150}} /> : <View style={{width:16}} />}
			 <View style={s.content}>			    
				<Text numberOfLines={2} style={s.cardTitle}>{data.title}</Text>
				<Text numberOfLines={2} style={s.desc}>{data.desc}</Text>
				<Text style={s.desc}>Minimum Order: {data.min_order}</Text>
				<Text style={s.desc}>Max Discount: {data.max_discount}</Text>
				{current.id == data.id ? null : <TouchableOpacity disabled={data.valid ? false : true} activeOpacity={0.9} onPress={onPress} style={s.codeCover}>
			     <Text style={s.codeTxt}>APPLY NOW</Text>			     
			    </TouchableOpacity>}
			 </View>
			</View>
		)
	}
}

const s = {
	codeCover:{		
		height:40,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:helper.primaryColor,
		marginTop:10,
		borderRadius:10,
		width:200
	},
	codeTxt:{
		color:helper.white,
		fontSize:15,
		fontWeight:'bold',
		width:'100%',
		textAlign:'center'
	},
	offDisplay:{
		width:'100%',
		textAlign:'center',
		fontSize:30,
		color:helper.primaryColor,
		fontWeight:'bold'
	},
	display:{
		width:80,
		height:150,
		justifyContent:'center',
		alignItems:'center'
	},
	cardTitle:{
		marginTop:5,
		fontSize:17,
		width:'100%',
		fontFamily:'sans-serif-medium',
		color:helper.blk
	},
	content:{
		paddingTop:10,
		paddingLeft:10
	},
	desc:{
		fontSize:13,
		color:helper.grey,
		width:170
	},
	card:{
		width:'95%',
		alignSelf:'center',
		padding:10,
		borderRadius:10,
		elevation:5,
		backgroundColor:helper.white,
		marginTop:20,
		flexDirection:'row'
	},

	main : {
		backgroundColor:helper.homeBgColor,
		height:'100%',
		width:'100%'
	},
	title:{
		fontSize:20,
		color:helper.white
	},
	arrow:{
		height:50,
		width:50,
		justifyContent:'center',
		alignItems:'center'
	},
	header: {
		backgroundColor:helper.primaryColor,
		width:'100%',
		height:60,
		alignItems:'center',
		flexDirection:'row',
		elevation:24
	}
}