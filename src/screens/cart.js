import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SectionList,
	TouchableOpacity,
	ToastAndroid,
	Modal,
	Alert,
	TextInput,
	FlatList,
	DeviceEventEmitter,
	TouchableNativeFeedback,
	Animated as Animated1
}  from 'react-native';
import {
	Icon,	
	Dazar,
	Button,
	Switch,
	Dailog,
	SButton,	
	CHeader,	
	//Claimer,
	ClapModel,
	RazorView,	
	LoadingModal,
	DateTimePicker,
	AddressModal,
	DialogInput
} from 'components';
import MyCart from 'libs/mycart';
import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import request from 'libs/request';
import helper from 'assets/helper';
import * as Animatable from 'react-native-animatable';
import Animated from 'react-native-reanimated';
import lang from 'assets/lang';
import BottomSheet from 'reanimated-bottom-sheet'
import moment from 'moment';
import RazorpayCheckout from 'react-native-razorpay';
import {CommonActions} from '@react-navigation/native';
import { RNSelectionMenu } from 'react-native-selection-menu';
import { CountdownCircleTimer } from "components/countdown";
import AddonManager from 'components/addonManager';
import ReasonStop from 'components/reasonStop';
import AskAd from 'components/askAd';
import CartItem from 'components/cartItem';
import Address from 'libs/address';
import MCart from 'libs/cart';
import Parse from 'parse/react-native';
import CoupunCelebrate from 'components/coupunCelebrate';
import ScratchModal from 'components/scratchModal';
import CheckBox from 'components/checkBox';
import LottieView from 'lottie-react-native';
import UserDB from 'libs/userdb';

const validHours = [10, 11, 12, 13, 14, 15, 16, 17, 18 , 19, 20, 21];
const minutes = 60000;
const todayDate = new Date().getDate();
const COD = 0;
const ONLINE_PAY = 1;
function getFinalAmount(totalAmount, discount, walletAmount, useWallet) {
	discount = discount == false ? 0 : discount.amount;
	if(useWallet){
		walletAmount = walletAmount == undefined ? 0 : walletAmount;
	}else{
		walletAmount = 0;
	}	
	return totalAmount - (discount + walletAmount);
}
export default class Cart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cart:[],
			removed:[],
			loading:false,
			error:false,
			f_ids:[],
			cartTemp:[],
			delivery:false,
			timebased:false,
			deliveryFee:0,
			deliveryTime:'',
			reward:{},
			currentP:-1,
			customPraise:0,
			reward_id:0,
			dtTime:null,
			order_id:null,
			locationC:false,
			praiseData:[10,30,60],
			ordering:false,
			removeSheet:false,
			totalAmount:0,
			has_cod:true,
			subTotal:0,
			discount:false,
			avoidReload:false,
			walletAmount:0,
			useWallet:true,

			situationStatus:false
		}
		this.cartItem = [];
		this.praiseH = [];
		this.focus = null;
		this.blur = null
		this.contentPosition = new Animated.Value(0);
	}
	componentDidMount() {				
		this.focus = this.props.navigation.addListener('focus', () => {
			if(this.state.avoidReload == false){
				this.loadCart();
			    MCart.addCartListener(report => {
			    	this.setState({report}, this.calculateReport)
				});
			}else{
				this.setState({avoidReload:false})
			}	  
	    });
	    this.blur = this.props.navigation.addListener('blur', () => {
	      MCart.removeCartListener();
	    });
	    DeviceEventEmitter.addListener(helper.DISCOUNT_HOCK, this.updateDiscount);
	}
	componentWillUnmount () {    	    
	    if(this.focus != null)this.focus();
	    if(this.blur != null)this.blur();
	    DeviceEventEmitter.removeAllListeners(helper.DISCOUNT_HOCK);
	}
	updateDiscount = (discount) => {
		if(discount.type == helper.DISCOUNT_TYPE_PERCENT){
			discount.amount = parseInt((this.state.totalAmount * discount.percent) / 100)
		}
		this.setState({discount}, () => {
			this.celebrateDiscount(discount)
		})
	}
	celebrateDiscount = (discount) => {
		this.celebrateView.show(discount)
	}
	removeDiscount = () => {
		this.setState({discount:false})
	}
	loadCart = () => {
		if(this.state.loading)return
		this.setState({situationStatus:false,useWallet:true,loading: true,error:false,cart:[],removed:[], totalAmount:0,subTotal:0,discount:false});
		const address_id = this.state.address_id;
		const address = Address.getCurrentAddress();
		Parse.Cloud.run('formalizeCart', {user_id, address, address_id}).then(({data, status}) => {
			if(status == 200){
				const {cart,charges,removed,tips,report,cod,address,wallet} = data
				this.setState({walletAmount:wallet,loading:false,error:false,removed,cart,charges,praiseData:tips,report,has_cod:cod}, () => {
					this.calculateReport();
					this.address.dispatch(address);
					if(address != undefined){
						this.setState({address_id:address.id})
					}
				});
				return
			}else if(status == 400){
				this.setName();
				if(data.status == helper.CITY_NOT_AWAKE){
					const startTimeTxt = moment.unix(data.time).format('HH:MM A')
					this.setState({
						situationStatus:helper.CITY_NOT_AWAKE,
						startTimeTxt
					})
				}else if(data.status == helper.CITY_SLEEPED){
					const startTimeTxt = moment.unix(data.time).format('HH:MM A')
					this.setState({
						situationStatus:helper.CITY_SLEEPED,
						startTimeTxt				
					})
				}else{
					const err_type = data.err_type;
					if(err_type == 0){
						this.setState({locationC:true,removeSheet:true})
					}else if(err_type == 1){
						ToastAndroid.show('Your Cart Was Cleared, Add Product Again!', ToastAndroid.SHORT);
						this.setState({cart:[]})
					}
				}
			}
			this.setState({loading:false,error:true});
		}).catch(err => {
			this.setState({loading:false,error:true});
		});
	}
	setName = () => {
		let {name} = UserDB.getUser();
		this.setState({name});	
	}
	calculateReport = () => {
		const {report, charges, currentP, praiseData} = this.state;
		if(report.totalAmt == undefined)return
		let subTotal = report.totalAmt;
		let totalAmount = subTotal;
		for(let charge of charges){
			totalAmount += charge.value;
		}
		if(currentP != -1){
			totalAmount += praiseData[currentP];
		}
		this.setState({
			totalAmount,
			subTotal
		})
	}
	clearCart = () => {
	    this.setState({ordering:true});		
		Parse.Cloud.run("clearCart", {user_id}).then(({status, data}) => {
			this.setState({ordering:false});
			if(status == 200){
				ToastAndroid.show("Cart Cleared", ToastAndroid.SHORT);
				setTimeout(() => {
					this.props.navigation.goBack();
				}, 300)
			}else{
				ToastAndroid.show("Unable To Clear Cart!", ToastAndroid.SHORT);
			}
		}).catch(err => {
			this.setState({ordering:false}, () => {
				ToastAndroid.show("Unable To Clear Cart!", ToastAndroid.SHORT);
			})
		})
	}
	handleClosed = (closedVendors, foodNotAvailable) => {
		if(closedVendors.length > 0){
			let f_ids = [];
			let cartTemp = [];
			let foodAmount = 0;
			this.cart.find({vendor_id: { $nin: closedVendors }}).exec((err, fs) => {				
				fs.forEach(({id,price,cartCount}) => {
					f_ids.push({id,quantity:cartCount})
					cartTemp[id] = cartCount;
					foodAmount += (price * cartCount);
				});	
				this.setState({cartTemp,removeSheet:true,f_ids,foodAmount});
			});
		}
	}

	handlePraise = (id, manual = false) => {
		let totalAmount = this.state.totalAmount;		
		if(this.state.customPraise != 0){
			totalAmount -= this.state.customPraise;
			this.setState({customPraise:0})
		}
		if(this.state.currentP == id){
			this.setState({currentP:-1})			
			totalAmount -= this.state.praiseData[id];
			if(manual){
				this.praiseH[this.state.currentP].act(false);
			}
			this.setState({totalAmount})
			return;
		}
		if(this.state.currentP == -1){
			this.clapModel.clap();	
		}else{
			totalAmount -= this.state.praiseData[this.state.currentP];
			this.praiseH[this.state.currentP].act(false);
		}
		totalAmount += this.state.praiseData[id];
		if(this.state.surgeCharge != undefined){
			totalAmount += this.state.surgeCharge;
		}
		this.setState({currentP:id,totalAmount})
	}
	handleCOD = (delivery) => {
		this.setState({delivery}, () => {
			if(delivery){
				this.startCashOrder()
			}else{
				this.placeOrder()
			}
		});
	}
	handleTBT = (delivery) => {
		this.tbSwitch.toggleSwitchToValue(true, true, () => {});
		this.handleTB(true);
	}
	handleTB = (timebased) => {
		this.setState({timebased});	
		if(!timebased)return;
		var hours = [];		
		var preStamp = new Date();
		var date = new Date();
		date.setHours(1 + date.getHours(), 0, 0, 0);
		let difference = (date.getTime() - preStamp.getTime()) / minutes;		
		if(difference < 30)
			date.setHours(date.getHours() + 1, 0, 0, 0);		
		var hour = date.getHours();		
		var idx = validHours.indexOf(hour);		
		if(idx == -1){		    			
			let desc = '';			
		    if(hour < 10){		    	
		    	desc = lang.z[cl].cdmr;
		    }else if(hour > 21){
		    	date.setDate(date.getDate() + 1);
		    	desc = lang.z[cl].cdnt;
		    }
		    date.setHours(10, 0, 0, 0);
		    this.onTimeSelected(date);
		    this.dailog.show({title:'Conformation', act1:'', act2:'OK', desc},
			    () => {			   	  
				 this.closeDt();
			    }, () => {				
				 this.closeDt();
			   });
		}else{
			this.onTimeSelected(date);			
			for(var i = idx; i < validHours.length; i++)hours.push(validHours[i]);
			this.datePicker.show(hours, date);
		}
	}
	closeDt = () => {
		this.tbSwitch.toggleSwitchToValue(true, false, () => {
			this.setState({
				timebased:false
			})
		})
	}
	onTimeSelected = (time) => {		
		let pre = todayDate == time.getDate() ? 'Delivery At' : 'Delivery Tommorrow At';
		let hr = ("0" + (time.getHours())).slice(-2);
		let mn = ("0" + (time.getMinutes())).slice(-2);
		let deliveryTime = ` ${pre} ${hr}:${mn}`;
		this.setState({deliveryTime,dtTime:time.getTime()});
	}
	onRecieveAddress = (address_id, subtitle) => {		
		this.setState({address_id}, this.loadCart)
	}
	addAddress = () => {
		this.address.show();
	}
	hdlRmFd = (vendor_id) => {
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
			title:'Remove From Cart',
			subtitle:'Are You Sure You Want To Remove Food From Cart!',
			onSelection: value => {
				if(value == "Yes"){
					MyCart.removeVendor(vendor_id, () => {
						this.initialize();
					});
				}
			}
		  });			
	}
	askAdHdl = (change) => {
		if(change){
			this.address.show();
		}
	}
	render() {
		const {
			cart,
			error,
			locationC,
			loading,
			ordering,
			deliveryFee,
			removeSheet,
			totalAmount,
			has_cod,
			removed,
			situationStatus,
			discount,
			walletAmount,
			useWallet
		} = this.state;
		if(situationStatus != false){
			return this.renderSituation(situationStatus)
		}
		return (
			<View style={s.hldr}>
				 <CHeader
				  renderLeft={this.renderClear}
				  text={lang.z[cl].crt}
				 />
				 <AddressModal 
				  backgroundColor={helper.primaryColor}
				  onReceive={this.onRecieveAddress}
				  ref={ref => this.address = ref}
				 />
				 {/*!loading && !error && cart.length != 0 ?
			     	<Claimer onId={reward_id => this.setState({reward_id})} ref={ref => this.claimer = ref} />
			     : null*/}			     
				 <Dazar
			      loading={loading}
			      error={error}
			      length={cart.length}
			      onRetry={this.loadCart}		      
			     />			     
				 <FlatList
			      data={cart}
			      keyExtractor={(item) => item.id}
			      ref={ref => (this.sections = ref)}
			      showsVerticalScrollIndicator={false}			      
			      ListFooterComponent={this.renderFooter}
			      ListHeaderComponent={this.renderHeader}
			      contentContainerStyle={{marginTop:15}}			      
			      renderItem={({ item }) =>			      
				      {
				      	return (
				      	  <View style={s.ithd}>
					       <CartItem
					        ref={ref => this.cartItem[item.id] = ref}
					        data={item}
					       />
					      </View>
				      	)
				      }
			      }
			    />
			    <ClapModel
			     ref={ref => this.clapModel = ref}
			    />
			    {removeSheet ? <View style={{height:60,width:'100%',backgroundColor:helper.primaryColor,justifyContent:'center',alignItems:'center'}}>
				  <Button
			       text={'Clear Cart'}
			       size={14}
			       bgColor={helper.blk}
			       br={30}		       
			       onPress={this.clearCart}
			       hr={20}		       
			      />
				</View> :
				loading == false && error == false ? this.renderToPay(totalAmount, discount, walletAmount, useWallet) : null}
				{locationC ? 
					<View style={s.lct}>
					 <Text style={{fontSize:12,width:'95%',textAlign:'center',color:helper.silver,fontWeight:'bold'}}>Glad To See You, We Are Coming In Your Location Soon</Text>
					 <Button
				       text={'Change Location'}
				       size={14}
				       br={30}
				       style={{marginVertical:3}}
				       onPress={this.addAddress}
				       hr={20}		       
				      />
					</View>
				: null}
				<LoadingModal visible={ordering} />
				<Dailog ref={ref => (this.dailog = ref)} />
				<DateTimePicker ref={ref => this.datePicker = ref} onTimeSelected={this.onTimeSelected} />
				<DialogInput ref={ref => (this.dialogInput = ref)} />
				<PayModeModal ref={ref => (this.paymodeModal = ref)} cashOn={this.handleCOD} hasCod={has_cod} />
				<AskAd ref={ref => (this.askAd = ref)} hasChange={this.askAdHdl} />
				<ScratchModal ref={ref => this.successModal = ref} />
			</View>
		)
	}

	renderToPay = (totalAmount, discount, walletAmount, useWallet) => {		
		let totalSaving = discount == false ? 0 : discount.amount;		
		walletAmount = useWallet == false || walletAmount == false  || walletAmount == undefined ? 0 : walletAmount;
		totalSaving += walletAmount;
		return (
			<>			
			<TouchableNativeFeedback onPress={this.proceedPay}><View style={[s.footerSty, {flexWrap:'wrap',height:totalSaving == 0 ? 50 : 85}]}>
			 {totalSaving == 0 ? null : 
				<View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#06C167',borderTopRightRadius:10,borderTopLeftRadius:10,borderBottomWidth:1,borderColor:helper.homeBgColor,width:'100%',alignSelf:'center',height:35}}>
				 <Text style={{width:'100%',textAlign:'center',fontFamily:'sans-serif-medium',fontSize:16,color:helper.white,fontWeight:'bold'}}>Congratulations You Saved, {lang.rp}{totalSaving}</Text>
				</View>
			 }
			 <Text style={{marginTop:25,fontSize:15,marginLeft:10,color:helper.white,fontFamily:'sans-serif-medium'}}>To Pay {lang.rp}{totalAmount}</Text>
			 <Text style={{marginTop:25,fontSize:17,marginRight:10,color:helper.white,width:120}}>Proceed To Pay</Text>
			</View></TouchableNativeFeedback>
			</>
		)
	}

	renderSituation = (situationStatus) => {
		 if(situationStatus == helper.CITY_NOT_AWAKE){
			return (
				<View style={[s.main, s.center]}>				 
				 <LottieView
				  loop
				  autoPlay
				  style={{width:250,height:250}}
				  source={require('assets/anims/morning.json')}
				 />
				 <Text style={s.sitTitle}>Good Morning, {this.state.name}!</Text>
				 <Text style={s.sitDesc}>Our services will start at {this.state.startTimeTxt}</Text>
				</View>
			)
		}else if(situationStatus == helper.CITY_SLEEPED){
			return (
				<View style={[s.main, s.center]}>
				 <LottieView
				  loop
				  autoPlay
				  style={{width:250,height:250}}
				  source={require('assets/anims/night.json')}
				 />
				 <Text style={s.sitTitle}>Good Night, {this.state.name}!</Text>
				 <Text style={s.sitDesc}>We will be back tomorrow,{'\n'}In the morning at {this.state.startTimeTxt}.</Text>
				</View>
			)
		} else {
			return <View />
		}
	}

	renderHeader = () => {
		return (
			<FlatList
		      data={this.state.removed}
		      keyExtractor={(item) => item.id}
		      showsVerticalScrollIndicator={false}
		      ListFooterComponent={this.renderRemovedHeader}
		      contentContainerStyle={{marginTop:15}}			      
		      renderItem={({ item }) =>			      
			      {
			      	return (
			      	  <View style={s.ithd}>
				       <CartItem
				        data={item}
				        addEnable={false}
				       />
				      </View>
			      	)
			      }
		      }
		    />
		)
	}
	renderRemovedHeader = () => {
		if(this.state.removed.length > 0){
			return (
				<View style={{width:'100%',padding:5,justifyContent:'center',backgroundColor:helper.secondaryColor}}>
				 <Text style={{fontSize:14,color:helper.bgColor,width:'100%'}}>Above Items Are Removed, They Are Out of Stock!</Text>
				</View>
			)
		}else{
			return null
		}
	}

	renderClear = () => {
		return (
			<Text onPress={this.clearCart} style={{fontSize:17,color:helper.white,width:90}}>Clear Cart</Text>
		)
	}
	dlvWhy = () => {
		Alert.alert(
	      "Know Why?",
	      "It's For Our Delivery Hero, We Charge 1 Rupee For Every 100 Meters Above 4 KM",
	      [	        
	        { text: "Ok I Understand"}
	      ]
	    );
	}
	startCashOrder = () => {
		const {address_id,anyreq,altnum,cart,subTotal} = this.state;    	
    	if(subTotal == 0){
    		ToastAndroid.show('Please Add Products!', ToastAndroid.SHORT);
    		return;
    	}    	
    	if(address_id == undefined){
    		this.address.show();
    		ToastAndroid.show(lang.z[cl].pls +' '+ lang.z[cl].sltad, ToastAndroid.SHORT);
    		return;
    	}    	
		this.cashOrder.show()
	}
	navigateDiscount = () => {
		this.setState({
			avoidReload:true
		}, () => {
			this.props.navigation.navigate('Discounts', {
				discount:this.state.discount,
				totalAmount:this.state.totalAmount
			})
		});
	}
	toggleWallet = (useWallet) => {
		this.setState({useWallet})
	}
	renderFooter = () => {
		const {
			loading,
			error,
			subTotal,
			totalAmount,
			cart,
			deliveryTime,
			timebased,
			praiseData,
			customPraise,			
			currentP,
			charges,
			discount,
			walletAmount,
			useWallet
		} = this.state;			
		const d_praise = currentP == -1 ? 0 : praiseData[currentP];		
		if(loading || error || cart?.length == 0){
			return (
				<View />
			)
		}
		const finalAmount = getFinalAmount(totalAmount, discount, walletAmount, useWallet);
		return (
			<View style={{height:'100%',marginBottom:10}}>
			    
			    {/*<View style={s.clhj}>
			     <View style={s.ptrc}>
			      <Icon name={lang.bl} color={helper.secondaryColor} size={20} />
			     </View>
			     <TextInput onChangeText={anyreq => this.setState({anyreq})} maxLength={255} placeholderTextColor={helper.secondaryColor} placeholder="Any Restaurant Request...We Will Pass It On" style={s.ybb} />
			    </View>*/}

			    <View style={s.clhj}>
			     <View style={s.ptrc}>
			      <Icon name={lang.phn} color={helper.grey} size={20} />
			     </View>
			     <TextInput onChangeText={altnum => this.setState({altnum})} maxLength={10} keyboardType="numeric" placeholderTextColor={helper.grey} placeholder="Alternate Phone No." style={s.ybb} />
			    </View>


			    {this.renderDiscount(discount)}
			    {this.renderWallet(walletAmount, useWallet)}

				<View style={s.prcntr}>
				 <Text style={s.prtt}>
				  {lang.z[cl].prordlhr}
				 </Text>
				 <Text style={s.prdsc}>{lang.z[cl].prdsc}</Text>
				 <View style={{flexDirection: 'row',flexWrap:'wrap',marginTop:8}}>
				  {praiseData.map((data, idx) => {
				  	return (
				  		<SButton 
						   ref={ref => this.praiseH[idx] = ref } 
						   text={lang.rp + data} 
						   style={{margin:10}}
						   minWidth={55}
						   height={25}
						   onPress={() => this.handlePraise(idx)}
						/>					 
				  	)
				  })}			  
				 </View>
				</View>
				{/*<View style={{flexDirection:'row',backgroundColor:'#1515156b',alignItems:'center'}}>
					<Switch
					 onSyncPress={this.handleTB}				 				 
					 ref={ref => (this.tbSwitch = ref)}
					 style={{marginLeft:10,marginVertical:10}}
					/>				
					<Text style={s.cd}>{lang.z[cl].dotm}</Text>				
				</View>
				<View style={s.axf2}>			
				{timebased ?
				 <Text numberOfLines={1} onPress={this.handleTBT} style={{fontSize:14,color:helper.silver}}>{deliveryTime}</Text>
	            :<Text numberOfLines={2} onPress={this.handleTBT} style={{fontSize:12,color:helper.silver}}>{lang.z[cl].tbdc}</Text>
	            }</View>*/}
	            
	            <View style={s.billCover}>
	             <Text style={{fontSize:16,color:helper.blk,fontFamily:'sans-serif-medium',margin:10}}>Bill Details</Text>
	             

	             <View style={s.mbhg}>
	              <Text style={s.mvhj}>Subtotal</Text>
	              <Text style={s.mvhj}>{lang.rp}{subTotal}</Text>
	             </View>

	             {charges.map(this.renderCharges)}

	             <View style={s.mbhg}>
	              <Text style={s.mvhj}>Tip</Text>
	              <Text style={s.mvhj}>{lang.rp}{d_praise}</Text>
	             </View>
	             {/*<View style={s.vnu}>
	              <Text style={s.nvgl}>It Goes Fairly To Our Hero</Text>
	             </View>*/}

	             {discount == false ? null :
	             	<View style={s.mbhg}>
		              <Text style={[s.mvhj, {fontWeight:'bold',color:helper.primaryColor}]}>Discount</Text>
		              <Text style={[s.mvhj, {fontWeight:'bold',color:helper.primaryColor}]}>-{lang.rp}{discount.amount}</Text>
		            </View>
	             }
	             {useWallet == false || walletAmount == undefined || walletAmount == 0 ? null :
	             	<View style={s.mbhg}>
		              <Text style={[s.mvhj, {fontWeight:'bold',color:helper.primaryColor}]}>Wallet</Text>
		              <Text style={[s.mvhj, {fontWeight:'bold',color:helper.primaryColor}]}>-{lang.rp}{walletAmount}</Text>
		            </View>
	             }

	             <View style={{flexDirection:'row',justifyContent:'space-between',width:'94%',alignSelf:'center',paddingTop:4,borderTopWidth:0.5,borderColor:helper.borderColor}}>
	              <Text style={s.wsn}>Grand Total</Text>
	              <Text style={s.wsn}>{lang.rp}{finalAmount}</Text>
	             </View>

	            </View>

				<CashOrder ref={ref => this.cashOrder = ref} onSuccess={this.placeOrder} />
				<ReasonStop ref={ref => this.reasonStop = ref} />
				<AddonManager
				  ref={ref => this.adnMng = ref}				  
				  onDone={this.addonDone}
				/>
				<CoupunCelebrate ref={ref => this.celebrateView = ref} />
			</View>
		)		
	}

	renderWallet = (wallet, useWallet) => {
		return (
			<View style={[s.coupunCover, {justifyContent:undefined,backgroundColor:helper.white,borderWidth:1,borderColor:helper.primaryColor}]}>
			    <View style={[s.coupunIcon, {width:50,height:50,backgroundColor:helper.primaryColor,marginRight:10,borderRadius:100,}]}>
			      <Icon name='wallet' color={helper.white} size={30} />
			    </View>
				<View style={{width:'60%'}}>
					<Text style={[s.coupunTitle, {color:helper.blk}]}>Balance: {lang.rp}{wallet + ''}</Text>
					<Text style={s.coupunDesc}><Text style={{color:helper.primaryColor}}>{useWallet ? 'Using' : 'Not Using'} </Text>wallet money!</Text>
				</View>			     
				<View style={[s.coupunIcon, {width:70,position:'absolute',right:0}]}>
			        <CheckBox						     
				     size={30}
				     borderColor={helper.primaryColor}
				     color={helper.primaryColor}
				     selected
				     onChange={this.toggleWallet}
				    />
			    </View>
			</View>
		)
	}

	renderDiscount = (discount) => {
		if(discount == false){
			return (
				<TouchableOpacity activeOpacity={0.9} onPress={this.navigateDiscount} style={s.coupunCover}>
			     <View style={{width:'70%'}}><Text style={s.coupunTitle}>Apply Coupon</Text></View>
			     <View style={s.coupunIcon}>
			      <Icon name='cvright' color={helper.grey} size={16} />
			     </View>
			    </TouchableOpacity>
			)
		}else{
			return (
				<View style={s.coupunCover}>
				 <View>
				     <Text style={[s.coupunTitle, {color:helper.primaryColor}]}>{discount.title}</Text>
				     <Text style={s.coupunDesc}>{discount.desc}</Text>
			     </View>
			     <Text onPress={this.removeDiscount} style={s.coupunRemove}>Remove</Text>
			    </View>
			)
		}
	}

	renderCharges = (charge, index) => {
		return (
			<>
			 <View style={s.mbhg}>
              <Text style={s.mvhj}>{charge.title}</Text>
              <Text style={s.mvhj}>{lang.rp}{charge.value}</Text>
             </View>             
			</>
		)
	}
	onFCMount(item){		
		if(this.state.cartTemp[item.id] != undefined){			
			this.foodItem[item.id]?.setCartCount(this.state.cartTemp[item.id]);
			if(item.out_stock){
				setTimeout(() => {			
					this.foodItem[item.id]?.setOutStock(true);
				}, 200);
			}else{
				setTimeout(() => {			
					let preData = MyCart.getItem(item.id);			
					let added = [];				
					if(preData && preData.added != undefined && preData?.added?.length > 0){					
						added = preData.added;
					}else{
						return;
					}
					let adons = item.addon;
					let block = false;
					added.forEach(({items}) => {
						block = false;				
						items.forEach(itm => {
						    if(block)return;
							let index = adons.findIndex(({id,data}) => {
								let isPresent = false;						
								if(itm.gid == id){
									isPresent = data.findIndex(it => it.id == itm.id) != -1;
								}
								return isPresent;
							});					
							if(index == -1){
								block = true;
							}
						})				
					});
					if(block){					
						this.foodItem[item.id]?.setAddonOutStock(true);
						return;
					}
				}, 200);
			}					
		}
	}
	handleAdd = (item) => {		    
			let f_ids = this.state.f_ids;
			let foodAmount = this.state.foodAmount + item.price;
			let totalAmount = this.state.totalAmount + item.price			
			this.setState({
					f_ids,
					foodAmount,
					totalAmount
			}, () => {
				let idx = f_ids.findIndex(it => it.id == item.id);
				if(idx == -1){
					f_ids.push({id:item.id,quantity:1});			
				}else{			
				    f_ids[idx].quantity = f_ids[idx].quantity + 1;				
				}				
				this.setState({f_ids}, () => {
					MyCart.add(item);
				});				
			})			
    }
    handleRemove = (item) => {    	    		
	    	let f_ids = this.state.f_ids;
			let idx = f_ids.findIndex(it => it.id == item.id);		
			if(idx != -1){
				let itm = f_ids[idx];			
				if(itm.quantity > 1){
					itm.quantity = itm.quantity - 1;
					f_ids[idx] = itm;
				}else{
					f_ids.splice(idx, 1);
				}
				let foodAmount = this.state.foodAmount - item.price;
				let totalAmount = this.state.totalAmount - item.price;
				this.setState({f_ids,foodAmount,totalAmount}, () => {
					MyCart.remove(item);
				});
			}    
    }
    handleItemRemove = (item) => {    	    		
    	MyCart.removeItem(item, () => {
			this.initialize()
		});
    }
    proceedPay = () => {
        try {
	    	const {address_id,anyreq,altnum,cart,subTotal} = this.state;    	
	    	if(subTotal == 0){
	    		ToastAndroid.show('Please Add Products!', ToastAndroid.SHORT);
	    		return;
	    	}    	
	    	if(address_id == undefined){
	    		this.address.show();
	    		ToastAndroid.show(lang.z[cl].pls +' '+ lang.z[cl].sltad, ToastAndroid.SHORT);
	    		return;
	    	}
			if(altnum != undefined && !request.isBlank(altnum)){
				if(altnum?.length != 10){
					ToastAndroid.show('Invalid Alternate Number!', ToastAndroid.SHORT);
					return;
				}
			}
			this.paymodeModal?.show();
		} catch (e) {
        	alert(e)
        }
    }
    placeOrder = async () => {
    	const {
    		customPraise,delivery,foodAmount,praiseData,
    		currentP,order_id,altnum,totalAmount,discount
		} = this.state;   
		let tip_amt = 0;
		if(currentP != -1)tip_amt = praiseData[currentP];
		else if(customPraise != 0)tip_amt = customPraise;
		this.setState({ordering:true});
		Parse.Cloud.run("createOrderTask", {
			user_id,
			tip_amt,
			altnum,
			useWallet:this.state.useWallet,
			address_id:this.state.address_id,
			pay_mode:delivery ? COD : ONLINE_PAY,
			total_amt:totalAmount,
			discount_id:discount == false ? undefined : discount.id
		}).then(({status, data}) => {
			this.setState({ordering:false});
			if(status == 200){
				if(delivery){
			    	this.prepareSuccess(data.coins);
			    }else{				    	
			    	this.setState({
						order_id:data.razor_order_id
					}, () => {
						this.processPayment(data.coins);
					});
			    }
			}else{
				this.loadCart();
			}
		}).catch(err => {
			this.setState({ordering:false});
			ToastAndroid.show("Please Try Again", ToastAndroid.SHORT);
		})
	}
	processPayment = (coins) => {		
		if(this.state.order_id == null)return;
		var options = {		    
		    image: 'https://gcdnb.pbrd.co/images/19pKEMRbiZ4x.png?o=1',
		    currency: 'INR',
		    key: helper.payConfig.key,
		    amount: this.state.totalAmount * 100,
		    name:'Fresh Line',
		    description:'Making Lives Easier & Happier',
		    order_id:this.state.order_id,		    
		    theme: {color:'#000000'},
		    prefill: {'contact': '8888888888', 'email':'customer@freshline.com'},
		    readonly: { 'email': true, 'contact': true },
		    external:{
		        'wallets': ['paytm']
		    }
		}		
		RazorpayCheckout.open(options).then((data) => {			
		  	this.handleCB(true, coins)
		}).catch((err) => {
		    this.handleCB(false)
		});	    
	}

	handleCB = async (success, coins) => {    	
		if(success == false){
			ToastAndroid.show("Payment Failed!", ToastAndroid.SHORT);
			return;
		}
    	this.setState({ordering:true});
    	Parse.Cloud.run("paymentStatus", {
			success,
			order_id:this.state.order_id
		}).then(res => {
			this.setState({ordering:false})
			if(res == true){
				this.prepareSuccess(coins);
			}else{
				this.errorHandle();
			}
		}).catch(err => {
			this.setState({ordering:false}, this.errorHandle)
		});
	}

	errorHandle = () => {
		this.props.navigation.dispatch(
	        CommonActions.reset({
	          index: 1,
	          routes: [
	            { name: 'HomeActivity' },
	            //{ name: 'History', params:{issuer:helper.ORDERS}}
	          ]
	        })
	    );		
	}

	prepareSuccess = (coins) => {
		let {cart, currentP, surgeCharge, totalAmount, praiseData, customPraise, charges, discount, walletAmount} = this.state;
		let entities = [];		
		let d_praise = 0;
		if(currentP != -1)d_praise = praiseData[currentP];
		else if(customPraise != 0)d_praise = customPraise;
		let title = 'Fresh Line Order';
		let time = moment().format('DD-MM-YYYY HH:MM A');		
		cart.forEach(item => {
			entities.push({title:item.name,quantity:item.odr_qty,total:(item.mrp * item.odr_qty),amount:item.mrp})
		})
		if(d_praise != 0){
			entities.push({title: 'Tip 🙏',quantity: 1,total:d_praise,amount:d_praise});
		}
		if(walletAmount != undefined){
			entities.push({title:'Wallet -',quantity: 1,total:walletAmount,amount:walletAmount});
		}
		if(discount){
			entities.push({title:'Discount -',quantity: 1,total:discount.amount,amount:discount.amount});
		}
		charges.forEach(charge => {
			entities.push({title:charge.title,quantity: 1,total:charge.value,amount:charge.value});
		});
	    this.successModal.show(coins, () => {
			this.props.navigation.navigate('Invoice', {title2:title,totalAmount,entities,title,time,navPage:'Orders'});
		});	
	}
}

class CashOrder extends Component {
	constructor(props){
		super(props)
		this.state = {
			v:false
		}
	}
	c = () => {
		this.setState({v:false})
	}
	d = () => {
	   this.setState({v:false}, () => {
	   	this.props.onSuccess()
	   })	
	}
	show = () => {
		this.setState({v:true})
	}
	render(){
		return (
			<Modal visible={this.state.v} onRequestClose={this.c} transparent animationType="fade"><View style={helper.model}><View style={{width:250,padding:10,backgroundColor:helper.white,borderRadius:10,elevation:10,justifyContent:'center',alignItems:'center'}}>
			  <Text style={{fontSize:20,color:helper.primaryColor,fontWeight:'bold',marginVertical:10}}>Ordering In</Text>
			  <View style={{width:180,height:180}}><CountdownCircleTimer
		        isPlaying
		        duration={5}
		        trailColor={helper.faintColor}
		        colors={[		        			        			      
		        	[helper.secondaryColor, 0.3],
		        	[helper.primaryColor, 0.7]
			    ]}
		        onComplete={this.d}
		      >
		        {({ remainingTime, animatedColor }) => (
		          <Animated1.Text
		            style={{ fontSize:46, color: animatedColor }}>
		            {remainingTime}
		          </Animated1.Text>
		        )}
		      </CountdownCircleTimer></View>
		      <Button
		       text={'Cancel'}
		       size={16}
		       br={30}		       
		       onPress={this.c}
		       hr={20}		       
		       style={{marginVertical:8,width:150}}
		      />
			</View></View></Modal>
		)
	}
}

class PayModeModal extends Component {
	constructor(props){
		super(props)
		this.state = {
			v:false
		}
	}
	cls = () => {
		this.setState({v:false})
	}
	show = () => {
		this.setState({v:true})		
	}
	pay = (mode = 0) => {
		this.setState({v:false}, () => {
			if(mode == 1){
				this.props.cashOn(true);
			}else{
				this.props.cashOn(false);
			}
		})
	}
	render(){
		const disableCod = !this.props.hasCod;
		return (
			<Modal visible={this.state.v} animationType="fade" transparent onRequestClose={this.cls}>
			 <View style={helper.model}>
			  
			  <View style={s.pymc}>
			   <Text style={s.pytm}>Select Payment Mode</Text>			    

			   <TouchableNativeFeedback onPress={this.pay}><View style={s.nvcd}>			    
			    <View style={s.nblk}>
			     <Icon name={'onlpay'} color={helper.blk} size={30} />
			    </View>
			    <View>
				    <Text style={s.pha}>Pay Online</Text>
				    <Text style={s.nvhm}>Avoid Touch By Paying Online..</Text>
			    </View>
			   </View></TouchableNativeFeedback>

			   <TouchableNativeFeedback disabled={disableCod} onPress={() => this.pay(1)}><View style={[s.nvb, {opacity:disableCod ? 0.5 : 1}]}>			    
			    <View style={s.nblk}>
			     <Icon name={lang.onl} color={helper.blk} size={30} />
			    </View>
			    <View>
				    <Text style={s.pha}>Cash On Delivery</Text>
				    <Text style={s.nvhm}>Pay With Cash..</Text>
			    </View>
			   </View></TouchableNativeFeedback>

			  </View>

			 </View>
			</Modal>
		)
	}
}

const s = StyleSheet.create({
	sitTitle:{fontSize:23,width:'100%',color:helper.blk,fontWeight:'bold',marginTop:16,textAlign:'center'},
	sitDesc:{fontSize:16,width:'100%',color:helper.blk,textAlign:'center',marginTop:10},
	main:{
		height:'100%',
		width:'100%',
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:helper.homeBgColor
	},
	coupunCover:{
		width:'95%',
		padding:10,
		borderRadius:12,
		borderWidth:1,
		borderColor:helper.primaryColor,
		backgroundColor:helper.white,
		elevation:10,
		justifyContent:'space-between',
		flexDirection:'row',
		alignSelf:'center',
		alignItems:'center',
		marginTop:15
	},
	coupunTitle : {
		fontSize:16,
		width:'100%',
		fontFamily:'sans-serif-medium',
		color:helper.blk
	},
	coupunRemove : {
		fontSize:14,
		color:helper.primaryColor
	},
	coupunDesc : {
		fontSize:13,
		width:'100%',
		color:helper.grey
	},
	coupunIcon : {
		width:40,
		height:40,
		justifyContent:'center',
		alignItems:'center'
	},
	billCover:{width:'95%',marginBottom:39,elevation:10,borderRadius:10,alignSelf:'center',backgroundColor:helper.bgColor,marginVertical:15,paddingBottom:15},
	hldr:{
		backgroundColor:helper.homeBgColor,
		height:'100%',
		width:'100%'
	},
	pha:{fontSize:15,fontFamily:'sans-serif-medium',color:helper.blk},
	nvhm:{fontSize:13,fontFamily:'sans-serif-ligh',color:helper.grey},
	nblk:{width:50,height:40,justifyContent:'center',alignItems:'center'},
	nvb:{width:'100%',height:50,flexDirection:'row',marginTop:5},
	nvcd:{width:'100%',height:50,flexDirection:'row',borderBottomWidth:0.5,borderColor:helper.borderColor},
	cd:{marginLeft:5,marginTop:5,fontSize:13,fontWeight:'bold',color:helper.silver},
	seprator:{
		backgroundColor:helper.bgColor,
		width:'100%',
		height:34
	},
	mbhg:{flexDirection:'row',justifyContent:'space-between',width:'94%',alignSelf:'center',marginBottom:5},
	sep2:{
		justifyContent:'center',
		alignContent:'center',
		width:'100%',
		height:34,
		backgroundColor:helper.bgColor
	},
	pytm:{fontSize:17,color:helper.primaryColor,marginBottom:10},
	axf:{backgroundColor:'#1515156b',width:'100%',height:200,justifyContent:'center',alignItems:'center'},
	axf2:{backgroundColor:'#1515156b',width:'100%',height:60,justifyContent:'center',alignItems:'center',marginBottom:10},
	soly:{position:'absolute',justifyContent:'center',alignItems:'center',width:'100%',height:'100%',backgroundColor:helper.grey4,left:0},
	inpt:{
		fontSize:16,
		padding:0,
		fontWeight:'bold',		
		justifyContent: 'center',
		borderWidth:1,
		borderColor:helper.primaryColor,
		borderRadius:5,
		height:25,
		margin:10,
		width:80,
		paddingHorizontal:10
	},
	coupunDesc:{
		fontSize:14,
		color:helper.grey
	},
	spt:{
		justifyContent:'center',
		height:30
	},	
	st:{
		justifyContent:'center',
		height:30,
		position:'absolute',
		right:0
	},
	wsn:{fontSize:15,color:helper.blk,fontFamily:'sans-serif-medium'},
	pymc:{width:270,padding:10,borderRadius:10,elevation:10,backgroundColor:helper.bgColor},
	sot:{fontSize:18,fontWeight:'bold',color:helper.silver},
	sot2:{fontSize:13,color:helper.silver,textAlign:'center',width:'90%',marginBottom:7},
	stxt:{
		fontSize:15,
		fontFamily:'sans-serif-medium',
		color:helper.silver,
		marginHorizontal:5
	},
	vb:{fontWeight:'bold',color:helper.silver,fontSize:14},
	footer:{
		height:60,
		flexDirection:'row',
		width:'100%',
		justifyContent:'space-around'
	},
	prcntr:{
		marginTop:15,		
		paddingVertical:10,
		width:'95%',
		alignSelf:'center',
		elevation:10,
		borderRadius:10,
		backgroundColor:helper.bgColor
	},
	prtt:{
		fontSize:14,
		marginVertical:5,
		marginLeft:10,
		color:helper.blk
	},
	footerSty:{width:'97%',height:50,backgroundColor:helper.primaryColor,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10,borderRadius:10, alignSelf:'center',elevation:10},
	nvgl:{fontSize:13,color:helper.grey,fontFamily:'sans-serif-light'},
	vnu:{justifyContent:'space-between',width:'94%',alignSelf:'center',marginBottom:5},
	mvhj:{fontSize:14,color:helper.blk,fontFamily:'sans-serif-light'},
	ithd:{width:'100%',backgroundColor:helper.bgColor,alignItems:'center'},
	lct:{height:60,width:'100%',justifyContent:'center',alignItems:'center'},
	prdsc:{color:helper.grey,fontSize:11,marginHorizontal:10},
	fItm:{justifyContent:'center',alignItems:'center',backgroundColor:helper.grey4},
	tz:{justifyContent:'center',alignItems:'center',width:'20%'},
	tbc:{width:'33%',justifyContent:'center',paddingVertical:10,alignItems:'center',borderWidth:1,borderColor:helper.borderColor,borderRadius:7},
	clhj:{elevation:10,flexDirection:'row',height:55,backgroundColor:helper.bgColor,width:'95%',alignSelf:'center',borderRadius:10},
	ptrc:{width:30,height:55,justifyContent:'center',alignItems:'center'},
	ybb:{width:'80%',height:55,fontSize:14,color:helper.silver,fontFamily:'sans-serif-light'}
})