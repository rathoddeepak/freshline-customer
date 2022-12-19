import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TextInput,	
	ToastAndroid,
	SectionList,
	StatusBar,
	Modal,
	BackHandler,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import {
	Icon,
	Image,
	HeuButton,	
	Button,		
	FoodCardSmall,
	LoadingModal,
	CatProvider,	
	Loading,
	Empty,
	Err
} from 'components';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
import CartView from 'components/cartView2';
import {CommonActions} from '@react-navigation/native';
import { RNSelectionMenu } from 'react-native-selection-menu';
import FoodSearch from 'components/foodSearch2';
import FoodCard2 from 'components/foodCard4';
import Picker2 from 'components/picker2';
const moveBack = 'To End Press on End Meal 🤗🤗!';
const chipSize = helper.width * 20 / 100;
const square = ((helper.width * 50 / 100) * 45 / 100);
export default class VendorView extends Component {
	constructor(props){
		super(props);
		this.state = {	
		    currentSection:0,		
			categories:[],
			loading: false,			
			error:false,
			busy:false,
			ordered:false,
			catLoad:false,
			cartTemp:[],
			hasTax:false,
			taxPercent:0,
			catData:[],
			taxes:[],
			logo:'',
			logo_hash:'',
			taxAmt:0
		}
		this.foodItem = [];
		this.focus = null;
		this.blur = null;
		this.backHandler = null;
	}

	componentDidMount () {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);		
		StatusBar.setBackgroundColor(helper.primaryColor);
		StatusBar.setBarStyle('dark-content');		
		if(typeof this.props.route.params == 'object'){
			let {id, visit_id} = this.props.route.params;
			this.setState({id,visit_id}, this.loadVendorMeta)			
		}else{
			this.props.navigation.goBack();
		}
		this.focus = this.props.navigation.addListener('focus', () => {
		  this.setState({mounted: true})
	      StatusBar.setBackgroundColor(helper.primaryColor);
		  StatusBar.setBarStyle('dark-content');
	    });
	    this.blur = this.props.navigation.addListener('blur', () => {
	      this.setState({mounted: false})
	      StatusBar.setBackgroundColor(helper.blk);
		  StatusBar.setBarStyle('light-content'); 
	    });
	}

	componentWillUnmount(){
		if(this.backHandler != null)this.backHandler.remove();
		if(this.blur != null)this.blur();
		if(this.focus != null)this.focus();
	}

	handleBackButton = () => {		
		if(this.state.tableModel){
			return true;
		}else if(!this.state.mounted){
			return false;
		}else if(this.state.ordered){
			ToastAndroid.show(moveBack, ToastAndroid.LONG);
			this.orderModal.show();
			return true;
		}else if(this.state.loading){
			this.close();
		}else{
			this.endAsk();
			return true;
		}
	}

	loadVendorMeta = async () => {
		let visit_id = this.state.visit_id;
		this.setState({loading: true,error:false,tableModel:false})		
		var res = await request.perform('vendor2', {
			req:'htOdr',			
			vendor_data:true,
			areas:true,
			user_lat:0,
			fdtype:JSON.stringify([helper.FD_BOTH, helper.FD_ONLYMNU]),
			user_long:0,
			taxes:true,
			id:this.state.id,
			user_id,
			visit_id:visit_id == undefined ? 0 : visit_id
		});
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200){
			let {
				id,name,logo,cover,about,
				logo_hash,cover_hash,old_price,approved,rating,
				distance,open_time,close_time,isOpen,dr,
				//safety,full_day,allweek,table_booking,has_mess,
			} = res.data.vendor;			
			rating = rating == null ? undefined : rating;			
			this.setState({
				id,name,logo,cover,about,logo_hash,
				cover_hash,old_price,approved,rating,distance,
				open_time,close_time,isOpen,dr,
				photo_count:res.data.photo_count,
				review_count:res.data.review_count,
				categories:res.data.categories,
				taxes:res.data.taxes,
				hasTax:res.data.taxes.length > 0,
				taxPercent:res.data.tax_percent,
				ordered:visit_id != undefined
			}, () => {
				if(res.data.categories.length > 0){
						this.handleCatPress(0)
				}
				if(visit_id == undefined){
					this.setState({tableModel:true});
					this.tableModel.show(res.data.areas)
				}else{										
					this.resetPrevious(res.data.items);
				}	
			});		
		} else {
			this.setState({error:true});
		}
	}
	resetPrevious = (previous) => {
		setTimeout(() => {
			previous.forEach((item) => this.foodItem[item.food_id]?.setCartCount(item.quantity));
		}, 400);
		this.cartView.dispatch(previous, (im, ta) => {
			this.orderModal.show(im, ta)
		});		
	}
	onCheckViewableItems = ({viewableItems}) => {		
        if(viewableItems.length > 0){
        	let section = -1;
        	for(let item of viewableItems){        		
        		if(item.index !== null && item.section.section != section && item.section.section != undefined){
        			section = item.section.section;
        			break;
        		}
        	}        	
        	if(section != this.state.currentSection){        	         	
        		this.setState({
        			currentSection: section
        		}, () => {
        			this.catProvider.scrollTo(section);
        		});
        	}        	
        }
    }
    placeOrder = async () => {
		let {items, totalCost} = this.cartView.getData();
		if(items.length === 0){
			this.cartView.pls();
			return;
		}		
	    this.setState({busy:true});	    
	    let ims = [];
	    items.forEach(({total,id,cartCount}) => {
	    	ims.push({food_id:id,amount:total,quantity:cartCount});
	    });	    
	    var res = await request.perform('visits', {
	      req:'adftv',
	      visit_id:this.state.visit_id,	      
	      items:JSON.stringify(ims),
	      user_id,
	      se
	    });
	    if(res)this.setState({busy:false});
	    if(typeof res === 'object' && res?.status == 200){	     
	      this.setState({ordered:true});	      
	      this.orderModal.show(items, totalCost);
	      ToastAndroid.show('Order Placed 😃 😃!', ToastAndroid.SHORT);
	    }else {	      
	      ToastAndroid.show('Please Try Again!', ToastAndroid.SHORT);
	    }
	}
    handleFull = () => {    	
    	this.props.navigation.navigate('MainResView', {
    		id:this.state.id,
    		name:this.state.name
    	});
    }
    handleCatPress = (index) => {
    	let catData = this.state.categories[index].data;    	
    	this.setState({catLoad:true});
    	let {items} = this.cartView.getData();    	
    	setTimeout(() => {
    		this.setState({catData,catLoad:false,items});
    	})
    }
    handleMount = (id) => {
    	let items = this.state.items;
    	let index = items.findIndex(i => i.food_id == id);    	
    	if(index != -1){
    		this.foodItem[id].setCartCount(items[index].cartCount);
    	}
    }
    handleAdd = (item) => {        
    	this.cartView.addToCart(item);
    }
    handleRemove = (item) => {
    	this.cartView.removeFromCart(item);
    }

    startSearch = () => {
    	const cats = this.state.categories;
    	if(cats.length === 0)return;
    	const foodList = [];
    	cats.forEach(cat => {
    		cat.data.forEach(item => foodList.push(item))
    	})
    	this.setState({foodSearch:true}, () => {
    		//const data = this.cartView.getData();
    		this.foodSearch.show(foodList);
    	});   	
    }

    addManual = (item) => {    	
    	this.foodItem[item.id]?.setCartCount(item.cartCount);    	
    	this.handleAdd(item)
    	//this.cartView.addToCart(item, true);
    }

	removeManual = (item) => {
		this.foodItem[item.id]?.setCartCount(item.cartCount);
		this.handleRemove(item)
		//this.cartView.removeFromCart(item, true);
	}
	
	handleStart = (visit_id) => {
		this.setState({visit_id,tableModel:false})
	}
	
	startLocking = () => {
		let items = this.cartView.getItems();
		items.forEach((item) => {
			this.foodItem[item.id]?.setLock(true, -1, 'You Can Not Remove, After Ordering');
		})
	}
	
	onJumpToItem = (item) => {
		let catIndex = this.state.categories.findIndex(cat => cat.id === item.cat);
		this.catProvider.setIndex(catIndex);
		let catData = this.state.categories[catIndex].data;
    	this.setState({catLoad:true});
    	let {items} = this.cartView.getData();    	
    	setTimeout(() => {
    		this.setState({catData,catLoad:false,items});
    	})
	}

	checkEnd = async () => {		
	    this.setState({busy:true});	    
	    var res = await request.perform('visits', {
	      req:'chvt',
	      visit_id:this.state.visit_id,	      
	      user_id,
	      se
	    });
	    if(res)this.setState({busy:false});
	    if(typeof res === 'object' && res?.status == 200){	      
	      if(res.data.ended){
	      	if(res.data.ended == 300){
	      		this.endAsk();
	      	}else{
	      		ToastAndroid.show('Thanks For Ordering 😃 😃!', ToastAndroid.SHORT);
		      	this.props.navigation.dispatch(
			        CommonActions.reset({
			          index: 0,
			          routes: [
			            { name: 'HomeActivity' }		            
			          ],
			        })
			    );
			    this.orderModal.hide();
	      	}	
	      }else{
	      	ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
	      }  
	    } else {	      
	      ToastAndroid.show('Please Try Again!', ToastAndroid.SHORT);
	    }
	}
		
	close = () => {
		this.props.navigation.dispatch(
			        CommonActions.reset({
			          index: 0,
			          routes: [
			            { name: 'HomeActivity' }		            
			          ],
			        })
			    );
	}

	endAsk = () => {
		RNSelectionMenu.Show({
	      values:[
	       {value:'Yes',type:2},
	       {value:'No',type:1},
	      ],
	      selectedValues: ["One"],
	      selectionType: 0,
	      presentationType: 1,
	      enableSearch: false,
	      theme:1,
	      title:'Cancel Visit',
	      subtitle:'Do You Want To Cancel Visit Without Orderding',
	      onSelection: value => {	      	
	      	if(value == "Yes"){
	      		this.cancel();
	      	}	        
	      }
	    });
	}

	cancel = async () => {
		this.setState({busy:true});		
		var res = await request.perform('dashboard', {
			visit_id:this.state.visit_id,
			vendor_id:this.state.id,
			req:'cntblv',			
			user_id,
			se
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.data && res?.status == 200){			 
			this.props.navigation.dispatch(
		        CommonActions.reset({
		          index: 0,
		          routes: [
		            { name: 'HomeActivity' }		            
		          ],
		        })
		    );
		    ToastAndroid.show('Visit Cancelled Successfully!', ToastAndroid.SHORT);
		    this.orderModal.hide();
		} else {
			ToastAndroid.show('Please Try Again!', ToastAndroid.SHORT);
		}
	}
	handleTblOptions = (data, number) => {
		this.picker.show({
			values:[
			 {value:"I Am Seprate"},
			 {value:"I Am With Him/Her"},
			 {value:"Select Another Table"},
			],					
			title:'Do You Know',
			subtitle:`You Entered Table ${number} Has Already Someone Sitting`,
			onSelection: value => {
				if(value == false){
					this.tableModel.direct(true);
				}else if(value == "I Am Seprate"){
					this.tableModel.splitVist(data.table_id);
				}else if(value.length == 20){
					this.tableModel.direct(true);
				}else{
					this.tableModel.handleClose();
				}
			}
		});
	}
	setTaxAmt = taxAmt => this.setState({taxAmt});
	invoice = () => this.cartView.invoice();
	render() {
		const {
			name,			
			busy,
			categories,
			catData,
			currentSection,
			taxPercent,			
			hasTax,
			taxes,
			taxAmt,
			logo,
			loading,
			error,
			logo_hash
		} = this.state;				
		const backgroundColor = !loading && !error && categories.length > 0 ? helper.grey4 : "transparent";
		return (
			<View style={helper.hldr}>
			 <View style={s.hdr}>
			  <Text style={s.tt} numberOfLines={1}>{name?.toUpperCase()}</Text>
			 </View>

			 <View style={{flex:1}}>			    
				 
				<View style={s.cntr}>
				   <View style={s.img}>
				       <Image
					    sty={s.tm}
					    imgSty={helper.max}
					    borderRadius={100}
					    hash={logo_hash}
					    source={{uri:helper.site_url + logo}}
					   />
				   </View>				   
				   <View style={{width:'67%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
				    
				    <HeuButton onPress={this.startSearch} style={{height:30,width:'80%',backgroundColor:helper.grey6,borderRadius:20,marginTop:10,flexDirection: 'row',alignItems:'center'}}>
				     <Icon name={lang.srch} color={helper.grey} size={20} style={{margin:5}}/>
				     <Text style={{width:'100%',fontSize:12,color:helper.grey,fontSize:12}}>Search Food</Text>
				    </HeuButton>
				    <Icon name={lang.fltr} color={helper.silver} size={25} style={{marginLeft:10,marginTop:10}} />
				   </View>
			    </View>
			   {this.renderDizzer()}
			   <View style={{flexDirection: 'row',flex:1}}>
			       <View style={{width:'30%'}}>
			        <CatProvider data={categories} ref={ref => (this.catProvider = ref)} current={currentSection} onPress={this.handleCatPress} />
			       </View>
				   <FlatList
				      data={catData}			      
				      keyExtractor={(item) => item.id}
				      ref={ref => (this.sections = ref)}				      
				      contentContainerStyle={{backgroundColor}}
				      showsVerticalScrollIndicator={false}
				      ListHeaderComponent={this.renderHeader}
				      ListFooterComponent={this.renderFooter}
				      renderItem={({ item }) =>				      
					      <FoodCardSmall 
					       ref={ref => this.foodItem[item.id] = ref}
					       onAdd={() => this.handleAdd(item)}					       
					       onRemove={() => this.handleRemove(item)}
					       hasRating={false}
						   menuPrice
					       imgSize={55}
					       onMount={() => this.handleMount(item.id)}
					       borderRadius={10}
					       imgRadius={100}
					       backgroundColor={'#505050'}
					       showCutP={false}
					       data={item}					       
					      />					      
				      }				      
				    />		 
			    </View>								
			   {hasTax ? <View style={{width:'100%',backgroundColor:helper.blk,padding:10}}>
						<Text style={{fontSize:14,color:helper.white,fontWeight:'bold'}}>Taxes Applicable</Text>
						<View style={{flexDirection:'row'}}>							
						
						<View style={{flex:1}}>
							{taxes.map((tx => 
							<Text style={{fontSize:13,color:helper.white}}>{tx.name} @{tx.percent}%</Text>
							))}
						</View>
						<View style={{width:50,justifyContent:'center',alignItems:'center'}}>
							<Text style={{fontSize:14,fontWeight:'bold',color:helper.white}}>{lang.rp}{taxAmt}</Text>
						</View>
						</View>
				</View> : null}
			</View>
			<CartView {...this.props} taxes={taxes} onOrder={this.placeOrder} onTaxGot={this.setTaxAmt} taxPercent={taxPercent} title={this.state.name} ref={ref => (this.cartView = ref)} />			
			<FoodSearch addItem={this.addManual} removeItem={this.removeManual} ref={ref => this.foodSearch = ref} onJump={this.onJumpToItem} onClose={() => {}} />
			<Picker2 ref={ref => this.picker = ref} />
			<TableModel hotelName={name} showOptions={this.handleTblOptions} onClose={this.close} ref={ref => this.tableModel = ref} onDone={this.handleStart} />
			<OrderModal {...this.props} onReceipt={this.invoice} onDecreaseLock={this.startLocking} endChk={this.checkEnd} ref={ref => this.orderModal = ref} />
			<LoadingModal visible={busy} />
			</View>
		)
	}

	renderHeader = () => {
    	if(this.state.catLoad){
    		return (
    			<View style={{width:'100%',marginVertical:5,justifyContent:'center',alignItems:'center'}}>
	    		 <Text style={{fontSize:14,color:helper.white}}>Loading...</Text>
	    		</View>
    		)
    	}else{
    		return (
    			<View />
    		)
    	} 	
    }

	renderFooter = 	() => {
		return (
			<View style={{height:80}} />
		)
	}
	renderDizzer = () => {
		const {loading, error} = this.state;
		if(!loading && error){
			return (
				<Err onPress={this.loadVendorMeta} />
			);
		}else if(loading && !error){
			return (
			  <Loading />
			)
		}else if(!loading && !error && this.state.categories.length === 0){
			return (
				<Empty />
			);
		}else{
			return (<View></View>)
		}
	}	
}
class TableModel extends Component {
	constructor(props){
		super(props);
		this.state = {
			areas:[],
			number:'',
			area_id:-1,
			v:false
		}
	}
	show  = (areas) => {		
		this.setState({areas,v:true});
	}
	sbmt = async () => {
		let {area_id, number} = this.state;
		if(area_id == -1){
			ToastAndroid.show('Please Select Area', ToastAndroid.SHORT);
			return;
		}else if(request.isBlank(number)){
			ToastAndroid.show('Please Enter Table Number', ToastAndroid.SHORT);
			return;
		}else if(isNaN(number)){
			ToastAndroid.show('Please Enter Valid Table Number', ToastAndroid.SHORT);
			return;
		}
		this.setState({busy:true})		
		var res = await request.perform('visits', {								
			area_id,
			number,
			user_id,
			se
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){
			if(res.data.visit_id == undefined){
				this.props.showOptions(res.data, number);
			}else{
				this.props.onDone(res.data.visit_id);
			}			
			this.setState({v:false})
		} else  if(res?.status == 400) {
			ToastAndroid.show(res.data, ToastAndroid.SHORT);
		} else {
			ToastAndroid.show('Please Try Again!', ToastAndroid.SHORT);
		}
	}

	direct = (v) => this.setState({v});

	splitVist = async (table_id) => {				
		this.setState({busy:true})		
		var res = await request.perform('visits', {			
			req:'splvst',
			table_id,
			user_id,
			se
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){
			this.props.onDone(res.data);
		} else  if(res?.status == 400) {
			ToastAndroid.show(res.data, ToastAndroid.SHORT);
		} else {
			ToastAndroid.show('Please Try Again!', ToastAndroid.SHORT);
		}
	}

	handleClose = () => {		
		this.setState({v:false}, () => {
			this.props.onClose()
		})
	}
	render() {
		const {
			area_id,
			areas,
			number,		
			busy,
			v
		} = this.state;
		const title = `Welcome To\n${this.props.hotelName}`;
		return (
			<Modal visible={v} onRequestClose={this.handleClose} transparent animationType="fade">
			 <View style={helper.model}> 			  
			  <View style={s.dailog}>
			   <Text style={{textAlign:'center',marginVertical:10,fontWeight:'bold',fontSize:15,color:'#fff'}}>{title}</Text>
			   
			   <View style={{flexDirection:'row'}}>
			    <View style={{width:'70%',flexDirection:'row',flexWrap:'wrap'}}>
			     {areas.map(a =>
			     	<HeuButton onPress={() => this.setState({area_id:a.id})} style={{backgroundColor:area_id == a.id ? helper.primaryColor : '#6F6F6F',margin:5,borderRadius:8,width:square,height:square,justifyContent:'center',alignItems:'center'}}>
			     	 <Text style={{fontWeight:'bold',fontSize:15,color:'#fff'}}>{a.area}</Text>
			     	 <Text style={{fontWeight:'bold',fontSize:12,position:'absolute',bottom:5,left:5,color:'#fff'}}>{a.name}</Text>
			     	</HeuButton>
			     )}
			    </View>
			    <View style={{width:'30%',justifyContent:'center',alignItems:'center'}}>
			      <TextInput keyboardType="numeric" onChangeText={(number) => this.setState({number})} maxLength={3} value={number} placeholderTextColor={helper.grey} placeholder="Table No." style={{fontSize:19,fontWeight:'bold',marginVertical:5,marginHorizontal:10,padding:0,textAlign:'center',color:helper.silver}} />
			      <Button
			       text={'Submit'}
			       size={16}
			       br={30}
			       onPress={this.sbmt}
			       hr={20}		       
			      />			      
			    </View>
			   </View>
			   {busy ? <View style={helper.main4}>
				   <ActivityIndicator color={helper.primaryColor} size={35} />
			   </View> : null}
			   <TouchableOpacity onPress={this.handleClose} style={s.cgr}>
					  <Icon name="close" size={19} color={helper.white} />
				</TouchableOpacity>
			  </View>
			 </View>

			</Modal>
		)
	}
}

class OrderModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			items:[],
			totalAmount:0,
			v:false
		}
	}
	hide = () => {
		this.setState({v:false})
	}
	show = (items, totalAmount) => {
	   if(items == undefined){
	   	this.setState({v:true})
	   }else{
	   	this.setState({items, v:true, totalAmount});
	   }		
	}

	addMore = () => {
		this.setState({v:false}, () => {
			this.props.onDecreaseLock();
		})
	}

	rq = () => {
		ToastAndroid.show(moveBack, ToastAndroid.LONG);
	}

	handleInv = () => {
		this.setState({
			v:false
		}, () => {
			this.props.onReceipt();
		})
	}
	render() {
		const {
		  items,
		  totalAmount,
		  v
		} = this.state;
		return (
			<Modal visible={v} onRequestClose={this.rq} transparent animationType="fade">
			 <View style={helper.model}> 			  			  
			  <View style={[s.dailog, {height:'80%'}]}>
			   <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
				   <Text style={{margin:5,padding:5,fontWeight:'bold',fontSize:20,color:helper.primaryColor}}>Your Orders</Text>
				   <Button
				      text={'End Meal'}
				      size={16}
				      br={30}				      
				      onPress={this.props.endChk}
				      style={{marginHorizontal:6}}
				      hr={20}
				   />
			   </View>
			   <FlatList				     
			     data={items}			     
			     showsHorizontalScrollIndicator={false}	     			     			     
			     horizontal			     
			     contentContainerStyle={{maxHeight:'80%',padding:5,flexDirection:'column',flexWrap:'wrap'}}
			     renderItem={({item}) =>
			      <FoodCard2
			       imgRadius={100}
			       borderRadius={10}
			       backgroundColor={helper.grey6}
			       data={item}
			       width={240}
			       cStyle={{margin:5}}
			      />
			     }
	             keyExtractor={item => item.id.toString()}
			   />

			   <View style={{height:50,position:'absolute',bottom:0,borderBottomLeftRadius:10,borderBottomRightRadius:10,width:'100%',backgroundColor:helper.primaryColor,flexDirection:'row',justifyContent:'space-between'}}>
			    
			    <View style={{flexDirection:'row',alignItems:'center'}}>
			      <Button
			       text={'Order More'}
			       size={16}
			       br={30}
			       onPress={this.addMore}
			       bgColor="#5e5e5e"
			       style={{marginHorizontal:6}}
			       hr={20}		       
			      />
			      <Button
			       text={'RECEIPT'}
			       size={16}
			       br={30}
			       bgColor="#5e5e5e"
			       onPress={this.handleInv}
			       style={{marginHorizontal:6}}
			       hr={20}
			      />
			    </View>

			    <View style={{height:'100%',marginRight:10,justifyContent:'center'}}>
			     <Text style={{fontSize:20,fontWeight:'bold',color:helper.blk}}>{lang.rp}{totalAmount}</Text>
			    </View>

			   </View>

			  </View>
			 </View>
			</Modal>
		)
	}
}

const s = StyleSheet.create({
	tm:{width:65,height:65},
	hdr:{height:50,backgroundColor:helper.primaryColor,justifyContent:'center',alignItems:'center'},
	tt:{fontSize:16,fontWeight:'bold',color:helper.blk},
	dd:{fontSize:13,color:helper.primaryColor,width:'95%',fontWeight:'bold'},
	pr:{fontSize:19,color:helper.silver},
	old:{textDecorationLine: 'line-through',fontSize:15,color:helper.grey},
	cntr:{flexDirection: 'row',paddingBottom:15,alignItems:'center',height:55},
	dailog:{width:'97%',elevation:24,backgroundColor:'#414141',borderRadius:9},
	img:{width:75,height:75,marginHorizontal:13,justifyContent:'center',alignItems:'center',borderRadius:100,backgroundColor:helper.blk,marginTop:-1},
	rrw:{flexDirection: 'row',alignItems:'center',marginTop:5},	
	x:{width:'22%',paddingBottom:7,fontSize:14,color:helper.silver,fontWeight:'bold',textAlign:'center'},
	xx:{width:'22%',borderBottomWidth:2,borderColor:helper.silver,paddingBottom:7,fontSize:14,color:helper.silver,fontWeight:'bold',textAlign:'center'},
	fImage:{backgroundColor:helper.grey,flex:1},
	desc:{fontSize:12,width:'90%',color:'#fff',marginBottom:8,marginTop:3,marginHorizontal:5},
	foodChip:{width:chipSize,margin:5,height:chipSize,borderRadius:8,backgroundColor:helper.grey},	
	fHolder:{width:'100%',height:'100%',position:'absolute',top:0,left:0,borderRadius:7,justifyContent:'flex-end'},
	ptt:{fontSize:18,fontWeight:'bold',margin:5,color:'white',width:'50%'},
	cgr:{position:'absolute',backgroundColor:helper.grey,elevation:10,borderRadius:100,width:30,height:30,justifyContent:'center',alignItems:'center',top:3,right:3},
	sep:{marginVertical:9,marginLeft:5,fontSize:14,color:helper.silver}	
})