import React, { Component } from 'react';
import {
	View,
	Text,	
	FlatList,
	Animated,	
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	ImageBackground,
	RefreshControl,
	ActivityIndicator,
	PermissionsAndroid,
	ToastAndroid,
	TextInput
} from 'react-native';
import {
	Image,
	Icon
	//Button,
} from 'components';
import Dazar from 'components/dazar';
import request from 'libs/request';
import helper from 'assets/helper';
import Parse from 'parse/react-native';
import lang from 'assets/lang';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Address from 'libs/address';
import Cart from 'libs/cart';
import Product from 'components/product';
import {View as AniView} from 'react-native-animatable';
export default class ProductList extends Component {
	constructor(props){
		super(props)
		this.state = {
			searchKey:'',
			products:[],
			error:false,
			loading:false,
			smallSize:false,
			maxWidth:helper.width,
			categoryHead:false,
			catCover:false
		}
		this.callback = null;
	}
	componentDidMount(){
		if(this.props.route == undefined){
			this.setState({
				searchKey:'',
				searchBar:false,
				smallSize:true,
				maxWidth:helper.width - 70
			})
		}else{
			const {searchKey} = this.props.route.params;
			if(searchKey != undefined){
				this.setState({searchKey}, this.loadProducts)
			}
		}		
		Cart.addCartListener(cart => {
			this.setState({cart})
		})
	}
	componentWillUnmount(){
		Cart.removeCartListener();
	}
	toCart  = () => {
		if(this.state.smallSize == false){
			this.props.navigation.navigate('Cart');
		}else{
			this.props.toCart();
		}
	}
	loadProducts = (subCategoryId = undefined, callback = null, catCover = false) => {
		if(callback != null){
			this.callback = callback;
		}
		if(this.state.loading){
			this.nullCall(0)
		}
		const address = Address.getCurrentAddress();
		const {products, searchKey} = this.state;
		const skip = products.length;
		this.setState({loading:true,error:false,products:[],catCover});
		Parse.Cloud.run('searchProducts', {subCategoryId,searchKey,skip,address,user_id}).then(({data, status}) => {
			if(status == 200){
				this.setState({loading:false,error:false});
				let products = this.state.products;
				products = [...products, ...data.products];
				this.setState({products,cart:data.cart}, () => {
					this.nullCall(true)
				});
			}else{
				this.setState({error:true,loading:false}, () => {
					this.nullCall(false)
				})
			}
		}).catch(err => {
			this.setState({loading:false,error:true}, () => {
				this.nullCall(false)
			});
		})
	}
	onProductPress = (item) => {
		// if(this.props.navigation == undefined){
		// 	if(this.props.itemPress != undefined)this.props.itemPress({
		// 		name:item.name,
		// 		product_id:item.id
		// 	});
		// }else{
		// 	this.props.navigation.navigate("ProductView", {
		// 		name:item.name,
		// 		product_id:item.id
		// 	})
		// }
	}
	searchNav = () => {
		this.props.navigation.goBack();
	}
	nullCall = (data) => {
		if(this.callback != null){
			this.callback(data)
			setTimeout(() => {
				this.callback = null
			}, 100)
		}
	}
	render(){
		const {
			products
		} = this.state;
		return (
			<View style={s.main}>
			 {this.renderSearchBar()}			
			 <FlatList
			  numColumns={1}
			  data={products}
			  renderItem={this.renderProduct}
			  ListHeaderComponent={this.renderHeader}
			  ListFooterComponent={this.renderBottom}
			 />			 
			 {this.renderFooter()}
			</View>
		)
	}
	renderHeader = () => {
		const {categoryHead,loading,error,catCover} = this.state;
		const uri = catCover == false ? false : helper.validUrl(catCover);
		if(categoryHead == false){
			return (
				<>					
					{uri ?
						<Image
						 source={{uri}}
						 resizeMode="cover"
						 sty={{width:'100%',height:200,marginBottom:10,elevation:24,backgroundColor:helper.white}}
						 imgSty={{width:'100%',height:200}}
						/>
					: null}
					<View style={{height:6}} />
					{this.renderDazar(loading,error)}
				</>
			)
		}else{
			return this.renderDazar(loading, error)
		}

	}
	renderDazar = (loading, error) => {
		return (
			<Dazar
		      loading={loading}
		      error={error}
		      length={this.state.products.length}
		      onRetry={this.loadProducts}
		      lcont_size={80}			      
			  lanim_size={150}
		    />
		)
	}
	renderBottom = () => {
		return (
			<View style={{height:50,width:'100%',marginTop:10}} />
		)
	}
	renderProduct = ({item, index}) => {
		return (
			<Product
			 smallSize={this.state.smallSize}
			 data={item}
			 onPress={() => this.onProductPress(item)}
			/>
		)
	}
	renderSearchBar = () => {
		const {
			searchKey,
			searchBar
		} = this.state;
		if(searchBar == false)return <View />
		return (
			<TouchableOpacity onPress={this.searchNav} activeOpacity={0.7} style={s.searchBody}><View style={s.searchBar}>
			 <View style={{width:40,height:45,justifyContent:'center',alignItems:'center'}}>
			  <Icon name={lang.srch} color={helper.grey} size={24} />
			 </View>
			 <View style={{justifyContent:'center',flex:1}}>
			  <Text numberOfLines={1} style={{color:helper.primaryColor,fontSize:18}}>{searchKey}</Text>
			 </View>
			 <TouchableOpacity activeOpacity={0.7} onPress={this.startSpeech} style={{width:40,height:45,justifyContent:'center',alignItems:'center'}}>
			  <Icon name={lang.mc} color={helper.grey} size={24} />
			 </TouchableOpacity>
			</View>
			</TouchableOpacity>
		)
	}
	renderFooter = () => {
		const {cart, maxWidth, smallSize} = this.state;
		let showCart = cart != undefined && (cart.totalQty > 0 && cart.totalAmt != undefined) ? true : false;
		return (
			<>
			{showCart ? <TouchableOpacity activeOpacity={0.8} onPress={this.toCart}><AniView animation="slideInUp" duration={600} style={[s.ftr, s.ftr2]}>
			   <View style={{flexDirection:'row',alignItems:'center'}}>
			       <View style={{width:30,height:40,marginRight:10,justifyContent:'center',alignItems:'center'}}>
					   <Icon name="cart" color={helper.bgColor} size={23} />
				   </View>
				   <Text style={{fontSize:15,color:helper.bgColor,width:200}}>{cart.totalQty} Items•<Text style={{fontWeight:'bold'}}>{lang.rp}{cart.totalAmt} {smallSize ?  ' |  View Cart' : ''}</Text></Text>
			   </View>
			   {smallSize ? null : <Text style={{fontSize:15,color:helper.bgColor,width:70}}>View Cart</Text>}
			 </AniView></TouchableOpacity> : null}
			</>
		)
	}
}

const s = {
	searchBody:{width:'100%',height:80,justifyContent:'center',backgroundColor:helper.primaryColor},
	searchBar:{borderRadius:10,width:'95%',height:45,alignSelf:'center',backgroundColor:helper.white,elevation:24,flexDirection:'row'},
	main:{
		backgroundColor:helper.homeBgColor,
		flex:1
	},
	ftr2:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		paddingRight:5
	},
	ftr:{
		width:'100%',
		height:40,
		justifyContent:'center',
		paddingLeft:5,		
		backgroundColor:helper.primaryColor
	},
	ftrTxt:{
		fontSize:14,
		color:helper.bgColor
	}
}