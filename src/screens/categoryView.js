import React, { Component } from 'react';
import {
	View,
	Text,	
	FlatList,
	Animated,
	TouchableOpacity,
	RefreshControl,
	ToastAndroid,
	ScrollView,
	Image
} from 'react-native';
import request from 'libs/request';
import helper from 'assets/helper';
import {	
	Icon,
	Dazar
} from 'components';
import Err from 'components/err';
import lang from 'assets/lang';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Address from 'libs/address';
import Parse from 'parse/react-native';
import QtyBtn from 'components/qtyBtn';
import CartBar from 'components/cartBar';
import ProductList from './productList';
const listWidth = helper.width - 70;
const itemWidth = (listWidth / 2) - 10
const itemHeight = itemWidth + 20
export default class CategoryView extends Component {
	constructor(props){
		super(props)
		this.state = {
			parentCat:{},
			error:false,
			loading:true,
			categories:[],
			selected:'',
			sub_cat:{id:undefined}
		}
		this.categoryIcon = [] 
	}
	componentDidMount(){
		const {parentCat,subCatId,catCover} = this.props.route.params;
		this.setState({
			parentCat,
			sub_cat:{id:subCatId},
			catCover:catCover == undefined || catCover == '' ? false : catCover,
		}, this.loadCategory)
	}
	loadCategory = async () => {
		this.setState({loading:true,error:false})
		try {
			const query = new Parse.Query(helper.tbls.SC);
			query.equalTo("parent_cat", this.state.parentCat.id);
			query.equalTo("status", 1);
			const catList = await query.find();
			const categories = []
			for(let cat of catList){
				let {id, attributes} = cat;
				categories.push({
					...attributes,
					...{id},
				});
			}
			this.setState({
				loading:false,
				error:false,
				categories,
				selected:categories[0].id
			}, () => {
				this.handleSelectCat(this.state.sub_cat);
			})
		}catch(err){
			this.setState({loading:false,error:true})
		}
	}
	handleSelectCat = (item = undefined) => {
		let id = item == undefined || item.id == undefined ? this.state.selected : item.id
		const categories = this.state.categories;
		let catCover = false;
		if(categories.length > 0 && categories[0].id == id){
			catCover = this.state.catCover;
		}
		this.productList.loadProducts(id, (status) => {
			if(status == 0){
				ToastAndroid.show('Please Wait..', ToastAndroid.SHORT);
				return;
			}
			let pre = this.state.selected;
			this.setState({selected:id}, () => {
				if(this.categoryIcon[pre] != undefined){
					this.categoryIcon[pre].blur()
				}
				this.categoryIcon[id]?.focus()
			})
		}, catCover);
	}
	navSearch = () => {
		this.props.navigation.navigate('Search');
	}
	back = () => {
		this.props.navigation.goBack();
	}
	navigateItemView = (item) => {
		this.props.navigation.navigate("ProductView", {
			name:item.name,
			product_id:item.product_id
		});
	}
	render () {
		const {
			selected,
			categories,
			parentCat,
			loading,
			error
		} = this.state;
		return (
			<View style={s.main}>
			<View style={s.header.main}>
			    <TouchableOpacity onPress={this.back} style={s.header.icon}>
				 <Icon name={lang.cvlft} size={20} color={helper.blk} />
				</TouchableOpacity>
				<Text numberOfLines={1} style={s.header.text}>{parentCat.name}</Text>
				<TouchableOpacity style={s.header.srhC} onPress={this.navSearch}>
				 <Icon name={lang.srch} size={20} color={helper.blk} />
				</TouchableOpacity>
			</View>
			{loading == false && error == false ? <View style={{width:'100%',height:'100%',flexDirection:'row'}}>
				<FlatList
				 data={categories}
				 renderItem={this.renderItem}
				 contentContainerStyle={{paddingBottom:60}}
				 style={{width:70,backgroundColor:helper.white,elevation:18}}
				/>
				<View style={{width:listWidth,height:helper.height - 55}}>
					<ProductList
					 ref={ref => this.productList = ref}
					 itemPress={this.navigateItemView}
					 toCart={() => this.props.navigation.navigate('Cart')}
					/>
				</View>
			</View> : this.renderSkeleton()}
			</View>
		)
	}
	renderSkeleton = () => {
		const error = this.state.error;
		if(error){
			return <Err onPress={this.loadCategory} />
		}
		return (
			<View style={{width:'100%',height:'100%',flexDirection:'row'}}>
				<View style={{width:70,height:'100%',backgroundColor:helper.white,elevation:18}}>
				    <SkeletonContent
						containerStyle={{width:'100%'}}
						isLoading={true}
						boneColor={helper.faintColor}
						highlightColor={helper.secondaryColor}
						layout={[
							{width:60,height:65,alignSelf:'center',borderRadius:60,marginTop:10},
							{width:50,height:15,alignSelf:'center',borderRadius:0,marginTop:5},
							{width:60,height:65,alignSelf:'center',borderRadius:60,marginTop:10},
							{width:50,height:15,alignSelf:'center',borderRadius:0,marginTop:5},
							{width:60,height:65,alignSelf:'center',borderRadius:60,marginTop:10},
							{width:50,height:15,alignSelf:'center',borderRadius:0,marginTop:5},
							{width:60,height:65,alignSelf:'center',borderRadius:60,marginTop:10},
							{width:50,height:15,alignSelf:'center',borderRadius:0,marginTop:5}
						]}
					/>
				</View>
				<View style={{width:listWidth,height:'100%'}}>					
				    <SkeletonContent
						containerStyle={{width:'100%',flexDirection:'row',flexWrap:'wrap'}}
						isLoading={true}
						boneColor={helper.faintColor}
						highlightColor={helper.secondaryColor}
						layout={[
							{width:itemWidth,height:itemHeight,borderRadius:10,marginTop:10,marginLeft:10},
							{width:itemWidth,height:itemHeight,borderRadius:10,marginTop:10,marginLeft:10},
							{width:itemWidth,height:itemHeight,borderRadius:10,marginTop:10,marginLeft:10},
							{width:itemWidth,height:itemHeight,borderRadius:10,marginTop:10,marginLeft:10},
							{width:itemWidth,height:itemHeight,borderRadius:10,marginTop:10,marginLeft:10},
							{width:itemWidth,height:itemHeight,borderRadius:10,marginTop:10,marginLeft:10},
						]}
					/>
				</View>
			</View>
		)
	}
	renderItem = ({item, index}) => {
		return (
			<CategoryIcon 
			 ref={ref => this.categoryIcon[item.id] = ref} 
			 item={item}
			 index={index}
			 onPress={() => this.handleSelectCat(item)}
			/>
		)
	}
	renderFooter = () => {
		const height = this.animatedHeight.interpolate({
			inputRange:[200, 370],
			outputRange:[0, 50],
			extrapolate:'clamp'
		})
		return (
			<Animated.View style={{height,width:'100%',backgroundColor:helper.white}}>
			</Animated.View>
		)
	}
}

class CategoryIcon extends Component {
	constructor(props){
		super(props)
		this.state = {
			selected:false,
			translateY:new Animated.Value(30)
		}
	}
	focus = () => {
		this.setState({
			selected:true,
		});
		Animated.spring(this.state.translateY, {
			toValue:10,
			useNativeDriver:true
		}).start();
	}
	blur = () => {
		this.setState({
			selected:false,
		});
		Animated.spring(this.state.translateY, {
			toValue:30,
			useNativeDriver:true
		}).start();
	}
	render (){
		const {
			item,
			index
		} = this.props;
		const {
			selected,
			translateY
		} = this.state;
		const image = helper.validUrl(item.image);
		const backgroundColor = selected ? helper.secondaryColor : helper.faintColor;
		return (
			<TouchableOpacity activeOpacity={1} onPress={this.props.onPress} style={{width:70,height:100,marginTop:10}}>
				<View style={{alignSelf:'center',width:55,height:55,justifyContent:'center',elevation:12, borderRadius:100,backgroundColor,alignItems:'center',overflow:'hidden'}}>
					<Animated.Image resizeMode="contain" source={{uri:image}} style={{width:65,height:65,transform:[
						 {translateY}
				    ]}} />
				</View>
				<Text numberOfLines={2} style={{fontSize:10,marginTop:5,flex:1,textAlign:'center',color:helper.black}}>{item.name}</Text>
			</TouchableOpacity>
		)
	}
}
const s = {
	header:{
		srhC:{
			height:50,
			width:40,
			justifyContent:'center',
			alignItems:'center',
			position:'absolute',
			right:0
		},
		main:{
			height:50,
			width:'100%',
			elevation:18,
			borderBottomWidth:1,
			borderColor:helper.borderColor,
			backgroundColor:helper.bgColor,
			flexDirection:'row'
		},
		icon:{
			height:50,
			width:40,
			justifyContent:'center',
			alignItems:'center'
		},
		text:{
			fontSize:18,
			color:helper.blk,
			flex:1,
			lineHeight:50
		}
	},
	main:{
		height:'100%',
		width:'100%',
		backgroundColor:helper.homeBgColor
	}
}