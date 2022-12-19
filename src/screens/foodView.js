import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	TextInput,
	ScrollView
} from 'react-native';
import {
	Icon,
	Image,
	HeuButton,
	CartView,	
	FoodRating,	
	CounterInputHor,
	FoodCardSmall,
	Loading,
	Empty,
	Err
} from 'components';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
import MyCart from 'libs/mycart';
import LinearGradient from 'react-native-linear-gradient';
const chipSize = helper.width * 20 / 100;
export default class FoodView extends Component {
	constructor(props){
		super(props);
		this.state = {
			id:-1,
	     	name:'',
	     	about:'',
	     	hash:'',
	     	image:'',
	     	approved:false,
			rating:'',
			price:200,
			old_price:210,
			vendor_id:-1,
			vendor_name:'',
			vendor_image:'',
			vendor_hash:'', 
			vendor_rating:'',			
			alsoAdd:[],
			loading: true,
			error:false
		}
		this.foodItem = [];
	}
	componentDidMount () {		
		if(this.props.route.params?.item == undefined){
			this.props.navigation.goBack();
			return;
		}else{
			setTimeout(() => {
				let c = MyCart.getItemCount(this.props.route.params?.item.id);		
				if(c)this.currentItem.directI(c);
			}, 500)
		}
		let {
			id,name,about,hash,image,approved,rating,price,old_price
		} = this.props.route.params?.item;
		rating = rating == null ? undefined : rating
		this.setState({id,name,about,hash,image,approved,rating,price,old_price}, () => {
			this.loadFoodMeta()
		});
		this.focus = this.props.navigation.addListener('focus', () => {
	      MyCart.init(null, this.hotelChange, this.recount);      
	    });
	    this.blur = this.props.navigation.addListener('blur', () => {
	      MyCart.release();
	    });
	}
	hotelChange = (amount) => {
		this.cartView.direct(1, amount);
	}
	recount = ({id,price}) => {		
		if(this.state.id == id){
			this.currentItem.directI(0);
		}else{
			this.foodItem[id]?.setCartCount(0);
		}
		this.cartView.decrease(1, price);		
	}
	onFCMount(id){		
		let c = MyCart.getItemCount(id);		
		if(c)this.foodItem[id]?.setCartCount(c);
	}
	loadFoodMeta = async () => {		
		this.setState({loading: true,error:false});
		var res = await request.perform('vendor2', {
			req:'fd_meta',			
			user_id,
			fdtype:JSON.stringify([helper.FD_BOTH, helper.FD_ONLYDLV]),
			se,
			id:this.state.id,
			user_lat,
			user_long		
		});
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200)
			this.setState({
				alsoAdd:res.data.alsoAdd,
				vendor_id:res.data.vendor_id,
				vendor_name:res.data.vendor_name,
				vendor_image:res.data.vendor_image,
				vendor_hash:res.data.vendor_hash,
				vendor_rating:res.data.vendor_rating,
			});
		else this.setState({error:true});
	}
	handleAddCurrent = (flag) => {
		let item = this.props.route.params.item;
		if(flag == -1){
			this.cartView.removeFromCart(item);
		}else{
			this.cartView.addToCart(item);
		}		
	}
	handleAdd = (item) => {
    	this.cartView.addToCart(item);
    }
    handleRemove = (item) => {
    	this.cartView.removeFromCart(item);
    }
    toReviews = () => {
    	this.props.navigation.navigate('Reviews', {
    		issuer:helper.FOOD,
    		issuer_id:this.state.id
    	})
    }
    toPhotos = () => {
    	this.props.navigation.navigate('Photos', {
    		id:this.state.vendor_id
    	})
    }
    toMenu = () => {
    	this.props.navigation.navigate('VendorView', {
    		item:{id:this.state.vendor_id,name:this.state.vendor_name}
    	})
    }
    navBack = () => {
    	this.props.navigation.goBack();
    }
	render() {
		const {
			name,about,price,old_price,image,
			hash,vendor_name,vendor_image,vendor_hash,
			vendor_rating,approved,rating,alsoAdd
		} = this.state;
		return (
			<View style={helper.hldr}>
			 <HeuButton style={s.hdr} onPress={this.navBack}>
			  <Icon name={lang.arwbck} color={helper.silver} size={30} />
			 </HeuButton>
			 <ScrollView stickyHeaderIndices={[1]}>			 
			 <View style={{backgroundColor:'#000',paddingBottom:15}}>
				 <View style={s.cntr}>
				   <Image
				    sty={s.img}
				    imgSty={helper.max}
				    borderRadius={10}
				    hash={hash}
				    source={{uri:helper.site_url + image}}
				   />			   
				   <View style={{width:'67%'}}>
				    <Text style={s.tt} numberOfLines={1}>{name}</Text>
				    <Text style={s.dd} numberOfLines={1}>{about}</Text>
				    <View style={s.rrw}>
				     <Image
				        sty={{height:30,width:30,backgroundColor:helper.grey}}
					    imgSty={helper.max}
					    borderRadius={60}
					    hash={vendor_hash}
					    source={{uri:helper.site_url + vendor_image}}
				     />
				     <Text style={[s.dd, {marginLeft:5}]} numberOfLines={3}>From {vendor_name}</Text>
				    </View>
				    <View style={s.rrw}>
					    <Text style={s.pr} numberOfLines={3}>₹{price} {old_price != 0 ? <Text style={s.old}>₹{old_price}</Text> : null}</Text>
					    <CounterInputHor
					      onChange={this.handleAddCurrent}
					      style={{marginTop:5,marginLeft:5}}
						  onMax={this.maxLimit}
						  ref={ref => this.currentItem = ref}
					    />
				    </View>

				   </View>
				  </View>
				  <FoodRating 
				   verified={approved} 
				   rating={rating}			   
				  />
				  <Text style={[s.dd2, {marginLeft:15}]}>These Product Is From {vendor_name}</Text>
				  <Text style={[s.dd2, {marginLeft:15}]}>Hotel Rating {vendor_rating}</Text>
			  </View>			  
			  <View style={{backgroundColor:helper.grey2}}>
				  <View style={[s.rrw, {justifyContent:'space-around'}]}>			   			   
				    <Text style={s.xx}>Also Add</Text>			   
				    <Text style={s.x} onPress={this.toReviews}>Reviews</Text>			   			   
				    <Text style={s.x} onPress={this.toMenu}>Menu</Text>			   			   
				    <Text style={s.x} onPress={this.toPhotos}>Photos</Text>			   
				  </View>
			  </View>
			  {this.renderDizzer()}
			  {alsoAdd.map((data) => {
			  	return (
			  		<FoodCardSmall
			  		   data={data}
			  		   onAdd={() => this.handleAdd(data)}
				       onMount={() => this.onFCMount(data.id)}
				       onRemove={() => this.handleRemove(data)}		  		 
				       ref={ref => (this.foodItem[data.id]) = ref}
			  		/> 
			  	)
			  })}
			</ScrollView>

			
			<CartView {...this.props} ref={ref => (this.cartView = ref)} />

			</View>
		)
	}
	renderDizzer = () => {
		const {loading, error} = this.state;
		if(!loading && error){
			return (
				<Err />
			);
		}else if(loading && !error){
			return (
			  <Loading />
			)
		}else if(!loading && !error && this.state.alsoAdd.length === 0){
			return (
				<Empty />
			);
		}else{
			return (<View></View>)
		}
	}	
}

const s = StyleSheet.create({
	hdr:{height:50,backgroundColor:'#000',justifyContent:'center',paddingLeft:8},
	tt:{fontSize:16,fontWeight:'bold',color:helper.silver,width:'95%'},
	dd:{fontSize:13,color:helper.grey,width:'95%'},
	dd2:{fontSize:12,color:helper.silver,width:'95%'},
	pr:{fontSize:19,color:helper.silver},
	old:{textDecorationLine: 'line-through',fontSize:15,color:helper.grey},
	cntr:{flexDirection: 'row',paddingBottom:15,alignItems:'center'},
	img:{width:100,height:100,marginHorizontal:13},
	rrw:{flexDirection: 'row',alignItems:'center',marginTop:5},	
	x:{width:'22%',paddingBottom:7,fontSize:14,color:helper.silver,fontWeight:'bold',textAlign:'center'},
	xx:{width:'22%',borderBottomWidth:2,borderColor:helper.silver,paddingBottom:7,fontSize:14,color:helper.silver,fontWeight:'bold',textAlign:'center'},
	fImage:{backgroundColor:helper.grey,flex:1},
	desc:{fontSize:12,width:'90%',color:'#fff',marginBottom:8,marginTop:3,marginHorizontal:5},
	foodChip:{width:chipSize,margin:5,height:chipSize,borderRadius:8,backgroundColor:helper.grey},	
	fHolder:{width:'100%',height:'100%',position:'absolute',top:0,left:0,borderRadius:7,justifyContent:'flex-end'},
	ptt:{fontSize:18,fontWeight:'bold',margin:5,color:'white',width:'50%'}
})