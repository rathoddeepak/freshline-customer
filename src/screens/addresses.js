import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TextInput,
	Modal,
	ToastAndroid,
	TouchableHighlight,
	TouchableOpacity,
	PermissionsAndroid
}  from 'react-native';
import {
	Icon,
	Dazar,
	Button,	
	Dailog,	
	NHeader,
	Loading,
	LoadingModal
} from 'components';
import LottieView from 'lottie-react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
import addressController from 'libs/address';
import {PlacePicker} from 'libs/PlacePicker';
import Parse from 'parse/react-native';
import Geolocation from 'react-native-geolocation-service';
const sources = [
 {label:'Home', value:0},
 {label:'Office', value:1},
 {label:'Custom', value:2} 
]
export default class Addresses extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addresses:[],
			loading:false,
			error:false,
			busy:false,

			hasAddress:false,
			id:0,
			source:0,
			landmark:'',
			flat:'',
			address:'',
			lng:'',
			lat:'',

			selectedA:-1

		}
		this.addressItem = [];		
	}
	componentDidMount() {		
		this.loadAddresses();
	}
	setAds = (data, callback = undefined) => {
		const {id,cl_address,lng,lat,landmark,flat,source} = data;
	    this.setState({id,selectedA:id,address:cl_address,lng,lat,landmark,flat,source,hasAddress:true}, () => {
	    	if(callback != undefined){
	    		callback();
	    	}
	    });
	}
	nathay = () => {
		this.setState({hasAddress:false})
		this.loadRecents();
	}
	loadAddresses = async () => {
		this.setState({loading:true,error:false})	
		const address = addressController.getCurrentAddress();
		Parse.Cloud.run('getAddress', {user_id}).then(({status, data}) => {
			if(status == 200){
				this.setState({addresses:data.list,loading:false}, () => {
					if(data.current != undefined)this.setAds(data.current);
				});
			}else{
				this.setState({error:true,loading:false});
			}
		}).catch(err => {
			this.setState({error:true,loading:false});
		})
	}
	addAddress = async () => {
		this.setState({busy:true})
		try {		
	    const g = await PermissionsAndroid.requestMultiple(	      
	      [
	       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
	       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
	      ],
	      {
	        title: "Location Permission",
	        message:"We Need Permission To Detect Your Location",
	        buttonNeutral: "Ask Me Later",
	        buttonNegative: "Cancel",
	        buttonPositive: "OK"
	      }
	    );	    
	    if (g['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED || g['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED) {
		    Geolocation.getCurrentPosition(
		        ({coords}) => {
		            this.setState({busy:false}, () => {		            	
		            	this.pick(coords.latitude, coords.longitude)
		            })	            
		        },
		        (error) => {
		            this.setState({busy:false}, () => {
		            	this.pick(18.4088, 76.5604)
		            });
		        },
		        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
		    );
	    } else {
	      this.setState({busy:false}, () => {
	  		this.pick(18.4088, 76.5604)
		  });
	    }
	  } catch (err) {
	  	this.setState({busy:false}, () => {
	  		this.pick(18.4088, 76.5604)
	  	})	    
	  }
	}
	pick(u_lat, u_long){
		PlacePicker.openPicker({
			lng:u_long,
			lat:u_lat
		}, ({place, lng, lat, error}) => {
			if(error){
				ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
			}else{
				this.addModal.show({address:place, lat, lng})
			}			
		})
	}
	handleAdd = (address) => {
		let addresses = this.state.addresses;
		addresses.unshift(address);
		this.setState({addresses,selectedA:address.id,hasAddress:true})
		addressController.setAddress(address);
		this.setAds(address)
		setTimeout(() => {
			if(this.props.onSelect != undefined){
				this.props.onSelect(address);
			}			
		}, 600)
	}
	handleSelect(item, idx){
		let id = item.id;
		const User = Parse.Object.extend(helper.tbls.UR);
		const user = new User();
		user.id = user_id;
		user.set('address_id', id);
		this.setState({busy:true})
		user.save().then(() => {
			let ads = this.state.addresses[idx];
			this.setState({selectedA:id,hasAddress:true,busy:false})		
			this.setAds(ads)
		}).catch((err) => {
			alert(err)
			ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
			this.setState({busy:false});
		})
	}
	async handleDelete (idx) {
		let addresses = this.state.addresses;
		let id = addresses[idx].id;
		this.setState({busy:true})
	    const Address = Parse.Object.extend(helper.tbls.AD);
		const addressObj = new Address();
		addressObj.id = id;
		addressObj.set('user_id', user_id);
		addressObj.set('status', 0);
		addressObj.save().then(() => {
			var toSet = {busy:false};
			if(this.state.selectedA === id){
				toSet = {selectedA:-1,hasAddress:false};
				addressController.flush();
			}
			addresses.splice(idx, 1);
			toSet['addresses'] = addresses;
			this.setState(toSet);
		}).catch(err => {
			this.setState({busy:false});
			ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
		});
	}
	deleteCurrent = () => {
		let addresses = this.state.addresses;
		let selectedA = this.state.selectedA;
		for (let i = 0; i < addresses.length; i++) {
			if(addresses[i].id == selectedA){
				this.handleDelete(i);
				break;
			}
		}			
	}
	handleAdr = () => {		
		let address = this.state.addresses.find(item => item.id == this.state.id);
		if(address == undefined){
			ToastAndroid.show("Please Restart the app", ToastAndroid.SHORT);
			return
		}
		let {lat, lng} = address;
		addressController.setCurrentAddress({lat,lng,text:address.cl_address});		
		this.props?.onSelect({
			id:this.state.id,
			cl_address:this.state.address
		})
	}
	navBack = () => {
    	this.props.navigation.goBack();
    }
	render() {
		const {
			addresses,
			selectedA,
			hasAddress,
			busy
		} = this.state;
		const {
			isModal
		} = this.props;
		return (
			<View style={[s.hldr, isModal ? {
				backgroundColor:helper.bgColor,
				elevation:4,
				borderTopLeftRadius:10,
				borderTopRightRadius:10,
			} : {}]}>
			 {isModal == true ?
			 <View style={s.hadr}>			  
			  <View style={s.tts}>
			   <Text style={s.ttr}>{lang.z[cl].adrs}</Text>
			  </View>
			  <TouchableOpacity onPress={this.handleAdr} disabled={!hasAddress} style={[s.cni, {opacity:hasAddress ? 1 : 0.7}]} activeOpacity={0.7}>
			   <Icon name={lang.chk} color={helper.primaryColor} size={22} />
			  </TouchableOpacity>
			 </View>
			 : <NHeader
			  color={helper.white}
			  title={lang.z[cl].adrs}
			  onPressBack={this.navBack}
			 /> }
			 			
			 <FlatList
		      data={addresses}
		      keyExtractor={(item, index) => index.toString()}
		      ref={ref => (this.adsList = ref)}
		      ListHeaderComponent={this.renderHeader}
		      showsVerticalScrollIndicator={false}
		      ListFooterComponent={this.renderFooter}
		      renderItem={({ item, index }) => 
			      <Address 
			       ref={ref => this.addressItem[item.id] = ref}			       
			       data={item}
			       selected={item.id == selectedA}
			       onDelete={() => this.handleDelete(index)}
			       onSelect={() => this.handleSelect(item, index)}
			      />			      
		      }		      
		    />

		    <AddModal onAdded={this.handleAdd} ref={ref => this.addModal = ref} />			
		    <LoadingModal visible={busy} />
			</View>
		)
	}	
	renderFooter = () => {
		return (
			<View style={{height:20}} />
		)
	}
	renderHeader = () => {
		const {
			address,
			hasAddress,
			addresses,
			error,
			loading
		} = this.state;
		return (
			<React.Fragment>
			    {hasAddress ? <View style={s.cac}>
			      <LottieView		        
			        autoPlay
			        loop
			        style={{width:40,height:40,alignSelf:'center'}}
			        source={require('assets/anims/pointer.json')}
			      />			     
			     <Text style={s.cat}>{address}</Text>
			     <View style={s.footer}>
			      <View style={s.fItm}>
				      <Button
				       text={lang.z[cl].ad}
				       size={16}
				       br={30}
				       style={{width:120}}
				       onPress={this.addAddress}
				       hr={20}		       
				      />
			      </View>
			      <View style={s.fItm}>
			       <Text style={{color:helper.primaryColor,fontSize:16,width:50,textAlign:'center'}}>OR</Text>
			      </View>
			      <View style={s.fItm}>
			          <Button 
				       text={lang.z[cl].dl} 
				       size={14}
				       br={30}
				       style={{width:90}}
				       onPress={this.deleteCurrent}
				       hr={20}		      
				      />
			     </View>
			    </View>
			    </View> :
			    <View style={s.cac}>
			        <Button 
				       text={lang.z[cl].adads} 
				       size={18}
				       br={30}
				       style={{width:150}}
				       onPress={this.addAddress}
				       hr={20}		      
				    />
			    </View>}

			    <TouchableHighlight onPress={this.addAddress} underlayColor={helper.secondaryColor}><View style={s.useMyCover}>
				  <View style={{width:35,height:35,justifyContent:'center',alignItems:'center'}}>
					  <Icon name={lang.gps} color={helper.primaryColor} size={30} />
				  </View>
				  <Text style={{fontSize:18,width:210,textAlign:'center',color:helper.primaryColor}}>Use My Current Location</Text>
				</View></TouchableHighlight>

			    <Text style={s.ss}>Recents</Text>
			 
				<Dazar
			      loading={loading}
			      error={error}
			      emptyOther
			      onRetry={this.loadAddresses}
			      length={addresses.length}
			     />
		    </React.Fragment>
		)
	}
}
class AddModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible:false,
			flat:'',
			address:'',
			landmark:'',
			cl_address:'',
			lng:0,
			lat:0
		}
	}
	show = (toSet, id = null) => {
		toSet['visible'] = true;
		if (id !== null)toSet['id'] = id;
		this.setState(toSet);
	}
	handleAddress = (cl_address) => {
		this.setState({cl_address})
	}
	handleFlat = (flat) => {
		this.setState({flat})
	}
	handleLandmark = (landmark) => {
		this.setState({landmark})
	}
	handleClose = () => {
		if(!this.state.busy)
			this.setState({visible: false})
	}
	addAddress = async () => {
		let {
			flat,
			address,
			cl_address,
			landmark,
			lat,
			lng,
			id
		} = this.state;
		cl_address = request.removeSpaces(cl_address);
		flat = request.removeSpaces(flat);
		landmark = request.removeSpaces(landmark);
		if(request.isBlank(cl_address)){
			ToastAndroid.show(lang.z[cl].pl + lang.z[cl].clad, ToastAndroid.SHORT);
			return;
		}else if(cl_address.length < 6){
			ToastAndroid.show(lang.z[cl].clad + lang.z[cl].ts, ToastAndroid.SHORT);	
			return;		
		}
		if(landmark.length > 4 && landmark.length < 4){ 
			ToastAndroid.show(lang.z[cl].lm + lang.z[cl].ts, ToastAndroid.SHORT);
			return;
		}
		this.setState({busy:true});
		let data = {
			user_id,
			cl_address,
			address,
			flat,
			landmark,
			location:{
				lat:parseFloat(lat),
				lng:parseFloat(lng)
			}
		}
		Parse.Cloud.run('addAddress', data).then(({status, data}) => {
			if(status == 200){				
				this.setState({busy:false,visible:false}, () => {
					this.props.onAdded(data);
				})
			}else{
				this.setState({busy:false}, () => {
					ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
				});
			}
		}).catch(err => {
			this.setState({busy:false}, () => {
				ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
			});
		});
	}
	render() {
		const {
			visible,
			flat,
			address,
			cl_address,
			landmark,
			busy
		} = this.state;
		return (
			<Modal transparent onRequestClose={this.handleClose} visible={visible} animationType="fade">
			 <View style={s.mdl}>
			  <View style={s.mdc}>
			   <Text style={s.addModalTitle}>{lang.z[cl].flzAds}</Text>
			    <TextInput
				   style={[s.inpt, {opacity:0.7,width:'95%'}]}
				   placeholder={lang.z[cl].adr}				   			  
				   editable={false}
				   value={address}
				   placeholderTextColor={helper.silver} 
			    />			    
			    <TextInput
				   style={[s.inpt, {width:'95%'}]}
				   placeholder={lang.z[cl].clad + '*'}
				   onChangeText={this.handleAddress}
				   value={cl_address}
				   placeholderTextColor={helper.silver}			   
			    />
			     <TextInput
				   style={[s.inpt, {width:'95%'}]}
				   placeholder={lang.z[cl].flt}				   			  
				   onChangeText={this.handleFlat}
				   value={flat}
				   placeholderTextColor={helper.silver}			   
			    />
			    <TextInput
				   style={[s.inpt, {width:'95%'}]}
				   placeholder={lang.z[cl].lnmk}				   			  
				   onChangeText={this.handleLandmark}
				   value={landmark}
				   placeholderTextColor={helper.silver}			   
			    />			    
			    <View style={s.bottomButton}>
			     <Text style={s.btnTxt}>Submit</Text>
			    </View>
			    {busy ? 
			    <View style={{width:'100%',height:'100%',borderRadius:7,position:'absolute'}}>
			     <Loading height={'100%'} container={'120%'}/>
			    </View> : null}
			  </View>
			 </View>
			</Modal>
		)
	}
}
class Address extends Component {
	render() {
		const {
			data,
			onSelect,
			selected,
			onDelete
		} = this.props;	
		const color = selected ? helper.primaryColor : helper.greyw;
		const name = selected ? lang.chk : lang.rcnt;
		return (
			<TouchableHighlight underlayColor={helper.secondaryColor} onPress={onSelect}><View style={s.adi}>
			     <View style={{width:'20%',justifyContent:'center',alignItems:'center'}}>
					 <Icon color={color} size={22} name={name} />
				 </View>
				 <View style={{width:'60%'}}>
					 <Text numberOfLines={1} style={s.tt}>{data.cl_address}</Text>					 
					 <Text numberOfLines={1} style={s.dd}>Added on {data.time}</Text>
				 </View>
				 <View style={{width:'20%',justifyContent:'center',alignItems:'center'}}>
				    <TouchableOpacity onPress={onDelete} style={{width:30,height:30,backgroundColor:helper.secondaryColor,borderRadius:100,justifyContent:'center',alignItems:'center'}}>
					 <Icon color={helper.primaryColor} size={20} name={lang.trh} />
					</TouchableOpacity>
				 </View>
			</View></TouchableHighlight>
		)
	}
}
const s = StyleSheet.create({
	addModalTitle:{
		width:'95%',
		alignSelf:'center',
		fontSize:26,
		color:helper.primaryColor,
		fontWeight:'bold',
		marginTop:20,
		marginBottom:10,
		fontFamily:'sans-serif-medium'
	},
	bottomButton:{
		height:50,
		width:'100%',
		justifyContent:'center',
		backgroundColor:helper.primaryColor,
		borderBottomRightRadius:10,
		borderBottomLeftRadius:10,
		marginTop:10
	},
	btnTxt:{
		fontSize:20,
		width:'100%',
		textAlign:'center',
		color:helper.white,
		fontWeight:'bold',
		fontFamily:'sans-serif-medium'
	},
	useMyCover:{marginTop:10,padding:10,borderRadius:10,flexDirection:'row',justifyContent:'center',alignItems:'center',width:'95%',alignSelf:'center',backgroundColor:helper.white,elevation:4},
	hadr:{height:50,width:'100%',flexDirection:'row',backgroundColor:helper.primaryColor,borderTopLeftRadius:10,borderTopRightRadius:10,elevation:4},
	tts:{width:'60%',height:50,justifyContent:'center',paddingLeft:10},
	ttr:{color:helper.white,fontSize:20},
	cni:{width:35,height:35,borderRadius:80,backgroundColor:helper.secondaryColor,justifyContent:'center',alignItems:'center',position:'absolute',top:7,right:8},	
	mdl:{width:'100%', height:'100%', backgroundColor:'#000000b4',justifyContent:'center',alignItems:'center'},
	mdc:{width:'95%',borderRadius:15,elevation:10,backgroundColor:helper.white,borderWidth:2,borderColor:helper.primaryColor,alignItems:'center'},
	hldr:{height:'100%',width:'100%',backgroundColor:helper.homeBgColor},
	cac:{height:200,width:'95%',alignSelf:'center',borderRadius:10,marginTop:15,backgroundColor:helper.white,justifyContent:'center',alignItems:'center',marginBottom:8,elevation:4},
	footer:{height:60,flexDirection:'row',width:'100%',justifyContent:'space-around'},
	fItm:{justifyContent:'center',alignItems:'center'},
	ss:{fontSize:22,color:helper.primaryColor,marginTop:8,marginLeft:8,fontFamily:'sans-serif-medium'},
	adi:{width:'95%',paddingVertical:7,marginVertical:7,flexDirection:"row",alignSelf:'center',backgroundColor:helper.white,elevation:4,borderRadius:10},
	tt:{color:helper.primaryColor,fontSize:14},
	dd:{color:helper.greyw,fontSize:13},
	inpt:{fontSize:16,padding:0,color:helper.blk,justifyContent: 'center',borderRadius:5,height:45,marginBottom:10,width:"90%",paddingHorizontal:10,backgroundColor:helper.white,elevation:2,borderWidth:1,borderColor:helper.silver},
	cat:{fontSize:16,width:'95%',marginTop:-2,color:helper.primaryColor,textAlign:'center',marginBottom:10},
})