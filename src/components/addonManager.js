import React, {Component} from 'react';
import {
	Modal,
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	ScrollView,
	TouchableNativeFeedback,
	ActivityIndicator,
	ToastAndroid
} from 'react-native';
import Image from 'components/image';
import helper from 'assets/helper';
import lang from 'assets/lang';
import MyCart from 'libs/mycart';
import {View as AniView} from 'react-native-animatable';
export default class AddonManager extends Component {
	constructor(props){
		super(props)
		this.state = {
			 v:false,
			 item:{
			 	name:'',
			 	image:'',
			 	hash:'',
			 	price:10
			 },
			 totalCount:0,
			 totalAmount:0,
			 added:[],
			 adons:[]
		}
		this.group = [];
		this.badge = [];	
	}

	close = () => {
		MyCart.unmount();
		this.setState({v:false,totalCount:0,totalAmount:0,added:[],adons:[],busy:false})
	}

	show = (item) => {
		this.setState({busy:true,v:true}, () => {
			MyCart.init(() => {
				let notReset = MyCart.shouldNotReset(item, c => {
					if(c){
						this.continue(item);
					}else{
						this.close()
					}
				});
			}, this.props.hotelChange, this.props.recount);		
		});			
	}

	continue = (item) => {
		setTimeout(() => {			
			let preData = MyCart.getItem(item.id);			
			let added = [];
			let totalCount = 0;
			let totalAmount = 0;
			if(preData){
				totalCount = preData.cartCount;
				totalAmount = preData.total;
				added = preData.added;
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
			for (var i = 0; i < adons.length; i++) {
				if(adons[i].req == 1){					
					adons[i].selected = adons[i].data[0].id;
				}else{
					adons[i].selected = [];
				}
			}
			if(block){
				MyCart.itemReset(item, c => {
					if(c){
						this.setState({item,adons,added:[],totalCount:0,totalAmount:0,busy:false})
					}else{
						this.close()
					}
				})
				return;
			}		
			this.setState({item,adons,added,totalCount,totalAmount,busy:false}, () => {
				if(added.length > 0){
					this.hdlAdSlt(added[0], 0)				
				}
			})
		}, 200);
	}
	
	handleDone = () => {
		const {item,added,totalCount,totalAmount} = this.state;
		if(added.length == 0){
			ToastAndroid.show('Please Add Atleast 1 Quantity', ToastAndroid.SHORT);
			return
		}
		this.setState({busy:true})		
		item.added = added;
		MyCart.actViaAddon(item, totalCount, totalAmount);
		setTimeout(() => {
			this.close()
			this.props.onDone({id:item.id,count:totalCount});
		}, 200);
	}

	handleStep = (shouldAdd = true) => {
		let {added,adons,totalCount,totalAmount} = this.state;
		this.setState({busy:true}, () => {
			setTimeout(() => {
				this.setState({busy:false})
			}, 250)
		})
		let currentState = [];
		let hasAdded = false;
		let length = 0;
		let counter = 0;
		let block = false;		
		adons.forEach(an => currentState.push(an.selected));
		currentState.forEach(c => {		    
			if(Array.isArray(c))length += c.length;
			else length += 1;		
		})		
		added.forEach(add => {
			if(block)return;
			if(add.items.length == length){
				let blk = false;
				if(add.items.length == 0){
					hasAdded = true;
					blk = true;
				}				
				add.items.forEach(adItem => {
					if(blk)return;
					hasAdded = currentState.findIndex(current => {						
						if(Array.isArray(current)){							
							return current.indexOf(adItem.id) != -1;
						}else{							
							return current == adItem.id;
						}
					});					
					hasAdded = hasAdded != -1;
					if(!hasAdded)blk = true;
				})		
			}else{
				hasAdded = false;
			}
			if(hasAdded){				
				if(shouldAdd){
					totalCount++;
					totalAmount += added[counter].total;
					added[counter].qty += 1;					
				}else{
					totalCount--;
					added[counter].qty -= 1;
					totalAmount -= added[counter].total;
				}
				let qty = added[counter].qty;				
				if(qty == 0){					
					added.splice(counter, 1);
				}
				const cBf = counter;
				block = true;
				this.setState({added,totalCount,totalAmount,sltIdx:cBf}, () => {					
					this?.groupList?.scrollToOffset({offset:cBf * 155,animated:true});
					this?.stepper?.setVal(qty);
					this?.badge[cBf]?.tada();
				});
			}
			counter++;
		});		
		if(!hasAdded && shouldAdd){
			totalCount++;
			let amount = 0;
			let data = {
				total:20,
			  	qty:1,
			  	items:[]
			};
			adons.forEach(an => {
				if(an.req == 1){
					let itm = an.data.find(dta => dta.id == an.selected);
					amount += itm.cost;
					data.items.push(itm);
				}else{
					an.selected.forEach(i => {
						let itm = an.data.find(dta => dta.id == i);
						amount += itm.cost;
						data.items.push(itm);
					});				
				}
			});			
			data.total = amount + this.state.item.price;
			totalAmount += data.total;			
			added.push(data)
			this.setState({added,totalCount,totalAmount,sltIdx:(added.length - 1)}, () => {
				setTimeout(() => {
					this?.groupList?.scrollToOffset({offset:added.length * 155,animated:true});		
				}, 100)
				this?.stepper?.setVal(1);
				this?.badge[added.length]?.rubberBand();
			})
		}
	}
	hdlAdSlt = (add, sltIdx = -1) => {
		const {adons} = this.state;
		adons.forEach(({id}) => {			
			this.group[id]?.dispatch(add.items);
		})
		this.setState({sltIdx})
		this.stepper?.setVal(add.qty);
	}
	render(){
		const {
			v,
			adons,
			busy,
			totalCount,
			totalAmount,
			item
		} = this.state;
		return (
			<Modal visible={v} onRequestClose={this.close} transparent animationType="fade">
			 <View style={s.m}>
			   <View style={s.b}>
			    <FlatList
			      data={adons}
			      ListHeaderComponent={this.headerComponent}
			      keyExtractor={(item, index) => item.id}
		          renderItem={this.renderItem}
		          stickyHeaderIndices={[0]}
			    />		
			    <View style={s.mhk}>
				    <Text numberOfLines={1} style={{width:'100%',fontFamily:'sans-serif-light',fontSize:13,color:helper.primaryColor}}>Please Select Quantity From Here Then Press Done</Text>				    
				</View>
			    <View style={s.fv}>
			      <Stepper onAdd={this.handleStep} onRemove={() => this.handleStep(false)} ref={ref => this.stepper = ref} />
			      <TouchableNativeFeedback onPress={this.handleDone}><View style={{height:50,width:'40%',marginRight:10,justifyContent:'center',alignItems:'center',backgroundColor:helper.primaryColor,borderRadius:8}}>
			       <Text style={{fontSize:20,fontWeight:'bold',color:helper.white}}>Done</Text>
			      </View></TouchableNativeFeedback>
			    </View>
			    
			    {busy ? <View style={[helper.main4, {backgroundColor:'#00000051'}]}>
			     <ActivityIndicator color={helper.primaryColor} size={40} />
			    </View> : null}

			   </View>
			 </View>
			</Modal>
		)
	}
	headerComponent = () => {
		const {item,added,totalAmount,totalCount,sltIdx} = this.state;
		if(added.length > 0){
			return (
				<>
				<View style={s.il}>
				  <FlatList
				   horizontal
				   data={added}
				   ref={ref => this.groupList = ref}
				   keyExtractor={(item, index) => index.toString()}			   
				   renderItem={({item, index}) => {
				   	    const borderWidth = index == sltIdx ? 1.2 : 0;
					   	return (
					   		<TouchableNativeFeedback onPress={() => this.hdlAdSlt(item, index)}><View style={[s.dc, {borderWidth}]}>
					   		<Text numberOfLines={1} style={s.fz}>{this.state.item.name}</Text>
					   		<ScrollView>
					   		 <Text style={s.dtx}>{item.items.map((dta) => dta.name + ', ')}</Text>
					   		 </ScrollView>					   		 
					   		 <View style={{width:'100%',backgroundColor:helper.primaryColor,borderRadius:10}}>
					   		  <Text style={{fontSize:10,fontWeight:'bold',color:'#000',textAlign:'center'}}>SELECT</Text>
					   		 </View>
					   		 <AniView style={s.bdg} ref={ref => this.badge[index] = ref}>
					   		  <Text	style={s.bjz}>{item.qty}</Text>
					   		 </AniView>					   		 
					   		</View></TouchableNativeFeedback>
					   	)
				   }}
				  />				  
				</View>
				 <View style={[s.mhk, {borderBottomWidth:0.3,paddingBottom:5,backgroundColor:helper.grey4,borderColor:helper.grey2}]}>
				    <Text numberOfLines={1} style={s.tcb}>{totalCount} x {item.name}</Text>
				    <Text style={s.cgq}>{lang.rp}{totalAmount}</Text>
				 </View>				 
				</>
			)
		}else{
			return (
				<>
				<View style={s.is}>
				  <Image
				    sty={s.im}
				    imgSty={{width:'100%',height:'100%'}}
				    borderRadius={8}
				    hash={item.hash}
				    source={{uri:helper.site_url + item.image}}
				  />
				  <View>
					  <Text numberOfLines={2} style={s.cz}>{item.name}</Text>
					  <Text numberOfLines={1} style={s.ch}>{lang.rp}{item.price}</Text>
				  </View>				  
				</View>
				<View style={[s.mhk, {borderBottomWidth:0.3,paddingBottom:5,borderColor:helper.grey2}]}>
				    <Text numberOfLines={1} style={s.tcb}>{totalCount} x {item.name}</Text>
				    <Text style={s.cgq}>{lang.rp}{totalAmount}</Text>
				</View>				
				</>
			)
		}		
	}
	handleSelect = (id, index) => {
		let adons = this.state.adons;
		adons[index].selected = id;
		this.setState({adons});
	} 
	renderItem = ({item, index}) => {
		if(item.req == 1){
			return (
				<RadioGroup ref={ref => this.group[item.id] = ref} onPress={id => this.handleSelect(id, index)} selected={item.selected} title={item.name} data={item.data} />
			)
		}else{
			return (
				<FormGroup ref={ref => this.group[item.id] = ref} onPress={id => this.handleSelect(id, index)} selected={item.selected} title={item.name} data={item.data} />
			)
		}	
	}
}

class Stepper extends Component {
	constructor(props){
		super(props)
		this.state = {
			step:0			
		}
	}
	setStep = (step) => {
		this.setState({step})
	}
	inc = () => {		
		let step = this.state.step;
		step += 1;
		this.setState({step}, () => {
			this.props.onAdd()
		})
	}
	dec = () => {
		let step = this.state.step;
		if(step <= 0){
			step = 0
		}else{
			step -= 1
		}
		this.setState({step}, () => {
			this.props.onRemove()
		})
	}
	val = () => this.state.step;
	setVal = (step) => {
		this.setState({step})
	}
	render(){
		const {
			step
		} = this.state;
		return (
			<View style={s.stp}>
			  <TouchableNativeFeedback onPress={this.dec}><View style={s.bpr}>
			    <Text style={s.vta}>-</Text>
			  </View></TouchableNativeFeedback>
			  <View style={s.vtq}>
			    <Text style={s.ceq}>{step}</Text>
			  </View>
			  <TouchableNativeFeedback onPress={this.inc}><View style={s.bpr}>
			    <Text style={s.vte}>+</Text>
			  </View></TouchableNativeFeedback>
			</View>
		)
	}
}

class RadioGroup extends Component {
	constructor(props){
		super(props)
		this.state = {
			selected:0
		}
	}
	componentDidMount(){
		const {selected} = this.props;
		this.setState({selected});
	}
	press = (selected) => {		
		this.setState({selected}, () => {
			this.props.onPress(selected)
		})
	}
	dispatch = (items) => {		
		let selected = -1;
		items.forEach(add => {
			if(selected == -1){
				let idx = this.props.data.findIndex(itm => itm.id == add.id);
				if(idx != -1){
					selected = add.id;
				}
			}else{
				return;
			}			
		});		
		if(selected != -1){
			this.setState({selected}, () => {
				this.props.onPress(selected)
			})
		}
	}
	render(){		
		const {title,data} = this.props;
		return (
			<View style={s.vn}>			    
	            <Text style={s.tt}>{title}</Text>	            
				{data.map(itm => {
					return (
						<TouchableNativeFeedback onPress={() => this.press(itm.id)}><View style={s.rgc}>
						 <Text style={s.rgt}>{itm.name}</Text>
						 <View style={s.cf}>
							 {itm.cost == 0 ? null : <Text style={s.ch}>+ {lang.rp}{itm.cost}</Text>}
							 <View style={s.rcb}>						  
							  {this.state.selected == itm.id ? <AniView animation="zoomIn" duration={500} style={s.rch} /> : null}
							 </View>
						 </View>
						</View></TouchableNativeFeedback>
					)
				})}
				<Text style={s.dp}>REQUIRED</Text>
			</View>
		)
	}
}

class FormGroup extends Component {
	constructor(props){
		super(props)
		this.state = {
			selected:[]
		}
	}
	componentDidMount(){
		const {selected} = this.props;
		this.setState({selected});
	}
	press = (index, id) => {
		let selected = this.state.selected;
		if(index == -1){
			selected.push(id);
		}else{
			selected.splice(index, 1);
		}
		this.setState({selected}, () => {
			this.props.onPress(selected)
		})
	}
	dispatch = (items) => {		
		let selected = [];
		items.forEach(add => {			
			let idx = this.props.data.findIndex(itm => itm.id == add.id);
			if(idx != -1){
				selected.push(add.id)
			}		
		});
		this.setState({selected}, () => {
			if(selected.length != 0)this.props.onPress(selected);
		})
	}
	render(){		
		const {title,data} = this.props;
		return (
			<View style={{marginBottom:20}}>			    
	            <Text style={s.tt}>{title}</Text>	            
				{data.map(itm => {
					const selected = this.state.selected.indexOf(itm.id);
					return (
						<TouchableNativeFeedback onPress={() => this.press(selected, itm.id)}><View style={s.rgc}>
						 <Text style={s.rgt}>{itm.name}</Text>
						 <View style={s.cf}>
						     <Text style={{marginRight:5,color:helper.silver,fontSize:16}}>+ {lang.rp}{itm.cost}</Text>
							 <View style={[s.rcb, {borderRadius:7}]}>
							  {selected != -1 ? <AniView animation="zoomIn" duration={500} style={[s.rch, {borderRadius:4}]} /> : null}
							 </View>
						 </View>
						</View></TouchableNativeFeedback>
					)
				})}				
			</View>
		)
	}
}
const s = StyleSheet.create({
	cf:{flexDirection:'row',alignItems:'center'},
	vn:{marginVertical:5},
	vte:{fontSize:30,color:helper.silver},
	vta:{fontSize:40,color:helper.silver},
	ceq:{fontSize:22,color:helper.silver},
	tcb:{width:'55%',fontSize:15,color:helper.silver,fontWeight:'bold'},
	cgq:{fontSize:15,color:helper.silver,fontWeight:'bold'},
	fv:{flexDirection:'row',justifyContent:'space-around',height:80,alignItems:'center',width:'100%',borderTopWidth:0.3,borderColor:helper.grey2},
	stp:{borderColor:helper.primaryColor,borderWidth:0.4,flexDirection:'row',width:160,alignSelf:'center',borderRadius:5,overflow:'hidden',height:50,backgroundColor:'#d0aa451c',marginLeft:10},
	vtq:{width:60,justifyContent:'center',alignItems:'center',height:50},
	bpr:{width:50,justifyContent:'center',alignItems:'center',height:50},
	bjz:{fontSize:12,fontWeight:'bold',color:helper.white},
	dtx:{fontSize:13,color:helper.silver,margin:2},
	dc:{height:90,paddingBottom:5,width:150,margin:5,padding:5,backgroundColor:helper.grey6,borderRadius:13,borderColor:helper.primaryColor},
	cz:{fontSize:17,fontWeight:'bold',color:helper.silver,fontWeight:'bold',width:160},
	im:{width:70,height:70,marginHorizontal:6},
	is:{flexDirection:'row',borderBottomWidth:0.3,borderColor:helper.grey2,height:100,paddingTop:10,backgroundColor:helper.grey4},
	il:{height:100,borderBottomWidth:0.3,borderColor:helper.grey2,justifyContent:'center',backgroundColor:helper.grey4},
	m:{flex:1,backgroundColor:'#000000b4'},
	mhk:{flexDirection:'row',justifyContent:'space-between',width:'97%',alignSelf:'center',marginVertical:3},
	fz:{fontSize:12,color:helper.silver,fontWeight:'bold'},
	ch:{marginRight:5,color:helper.silver,fontSize:16},
	dtt:{fontSize:12,color:helper.silver,marginLeft:5,marginBottom:2,position:'absolute',left:0,bottom:2},
	bdg:{position:'absolute',bottom:0,right:0,width:27,height:27,borderRadius:60,justifyContent:'center',alignItems:'center',backgroundColor:helper.grey4},
	b:{width:'100%',minHeight:100,backgroundColor:helper.grey4,borderTopLeftRadius:10,borderTopRightRadius:10,position:'absolute',bottom:0,height:'80%'},
	tt:{fontSize:22,padding:10,fontWeight:'bold',color:helper.silver,width:215},
	dp:{fontSize:12,borderWidth:1,color:helper.primaryColor,borderColor:helper.primaryColor,backgroundColor:'#d0aa4529',borderRadius:4,paddingHorizontal:5,paddingVertical:1,position:'absolute',top:10,right:7},
	rgc:{flexDirection:'row',marginVertical:4,justifyContent:'space-between',alignItems:'center'},
	rgt:{fontSize:17,color:helper.silver,marginLeft:10,width:'70%'},
	rch:{height:16,width:16,borderRadius:50,justifyContent:'center',alignItems:'center',backgroundColor:helper.primaryColor},
	rcb:{height:25,width:25,borderRadius:50,justifyContent:'center',alignItems:'center',borderWidth:2,borderColor:helper.primaryColor,marginRight:10},

})