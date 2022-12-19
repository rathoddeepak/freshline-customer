import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,	
	StyleSheet,
	FlatList,
	ToastAndroid,
	TouchableOpacity
} from 'react-native';
import {
	SlotRangePicker,
	FoodCardSmall,
	LoadingModal,
	SuccessModal,
	CatProvider,	
	RazorView,
	HeuButton,
	Loading,	
	Empty,
	Icon,
	Err,
} from 'components';
import RazorpayCheckout from 'react-native-razorpay';
import BottomSheet from 'reanimated-bottom-sheet';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
import {CommonActions} from '@react-navigation/native';
const itemSize = helper.width/3.5;
const itemSize2 = helper.width/4.5;
const dcH = helper.height - 185;
const hp = itemSize2/2;
export default class FinalizeTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			s_plates:[],
			s_customs:[],
			slots:[],
			stblC:3,
			id:5,
			loading:false,
			error:false,
			taxAmt:0,
			taxes:[],
			hasTax:false,
			catData:[],
			catLoad:false,
			currentSection:0,
			categories:[],
		}
		this.foodItem = [];
	}
	componentDidMount() {
		let {selectNumber, id} = this.props.route.params;
		this.setState({stblC:selectNumber,id}, this.loadVendorMeta);				
	}	
	handleAdd = (item) => this.paymentSheet.updatePlate(item);	
	handleRemove = (item) => this.paymentSheet.updatePlate(item, false);
	loadVendorMeta = async () => {	    
		this.setState({loading: true,error:false})		
		var res = await request.perform('vendor2', {
			req:'vr_meta3',			
			user_id:0,
			fdtype:JSON.stringify([helper.FD_BOTH, helper.FD_ONLYMNU]),
			id:this.state.id
		});		
		if(typeof res === 'object' && res?.status == 200){			 
			this.setState({
				taxPercent:res.data.tax_percent,
				taxes:res.data.taxes,
				hasTax:res.data.taxes.length > 0,
				categories:res.data.categories,
				slots:res.data.slotData.slots,
				loading:false
			}, () => {
				if(this.state.categories.length > 0){
					this.handleCatPress(0)
				}				
			});
		} else {
			this.setState({error:true});
		}
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
		}else if(!loading && !error && this.state.categories.length === 0){
			return (
				<Empty />
			);
		}else{
			return (<View></View>)
		}
	}
	newSlots = (slots) => {
		this.setState({slots});
	}
	handleCatPress = (index) => {            	
    	this.setState({catLoad:true});
    	setTimeout(() => {
    		let catData = this.state.categories[index].data;		
	    	this.setState({catData,catLoad:false});
    	})    	
    }
    onItemMount = (item) => {
    	let count = this.paymentSheet?.getCount(item.id);
    	if(count){
    		this.foodItem[item.id]?.setCartCount(count);
    	}
    }
    renderHeader = () => {
    	if(this.state.catLoad){
    		return (
    			<View style={{width:'100%',height:5,justifyContent:'center',alignItems:'center'}}>
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
	navBack = () => {
		this.props.navigation.goBack();
	}
	render(){
		const {
		  error,
		  loading,
		  categories,
		  catData,		  
		  currentSection,
		  hasTax,
		  taxAmt,
		  taxes
		} = this.state;
		const color = !loading && !error && categories.length > 0 ? helper.grey4 : "transparent";
		return (
			<View style={s.hldr}>
			 
			 <View style={s.header}>
			  <TouchableOpacity onPress={this.navBack} style={s.hicn}>
			   <Icon name={lang.arwbck} color={helper.white} size={24} />
			  </TouchableOpacity> 
			   <Text style={s.htxt}>{lang.z[cl].fnltbl}</Text>			  
			 </View>			 			 	     		

		     <View style={s.fdhldr}>
				       <Text style={s.ftt}>{lang.z[cl].aladsmfd}   <Text style={s.dd}>{lang.z[cl].nmwa}......</Text></Text>					
					   {this.renderDizzer()}
					   <View style={{flexDirection: 'row',flex:1}}>
					       <View style={{width:'30%',backgroundColor:color}}>
					        <CatProvider data={categories} ref={ref => (this.catProvider = ref)} current={currentSection} onPress={this.handleCatPress} />
					       </View>
						   <FlatList
						      data={catData}			      
						      keyExtractor={(item) => item.id}
						      ref={ref => this.sections = ref}
						      showsVerticalScrollIndicator={false}
						      ListHeaderComponent={this.renderHeader}
						      ListFooterComponent={this.renderFooter}
						      contentContainerStyle={{backgroundColor:helper.grey2}}
						      renderItem={({ item }) =>				      
							      <FoodCardSmall 
							       ref={ref => this.foodItem[item.id] = ref}
							       onAdd={() => this.handleAdd(item)}
								   menuPrice
								   onMount={() => this.onItemMount(item)}		       
							       onRemove={() => this.handleRemove(item)}
							       hasRating={false}
							       imgSize={50}
							       data={item}					       
							      />					      
						      }						      
						    />						
					    </View>	
						{hasTax ? <View style={{width:'100%',backgroundColor:helper.grey4,padding:10}}>
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
			  <BottomSheet		        
		        snapPoints={[140, dcH]}
		        borderRadius={10}		        
		        renderContent={this.renderSheet}
		        ref={ref => this.bottomSheet = ref}		        
		      />
			</View>
		)
	}
	onDonePressO = () => {		
		this.bottomSheet.snapTo(1);
	}
	setTaxAmt = (taxAmt) => this.setState({taxAmt})
	renderSheet = () => {
		const {
			taxPercent,
			s_plates,
			s_customs,	
			stblC,
			slots,
			id
		} = this.state;
		return (
			<PaymentSheet
		     ref={ref => this.paymentSheet = ref}
			 plates={s_plates}
			 customs={s_customs}
			 id={id}
			 slots={slots}
			 taxPercent={taxPercent}
			 onDonePress={this.onDonePressO}
			 onTaxGot={this.setTaxAmt}
			 onNewSlots={this.newSlots}
			 tableCount={stblC}
			 {...this.props}
			/>
		)
	}
}

class PaymentSheet extends Component {
	constructor(props){
		super(props)
		this.state = {
			busy:false,
			plateCount:0,
			plateCharge:0,			
			tableCharge:20,
			totalCharge:'20.0',
			timeString:false,
			fromTime:0,
			toTime:0,
			items:[],
			from_slt:-1,
			to_slt:-1
		}
	}
	/*updateCustom(customs){
		let customCharge = 0;				
		customs.forEach(custom => customCharge += custom.cost)		
		let totalCharge = (this.state.plateCharge + customCharge);
		if(totalCharge.length == 1)totalCharge = totalCharge + '.00';
		if(totalCharge.length == 2)totalCharge = totalCharge + '.0';
		if(totalCharge.length == 3)totalCharge = totalCharge;
		this.setState({
			customCount:customs.count,customCharge,tableCharge
		});
	}*/
	updatePlate(plate, flag = true){	    
		let {plateCharge, items} = this.state;				
		const {taxPercent} = this.props;
		let tax = 0;		
		plateCharge = plateCharge + 20; // Adding For Table Booking Brain Not Working
		let plateCount = this.state.plateCount;		
		let totalCharge = flag ? plateCharge + plate.menu_price : plateCharge - plate.menu_price;
		plateCount = flag ? plateCount + 1 : plateCount - 1;
		plateCharge = totalCharge;
		plateCharge -= 20;
		if(taxPercent > 0){
			tax = Math.ceil((plateCharge * taxPercent) / 100);		
			setTimeout(() => this.props.onTaxGot(tax), 300);
		}
		totalCharge += tax;
		if(totalCharge < 9)totalCharge = totalCharge + '.00';
		if(totalCharge < 99)totalCharge = totalCharge + '.0';
		if(totalCharge < 999)totalCharge = totalCharge;		
		let itemIndex = items.findIndex(x => x.id === plate.id);
		if(itemIndex == -1){
			items.push({id:plate.id,quantity:1});
		}else{
			items[itemIndex].quantity = flag ? items[itemIndex].quantity + 1 : items[itemIndex].quantity -1;
			if(items[itemIndex].quantity == 0){
				items.splice(itemIndex, 1);
			}
		}
		this.setState({plateCount,plateCharge,totalCharge,items});
	}
	getCount = (id) => {
		let item = this.state.items.find(x => x.id === id);
		if(item != undefined){
			return item.quantity;
		}else{
			return false;
		}
	}
	handleTBT = () => {
		const {from_slt,to_slt} = this.state;
		let data = {slots:this.props.slots,from_slt,to_slt};
		this.slotRangePicker.show(data, ({timeString,to_slt,from_slt,to_time,from_time}) => {
			this.setState({from_time,to_time,from_slt,to_slt,timeString})
		});
	}
	placeOrder = async () => {		
    	let {
    		totalCharge,
    		from_slt,
    		to_slt,
    		from_time,
    		to_time,
    		items
		} = this.state;
		const {
			tableCount,
			id
		} = this.props;	
		if(from_slt == -1 || to_slt == -1){
			ToastAndroid.show(lang.z[cl].pst, ToastAndroid.SHORT);
			return;
		}
    	this.setState({busy:true});
    	totalCharge = parseInt(totalCharge);
		var res = await request.perform('booking', {
			user_id,
	        vendor_id:id,
	        people:tableCount,
	        from_slt,
			to_slt,
			from_time,
			to_time,
	        items:JSON.stringify(items),
	        amount:totalCharge
        });
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){			
			if(res?.data?.full == true){
				this.props.onNewSlots(res.data.sl.slots);
				ToastAndroid.show('Slot Full, Try Another Slot!', ToastAndroid.SHORT);
			}else{
				this.runTransaction(res.data.order_id, totalCharge, res.data.token);
			}			
		}else{
			ToastAndroid.show('Please Try Again!', ToastAndroid.SHORT);
		}
	}		 
    runTransaction(orderId, amount, txnToken) {    	 
    	 const key = helper.payConfig.key;
		 var options = {		    
		    image:'https://i.ibb.co/1RwZ0k2/Clufter-Logo-Chef-Gold.png',
		    currency:'INR',		    
		    amount:parseInt(amount) * 100,
		    name:'Clufter',
		    description:'An Innovative Food Delivery App',
		    theme:{color: "#000000"},
		    order_id:txnToken,
		    key
		  }
		  RazorpayCheckout.open(options).then((data) => {
		  	this.handleCB(orderId, 'paid');
		  }).catch((error) => {
		  	this.handleCB(orderId, 'failed');
		    ToastAndroid.show(lang.z[cl].pmfl, ToastAndroid.SHORT);
		  });
    }

    handleCB = async (order_id, status) => {    	
    	this.setState({busy:true});    	
		var res = await request.perform('payment', {
			status,
	        order_id,
	        req:'pysu'
        });
        if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){			
			if(status == 'paid'){
				this.successModal.show();
			  	setTimeout(() => {
			  		this.successModal.close(true);
			  		this.props.navigation.dispatch(
				        CommonActions.reset({
				          index: 1,
				          routes: [
				            { name: 'HomeActivity' },
				            { name: 'Updates' }
				          ]
				        })
				    );
			  	}, 2000);
			}		
		}else{
			this.props.navigation.dispatch(
		        CommonActions.reset({
		          index: 1,
		          routes: [
		            { name: 'HomeActivity' },
		            { name: 'History', params:{issuer:helper.BOOKINGS}}
		          ]
		        })
		    );
		}
	}

	render() {	
		const {
			timeString,
			plateCount,
			plateCharge,			
			tableCharge,
			totalCharge,
			busy			
		} = this.state;
		const {
			tableCount,
			onDonePress
		} = this.props;
		return (
			<View
		      style={{
		        backgroundColor: helper.grey6,		        
		        height: dcH,
		      }}
		    >
		      <View style={s.ttCon}>
	             <View style={[s.itm2, {marginLeft:10}]}>
	              <Icon name={lang.table} color={helper.primaryColor} size={hp} />
	              <View style={s.topCr}>
				   <Text style={s.tCtxt}>{tableCount}</Text>
				  </View>
				  <Text style={s.btmChp}>{tableCharge}</Text>
	             </View>
	             <Text style={s.sp}>+</Text>

				 <View style={s.itm2}>
				  <Icon name={lang.plate} color={helper.primaryColor} size={hp} />
				  <View style={s.topCr}>
				   <Text style={s.tCtxt}>{plateCount}</Text>
				  </View>
				  <Text style={s.btmChp}>{plateCharge}</Text>
				 </View>
				 
				 <Text style={s.sp}>=</Text>
				 <View>
					 <HeuButton onPress={onDonePress}>
					  <Text style={s.dn}>{lang.z[cl].dn1}</Text>
					 </HeuButton>
					 <Text style={s.dnTxt}>{totalCharge}</Text>
				 </View>
		      </View>

		      <Text style={s.prtt}>{lang.z[cl].sltTm}</Text>
		      <View style={s.axf2}>
		       {timeString ? <Text numberOfLines={1} onPress={this.handleTBT} style={{fontSize:18,fontWeight:'bold',color:helper.silver}}>{timeString}</Text>:
		       <Text numberOfLines={1} onPress={this.handleTBT} style={{fontSize:15,fontWeight:'bold',color:helper.white,paddingVertical:7,paddingHorizontal:10,backgroundColor:helper.primaryColor,borderRadius:20}}>{lang.z[cl].sltr}</Text>}
		      </View>
		      <Text style={s.prtt}>{lang.z[cl].pynw}</Text>		      
			  <RazorView
				 cost={totalCharge}
				 onPress={this.placeOrder}
		      />
		      <SlotRangePicker ref={ref => this.slotRangePicker = ref}/>
		      <LoadingModal visible={busy} />
		      <SuccessModal ref={ref => this.successModal = ref} cancel={false}/>
		    </View>
		)
	}
}
const s = StyleSheet.create({
	btmChp:{width:50,borderRadius:50,backgroundColor:helper.primaryColor,textAlign:'center',paddingVertical:2,paddingHorizontal:5,fontSize:11,fontWeight:'bold',color:'#fff',position:"absolute",bottom:-10,left:'20%',elevation:10},
	topCr:{borderRadius:100,backgroundColor:helper.primaryColor,width:25,height:25,position:"absolute",top:-10,right:-4,elevation:10,justifyContent:'center'},
	tCtxt:{textAlign:'center',fontSize:11,fontWeight:'bold',color:'#fff'},
	dnTxt:{maxWidth:50,borderRadius:50,backgroundColor:helper.silver,textAlign:'center',paddingVertical:2,paddingHorizontal:5,fontSize:11,color:'black',position:"absolute",top:-10,left:0,elevation:10},
	dn:{borderRadius:50,backgroundColor:helper.primaryColor,textAlign:'center',padding:10,fontSize:12,fontWeight:'bold',color:'white',elevation:10,marginRight:30},
	ttCon:{flexDirection:'row',alignItems:'center',height:140,justifyContent:'space-around',alignSelf:'center',width:360},
	cd:{marginLeft:5,marginTop:5,fontSize:13,fontWeight:'bold',color:helper.silver},
	hldr:{height: '100%',width: '100%',backgroundColor:'#000'},
	header:{height:50,width:'100%',flexDirection:'row',alignItems:'center'},
	axf2:{backgroundColor:'#1515156b',width:'100%',height:60,justifyContent:'center',alignItems:'center',marginBottom:10},
	hicn:{width:50,height:50,justifyContent:'center',alignItems:'center'},
	htxt:{fontSize:18,color:helper.white,fontWeight:'bold'},
	fdhldr:{height:dcH,width:'100%'},
	ftt:{fontSize:14,marginBottom:10,marginLeft:5,fontWeight:'bold',color:helper.white},
	dd:{fontSize:12,color:helper.white,fontWeight:'200'},
	itm:{width:itemSize,marginVertical:5,height:itemSize,backgroundColor:helper.grey2,borderRadius:8},
	sep:{marginVertical:9,marginLeft:5,fontSize:14,color:helper.silver},
	prtt:{
		fontSize:14,
		fontWeight:'bold',		
		marginBottom:10,
		marginLeft:12,
		color:helper.silver
	},
	itm2:{
     width:itemSize2,	 
	 height:itemSize2,
	 borderWidth:2,
	 borderColor:helper.primaryColor,
	 backgroundColor:helper.grey4,
	 borderRadius:8,
	 elevation:10,
	 justifyContent:'center',
	 alignItems:'center'
	},
	zp:{flexDirection:'row',marginVertical:4},	
	zp:{flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap',marginVertical:10},
	sp:{color:'#fff',fontSize:16,marginHorizontal:4,fontWeight:'bold'}
});