import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	TextInput,
	ScrollView,
	SectionList,
	PixelRatio,
	ToastAndroid
} from 'react-native';
import {
	Icon,
	Image,
	HeuButton,	
	FoodRating,
	FoodSearch,	
	CounterInputHor,
	FoodCardSmall,
	CatProvider,
	Dazar,
	CartView,
	CheckBox
} from 'components';
import {
	TouchableNativeFeedback
} from 'react-native-gesture-handler';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
import MyCart from 'libs/mycart';
import LinearGradient from 'react-native-linear-gradient';
import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import AddonManager from 'components/addonManager';
import Discounter from 'components/discounter';
import Shimmer from 'react-native-shimmer';
const chipSize = helper.width * 20 / 100;
export default class VendorView extends Component {
	constructor(props){
		super(props);
		this.state = {	
		    currentSection:0,		
			categories:[],
			loading: true,
			error:false,
			catLoad:false,
			cartTemp:[],
			isFirst:true,
			onlyveg:false,
			rating:''
		}
		this.foodItem = [];
		this.cart = null;		
	}

	componentDidMount () {
		this.onScreen();
		this.focus = this.props.navigation.addListener('focus', () => {
	      MyCart.init(null, this.hotelChange, this.recount);
	      if(this.state.isFirst){
	      	this.setState({isFirst:false});
	      }else{
	      	this.setState({loading:true,error:false,catData:[],categories:[],currentSection:0}, () => {
	      		this.cartView.init();
	      		setTimeout(() => {
	      			this.onScreen();
	      		}, 200)
	      	})
	      }
	    });
	    this.blur = this.props.navigation.addListener('blur', () => {
	      MyCart.release();
	    });
	}

	dispatch = (fs) => {
		this.discounter.init(fs)
	}

	onScreen = () => {
		this.cart = new Datastore({
			storage:AsyncStorage,
			filename: 'cart',
			autoload: true
		});
		if(this.props.route.params?.item == undefined){
			this.props.navigation.goBack();
			return;
		}
		let {
			id,name,logo,cover,about,
			logo_hash,cover_hash,old_price,approved,rating,
			distance,open_time,close_time,closed,dr,delivery,
			safety,full_day,allweek,table_booking,has_mess,onlyveg,
			food_id
		} = this.props.route.params?.item;		
		rating = rating == null ? undefined : rating
		let features = [];
		if(safety)features.push("Safety Assured");
		if(full_day)features.push("24/7 Service");
		if(allweek)features.push("Works All Week");
		if(table_booking == 1)features.push("Table Booking");
		if(has_mess)features.push("Mess Service");
		if(features.length == 0)features = false;
		this.setState({
			id,name,logo,cover,about,logo_hash,
			cover_hash,old_price,approved,rating,distance,
			open_time,close_time,closed,dr,features,onlyveg,food_id,delivery
		}, this.loadVendorMeta)
	}

	componentWillUnmount(){
		this.focus();
		this.blur();
	}

	hotelChange = (amount, count = 1) => {
		this.cartView.direct(count, amount);
	}

	recount = ({id,price}) => {		
		this.foodItem[id]?.setCartCount(0);		
		this.cartView.decrease(1, price);		
	}

	addonDone = ({id,count}) => {	    
		this.foodItem[id]?.setCartCount(count);		
		this.cartView.init();
		if(this.foodSearch?.isOpen() == true){
			this.foodSearch?.setDirectCount(id, count);
		}
	}

	loadVendorMeta = async () => {	    
		this.setState({loading: true,error:false})
		let data = {
			req:'vr_meta',
			fdtype:JSON.stringify([helper.FD_BOTH, helper.FD_ONLYDLV]),
			vendor_data:1,
			user_lat:0,
			user_long:0,
			isuser:true,
			user_id,
			id:this.state.id			
		};
		if(this.state.food_id != undefined){
			data['food_id'] = this.state.food_id;
		}		
		var res = await request.perform('vendor2', data);
		if(typeof res === 'object' && res?.status == 200){
			let {
				id,name,logo,cover,about,
				logo_hash,cover_hash,old_price,approved,rating,
				distance,open_time,close_time,isOpen,dr,closed,delivery
				//safety,full_day,allweek,table_booking,has_mess,
			} = res.data.vendor;
			rating = rating == null ? undefined : rating		
			this.setState({
				id,name,logo,cover,about,logo_hash,
				cover_hash,old_price,approved,rating,distance,
				open_time,close_time,closed,dr,delivery,
				photo_count:res.data.photo_count,
				review_count:res.data.review_count,
				tempCat:res.data.categories,
				currentSection:0
			}, () => {
				this.catProvider?.setIndex(0)
				this.startDispatch(res.data.categories);
			});			
		} else {
			this.setState({error:true});
		}
	}
	
	startDispatch = (categories, shouldFC = false) => {
		let cartTemp = [];	    
    	this.cart.find({vendor_id: this.state.id}).exec((err, itms) => {
			itms.forEach((itm) => cartTemp[itm.id] = itm.cartCount);
			this.setState({cartTemp,categories,loading:false}, () => {
				if(categories.length > 0){
					this.handleCatPress(0)
				}
			});
		});	    
	}

	onFCMount(id, ret){
		if(ret)return
		if(this.state.cartTemp[id] != undefined){			
			this.foodItem[id]?.setCartCount(this.state.cartTemp[id]);
		}
	}

    handleFull = () => {    	
    	this.props.navigation.navigate('MainResView', {
    		id:this.state.id,
    		name:this.state.name
    	});
    }

    handleCatPress = (index) => {
    	this.setState({catLoad:true});
    	let catData = this.state.categories[index].data;
    	this.cart = new Datastore({storage:AsyncStorage,filename: 'cart',autoload: true});
		let cartTemp = [];
    	this.cart.find({vendor_id: this.state.id}).exec((err, itms) => {											
			itms.forEach((itm) => {cartTemp[itm.id] = itm.cartCount});			
	    	this.setState({cartTemp,catData,catLoad:false}, () => {
	    		setTimeout(() => {
		    		this.discounter.onCatChange(itms);
		    	}, 100);
	    	});	
		});		
    }

    handleAdd = (item) => {
    	this.cartView.addToCart(item);
    	setTimeout(() => {
    		this.discounter.onAdd(item);
    	}, 100);
    }

    handleRemove = (item) => {
    	this.cartView.removeFromCart(item);
    	setTimeout(() => {
    		this.discounter.onRemove(item);
    	}, 100);
    }

    resetCart = () => {    	
		this.cart = new Datastore({storage:AsyncStorage,filename: 'cart',autoload: true});
		let cartTemp = [];
    	this.cart.find({vendor_id: this.state.id}).exec((err, itms) => {
			itms.forEach((itm) => {				
				this.foodItem[itm.id]?.setCartCount(itm.cartCount);
				cartTemp[itm.id] = itm.cartCount
			});			
			this.setState({cartTemp,loading:false});
			this.cartView.init();
		});
    }

    startSearch = () => {
    	const cats = this.state.categories;
    	if(cats.length === 0)return;
    	const foodList = [];
    	cats.forEach(cat => {
    		cat.data.forEach(item => foodList.push(item))
    	})
    	this.foodSearch.show(foodList);
    }

    renderHeader = () => {
    	if(this.state.catLoad){
    		return (
    			<View style={s.vhw}>
	    		 <Text style={{fontSize:14,color:helper.white}}>Loading...</Text>
	    		</View>
    		)
    	}else{
    		return (
    			<View />
    		)
    	}
    }

    navBack = () => {
    	this.props.navigation.goBack();
    }

    addonManager = (item, callback, action) => {    	
		this.adnMng.show(item, (act) => {
			callback(act)
		})
    }

    manageVeg = (veg) => {
    	const {loading, error, tempCat} = this.state;
        if(loading || error) 	{
        	ToastAndroid.show('Please Wait', ToastAndroid.SHORT);
        	return
        }
    	if(veg){
    		this.setState({categories:[],catData:[],currentSection:0,loading:true}, () => {
    			this.catProvider?.setIndex(0)
    		})	    	
	    	let categories = [];
	    	tempCat.forEach(cat => {	    		
	    		let temp = cat;
	    		let data = []	    		
	    		cat.data.forEach(food => {	    			
	    			if(food.veg == 0){
	    				data.push(food)
	    			}
	    		})
	    		temp.data = data;
	    		if(data.length > 0){
	    			categories.push(temp);
	    		}	    		
	    	});
	    	setTimeout(() => {
	    		this.setState({loading:false}, () => {
	    			this.startDispatch(categories);
	    		})
	    	}, 300)
    	}else{
    		this.setState({loading:true,categories:[],catData:[],currentSection:0}, () => {
    			this.catProvider?.setIndex(0)
    		})    		
    		setTimeout(() => {
    			this.startDispatch(this.state.tempCat)	    		
	    	}, 200)
    	}
    }

    hotelInfo = () => {
    	const {id,name} = this.state;    	
    	this.props.navigation.navigate('MainResView', {id,name})
    }

	render() {
		const {
			name,			
			logo,
			cover,
			about,
			logo_hash,			
			cover_hash,
			old_price,
			approved,
			rating,
			distance,			
			open_time,
			close_time,			
			dr,
			categories,
			currentSection,
			loading,
			error,
			catData,
			onlyveg,
			closed,
			delivery
		} = this.state;	
		const color = !loading && !error && categories.length > 0 ? helper.grey6 : "transparent";		
		const hideCounter = closed || delivery == 0;
		return (
			<View style={helper.hldr}>			  
			  <View style={{flex:1}}>
			    <View style={{backgroundColor:'#000'}}>
				 <View style={s.cntr}>
				   <View style={{flexDirection:'row',alignItems:'center'}}>
					   <HeuButton style={s.hdr} onPress={this.navBack}>
						  <Icon name={lang.arwbck} color={helper.silver} size={26} />
					   </HeuButton>
					   <Text style={s.tt} numberOfLines={1}>{name}</Text>
				   </View>

				   <View style={s.src}>
				    <HeuButton style={s.scn} onPress={this.startSearch}>
				     <Icon color={helper.white} size={24} name={lang.srch}/>
				    </HeuButton>
				   </View>
				  </View>

				  <View style={s.cbn}>
				    <TouchableOpacity onPress={this.hotelInfo}><View style={s.bm}>
				     <Icon name={lang.abt} color={helper.primaryColor} size={24} style={{marginTop:5}} />
				     <Text style={s.cpm}>Hotel Info</Text>
				    </View></TouchableOpacity>			    
				    <View style={s.mxq}>
				     <Text style={s.bpq}>{rating}</Text>
				     <Text style={s.cpm}>Rating</Text>
				    </View>
				    {hideCounter ?
				    	<View style={s.bm}>
					     <Icon name={'door'} color={helper.red} size={24} style={{marginTop:5}} />
					     <Text style={[s.cpm, {color:helper.red}]}>Closed</Text>
					    </View>
				    : null}
				    {onlyveg ? null : <View style={s.mxq}>
				     <CheckBox onChange={this.manageVeg} color={helper.green} />
				     <Text style={s.op}>Only Veg</Text>
				    </View>}				    
				  </View>
			   </View>			 
			   {this.renderDizzer()}
			   <View style={{flexDirection: 'row',height:'100%'}}>
			       <View style={{width:'30%',backgroundColor:color,marginBottom:95}}>			       
			        <CatProvider data={categories} ref={ref => (this.catProvider = ref)} current={currentSection} onPress={this.handleCatPress} />			        
			        <LinearGradient colors={['#00000000', '#000']} style={{width:'100%',height:95}}>
			              <Shimmer direction='up'>					  	      
							  <Icon name={'scup'} size={19} color={helper.primaryColor} />
						  </Shimmer>
					  	  <Shimmer direction='up'>					  	      
							  <Text style={{textAlign:'center',color:helper.primaryColor,fontFamily:'sans-serif-light'}} >Scroll Up For More</Text>
						  </Shimmer>
					</LinearGradient>
			       </View>
				   <FlatList
				      data={catData}			      
				      keyExtractor={(item) => item.id}
				      ref={ref => this.sections = ref}
				      showsVerticalScrollIndicator={false}
				      ListHeaderComponent={this.renderHeader}
				      ListFooterComponent={this.renderFooter}
				      style={{marginBottom:50}}
				      renderItem={({ item }) =>				      
					      <FoodCardSmall 
					       ref={ref => this.foodItem[item.id] = ref}
					       onAdd={() => this.handleAdd(item)}
					       onMount={() => this.onFCMount(item.id, hideCounter)}
					       onRemove={() => this.handleRemove(item)}
					       addonReq={(cb, act) => this.addonManager(item, cb, act)}
					       adons={item.addon}
					       hasRating={false}
					       imgSize={50}
					       hideCounter={hideCounter}
					       fontSize={12}
					       data={item}					       
					      />					      
				      }				      
				    />		 
			    </View>
			 </View>						 
			 <Discounter ref={ref => this.discounter = ref} />
			 <CartView {...this.props} ref={ref => (this.cartView = ref)}/>
			 <FoodSearch ref={ref => this.foodSearch = ref} onClose={this.resetCart} manageAddon={this.addonManager} />
			 <AddonManager 
			  ref={ref => this.adnMng = ref}
			  hotelChange={(amount) => this.hotelChange(amount, 0)}
			  recount={this.recount}
			  onDone={this.addonDone}
			 />			 
			</View>
		)
	}
	renderFooter = 	() => {
		return (
			<View style={{height:80}} />
		)
	}
	renderDizzer = () => {
		const {loading, error, categories} = this.state;
		return (
			<Dazar
		      loading={loading}
		      error={error}		      
		      onRetry={this.loadVendorMeta}
		      length={categories.length}		      		      			  
		    />
		);
	}	
}

const s = StyleSheet.create({
	hdr:{height:50,backgroundColor:'#000',justifyContent:'center',paddingLeft:8,paddingTop:4,width:50},
	tt:{fontSize:18,fontWeight:'bold',fontFamily: 'sans-serif-light',color:helper.silver,maxWidth:250},
	dd:{fontSize:13,color:helper.primaryColor,width:'95%',fontWeight:'bold'},
	pr:{fontSize:19,color:helper.silver},
	vhw:{width:'100%',height:10,justifyContent:'center',alignItems:'center'},
	src:{width:50,height:40,justifyContent:'flex-end'},
	scn:{width:35,height:35,marginRight:5,borderRadius:70,backgroundColor:helper.grey6,justifyContent:'center',alignItems:'center'},
	old:{textDecorationLine: 'line-through',fontSize:15,color:helper.grey},
	cntr:{flexDirection: 'row',alignItems:'center',height:50,justifyContent:'space-between'},
	img:{width:60,height:60,marginHorizontal:13,backgroundColor:helper.grey},
	rrw:{flexDirection: 'row',alignItems:'center',marginTop:5},	
	x:{width:'22%',paddingBottom:7,fontSize:14,color:helper.silver,fontWeight:'bold',textAlign:'center'},
	xx:{width:'22%',borderBottomWidth:2,borderColor:helper.silver,paddingBottom:7,fontSize:14,color:helper.silver,fontWeight:'bold',textAlign:'center'},
	fImage:{backgroundColor:helper.grey,flex:1},
	cbn:{flexDirection:'row',marginBottom:10},
	op:{fontSize:14,color:helper.primaryColor,marginTop:7},
	mxq:{width:60,height:60,justifyContent:'center',alignItems:'center',borderRadius:5,margin:5},
	cpm:{fontSize:14,color:helper.primaryColor,marginTop:4},
	bpq:{fontSize:20,color:helper.primaryColor,fontWeight:'bold'},
	bm:{width:70,height:60,justifyContent:'center',alignItems:'center',borderRadius:5,margin:5},
	desc:{fontSize:12,width:'90%',color:'#fff',marginBottom:8,marginTop:3,marginHorizontal:5},
	foodChip:{width:chipSize,margin:5,height:chipSize,borderRadius:8,backgroundColor:helper.grey},	
	fHolder:{width:'100%',height:'100%',position:'absolute',top:0,left:0,borderRadius:7,justifyContent:'flex-end'},
	ptt:{fontSize:18,fontWeight:'bold',margin:5,color:'white',width:'50%'},
	sep:{marginVertical:9,marginLeft:5,fontSize:14,color:helper.silver}	
})