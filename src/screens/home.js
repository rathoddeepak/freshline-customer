import React, { Component } from 'react';
import {
	View,
	Text,	
	FlatList,
	Animated,	
	StyleSheet,
	StatusBar,
	ScrollView,
	TouchableOpacity,
	ImageBackground,
	RefreshControl,
	ActivityIndicator,
	PermissionsAndroid,
	ToastAndroid,
	Linking
} from 'react-native';
import request from 'libs/request';
import helper from 'assets/helper';
import {
	HomeHeader,	
	Dots,
	VendorCard,
	Image,
	Icon,
	HeuButton,
	Button,
	Loading,
	LoadingModal,
	AddressModal2,
	Err	
	//Button,
} from 'components';
import LinearGradient from 'react-native-linear-gradient';
import {
  TouchableNativeFeedback
} from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import lang from 'assets/lang';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import * as Animatable from 'react-native-animatable';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import MyCart from 'libs/mycart';
import UserDB from 'libs/userdb';
import VoiceText from 'components/voiceText';
import OneSignal from 'react-native-onesignal';
import Address from 'libs/address';
import Parse from 'parse/react-native';
import LottieView from 'lottie-react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import CoupunView from 'components/coupunView'
import moment from 'moment'

const itemWidth = helper.width;
const chipSize = helper.width * 30 / 100;
const width95 = helper.width * 47 / 100;
const container = helper.height - 100;
const darkCl = '#a68222';
const numColumns = 2;
const catSize = (helper.width / numColumns) - 12;
const catImage = catSize - 20;
const catSizeHalf = catSize/1.3;
export default class Home extends Component {
	constructor(props){
		super(props);
		this.state = {
			slider:[],
			sections:[],
			categories:[],
			resturants:[],
			loading:true,
			cart_count:0,
			order_count:0,
			moreLoading:false,
			endMore:false,
			isTutor:false,
			error:false,
			fAIdx:0,
			discounts:[],
			name:'',
			situationStatus:false,
			emergency:false,
			confirmNotify:false,
			busy:false
		}
		this.focus = null;		
	}

	componentDidMount() {
		OneSignal.sendTags({status: "loggedin", userid:user_id });
		UserDB.init((fs) => {
			this.addressHeader.fetchAddress();
			this.loadHome();			
		});
		changeNavigationBarColor(helper.white, true);
	}

	componentWillUnmount(){
		if(this.focus != null)this.focus();
	}

	setName = () => {
		UserDB.init(() => {
			let {name} = UserDB.getUser();
			this.setState({name});
		})		
	}

	loadHome = async () => {			
		this.setState({confirmNotify:false,loading:true,error:false,situationStatus:false,emergency:false});
		let address = Address.getCurrentAddress();
		if(address == null){
			this.handleNoAddress();
		}
		Parse.Cloud.run("userHomeData", {address,user_id}).then(({status, data}) => {
			let {slider, categories, update, discounts} = data;
			if(status == 400){
				this.setState({error:true,loading:false}, () => {
					if(data.status == 1){
						ToastAndroid.show("Coming To Your Location Soon!", ToastAndroid.SHORT)
						this.addressCh();						
					}else if(data.status == helper.CITY_CRITICAL){
						this.setState({
							situationStatus:helper.CITY_CRITICAL,
							emergency:data.situation.id
						})
					}
				});
				return
			}
			if(update != undefined && update > helper.app_ver){
				this.props.navigation.navigate('Update');
				return;
			}
			this.setState({
				slider,
				discounts,
				categories,
				loading:false
			});
		}).catch(err => {
			alert(err)
			this.setState({error:true,loading:false})
		});
	}

	loadCount = async () => {
		if(this.state.counting)return;	
		this.setState({counting:true});
		var res = await request.perform('vendor2', {				
			user_id,
			req:'odc'
		});	
		if(res)this.setState({counting:false});
		if(typeof res === 'object' && res?.status == 200){
			this.setState({			
				order_count:res.data,
			});
		}
	}

	handleNavItem = (item) => {
		this.props.navigation.navigate('FoodView', {
			item
		});
	}

	handleNavVdr = (item) => {
		this.props.navigation.navigate('VendorView', {
			item
		});
	}

	refresh = (force = false) => {
		if(this.state.loading == false || force == true){
			UserDB.init((fs) => {				
				this.setState({slider:[],sections:[],categories:[],resturants:[],endMore:false}, this.loadHome)			
			});
		}		
	}

	addressCh = () => {
		this.address.show((data, force) => {
			if(data){
				this.refresh(force);
			}
		})
	}

	addNav = () => {
		this.props.navigation.navigate('Addresses');
	}

	registerNotify = () => {
		this.setState({busy:true})
		Parse.Cloud.run('registerBackNotify', {user_id}).then(({data, status}) => {
			if(status == 200){
				this.setState({
					confirmNotify:true,
					busy:false
				})
				ToastAndroid.show('You will notified, once online!', ToastAndroid.SHORT);
			}else{
				this.setState({busy:false}, () => {
					ToastAndroid.show('Please Try Again!', ToastAndroid.SHORT);
				})
			}
		}).then(err => {
			this.setState({busy:false})
			ToastAndroid.show('Please Try Again!', ToastAndroid.SHORT);
		})
	}

	showUserPage = () => {
		this.props.navigation.navigate('Profile')
	}

	render() {
		const {
			categories,
			loading,
			error,
			situationStatus,
			emergency
		} = this.state;
		if(situationStatus == false){
			return (
				<View style={styles.main}>
				    {error ?
				      <>
				      <Err
				       onPress={this.refresh}
				      />
				      <Button
				       text={lang.z[cl].chlc}
				       size={16}
				       br={30}
				       style={{alignSelf:'center'}}
				       onPress={this.addressCh}
				       hr={20}		       
				      />
				      </>
				    : loading ?
				      <>
					      <HomeHeader
					       navUser={this.showUserPage}
					       locationChange={this.loadHome}
					       ref={ref => this.addressHeader = ref}
					       addressPress={this.addNav}
					      />
					      <Shimmer />
				      </>
				    : <Animatable.View animation="fadeIn">
				            <ScrollView  showsVerticalScrollIndicator={false} nestedScrollEnabled stickyHeaderIndices={[1]} refreshControl={<RefreshControl refreshing={false} onRefresh={this.refresh} colors={[helper.primaryColor, "#000"]} />}>
				                <HomeHeader navUser={this.showUserPage} ref={ref => this.addressHeader = ref} iconPress={this.startSpeech} addressPress={this.addNav} />
								{this.renderSearchBar()}
								{this.renderHeader()}
					            <FlatList
							      data={categories}
							      numColumns={numColumns}			
							      keyExtractor={(item, index) => index.toString()}
							      renderItem={this.renderCategory}
							      columnWrapperStyle={{justifyContent: 'space-around'}}
							      ListFooterComponent={this.renderFooter}
							    />
							</ScrollView>
					    </Animatable.View>
				    }
			     <AddressModal2 dNForce ref={ref => this.address = ref} />
			     <VoiceText ref={ref => this.voiceText = ref} />
			     <CoupunView ref={ref => this.coupunView = ref} /> 
			     
				</View>
			)
		}else{
			return this.renderSituation(situationStatus, emergency);
		}
	}

	renderSituation = (situationStatus, emergency) => {
		let situationText = undefined;
		const comback = 'Please come backe after sometime...'
		if(situationStatus == helper.CITY_CRITICAL){
			let anim = null;
			switch(emergency){
				case helper.ClimaticStoppage:
				anim = require('assets/anims/rain.json')
				situationText = `Due to Bad Weather We Have Stopped for a While,\n${comback}`;
				break;
				case helper.WorkforceStoppage:
				anim = require('assets/anims/deliveryBoy.json')
				situationText = `All riders are busy,\n${comback}`;
				break
				case helper.ServerMaintainance:
				anim = require('assets/anims/serverIssue.json')
				situationText = `Our Server's Are At maintainance,\n${comback}`;
				break;
				case helper.Closed:
				break;
			}
			return (
				<View style={[styles.main, styles.center]}>
				 {anim == null ? null : <LottieView
				  loop
				  autoPlay
				  style={{width:250,height:250}}
				  source={anim}
				 />}
				 <Text style={styles.sitTitle}>Sorry For Inconvenience!</Text>
				 <Text style={styles.sitDesc}>{situationText}</Text>
				 {this.state.confirmNotify ? null : <TouchableOpacity activeOpacity={0.9} style={styles.sitBtn} onPress={this.registerNotify}>
				 	<Text style={styles.sitBtnTxt}>Notify Me, Once Online</Text>
				 </TouchableOpacity>}
				 <LoadingModal visible={this.state.busy} />
				</View>
		    )
		}else{
			return <View style={styles.main} />
		}		
	}

	renderFooter = () => {
		return (			
			<>
			    {/*<TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('Feedbacks')} style={styles.bar}>
			     <View style={styles.icon}>
			      <Icon name="fb" color={helper.white} size={25} />
			     </View>
			     <Text style={styles.barTxt}>Feedback 🤗!</Text>
			    </TouchableOpacity>

			    <TouchableOpacity onPress={() => Linking.openURL(helper.applink)}  activeOpacity={0.9} style={styles.bar}>
			     <View style={styles.icon}>
			      <Icon name={lang.st2} color={helper.white} size={25} />
			     </View>
			     <Text style={styles.barTxt}>Rate Our App</Text>
			    </TouchableOpacity>

			    <View style={styles.hr} />*/}
			    <View style={{width:'100%',justifyContent:'center',marginBottom:70,marginTop:-70}}>
					
					<LottieView		        
				        autoPlay
				        loop
				        style={{width:'100%',height:300,alignSelf:'center'}}
				        source={require('assets/anims/chicken.json')}
				    />

				    <Text style={{color:helper.blk,marginTop:5,fontSize:50,top:25,width:'100%',textAlign:'center'}}>Fresh Line</Text>
					<Text style={{color:helper.primaryColor,fontSize:15,top:20,width:'100%',textAlign:'center'}}>Online Meat Delivery App</Text>

			    </View>
		    </>
		)
	}

	scanner = async () => {
	  try {
	    const granted = await PermissionsAndroid.request(
	      PermissionsAndroid.PERMISSIONS.CAMERA,
	      {
	        title: "Table Scanner Camera",
	        message:"We Need Permission To Scan QR Code From Your Camera",
	        buttonNeutral: "Ask Me Later",
	        buttonNegative: "Cancel",
	        buttonPositive: "OK"
	      }
	    );
	    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	      this.props.navigation.navigate('Scanner');
	    } else {
	      ToastAndroid.show("Camera permission denied", ToastAndroid.SHORT);
	    }
	  } catch (err) {
	    //console.warn(err);
	  }	
	}

	visits = () => {
		this.props.navigation.navigate('HotelVisits');
	}

	navCat = ({name, id}) => {
		this.props.navigation.navigate('Explore', {name, id})
	}

	startSpeech = () => {
		this.voiceText.start(searchKey => {
			if(searchKey.length > 0)this.props.navigation.navigate('ProductList', {searchKey})
		})
	}

	searchNav = () => {
		this.props.navigation.navigate('Search')
	}

	navigateCat = (item) => {
		console.log(item)
		this.props.navigation.navigate('CategoryView', {
			parentCat:{id:item.id, name:item.name},
			catCover:item.cover == undefined ? false : item.cover
		})
	}

	showDiscount = (data) => {
		this.coupunView.show(data)
	}

	renderHeader = () => {
		const {			
			slider,
			fAIdx,
			error,
			cart_count,
			order_count,
			counting,
			note,
			discounts
		} = this.state;
		return (
			<>
			 <View style={styles.featured}>
			  <Carousel
				  ref={(c) => { this._carousel = c; }}
				  data={slider}
				  renderItem={this._renderFeatured}
				  sliderWidth={helper.width}
				  itemWidth={itemWidth - 12}
				  sliderHeight={170}
				  itemHeight={170}
				  onSnapToItem={(index) => this.setState({ fAIdx: index }) }
			  />
			  <Dots
				length={slider.length}
				active={fAIdx}
				activeDotHeight={10}
				activeDotWidth={10}
				passiveDotHeight={8}
				passiveDotWidth={8}
				activeColor={helper.primaryColor}
				passiveColor={helper.grey}
			  />
			 </View>

			 <Text style={styles.title2}>Running Discounts</Text>
			 <ScrollView horizontal><View style={{flexDirection:'row',marginLeft:10,marginBottom:30,marginTop:10}}>
			  {discounts.map(this.renderDiscount)}			  
			 </View></ScrollView>

			 <Text style={styles.title2}>All Categories</Text>
			 <Text style={styles.subTxt}>Curated with best range of products</Text>
		    </>
		)
	}
	renderDiscount = (data, index) => {
		return (
			<TouchableOpacity activeOpacity={0.9} onPress={() => this.showDiscount(data)}>
		  	  <View style={styles.disChip}>
			   <Image
			    borderRadius={10}
			    hash={data.hash}
			    sty={{elevation:13,width:'100%',height:'100%'}}
			    source={{uri:data.thumb}}
				imgSty={{width:'100%',height:'100%'}}
			   />
			  </View>
			  <View style={styles.disBar}>
			  {data.type == helper.DISCOUNT_TYPE_AMOUNT ?
			  	<Text style={styles.disTxt}>{lang.rp}{data.amount} OFF</Text>
			  : <Text style={styles.disTxt}>{data.percent}% OFF</Text>}
			  </View>
		    </TouchableOpacity>
		)
	}
	renderSearchBar = () => {
		return (
			<TouchableOpacity onPress={this.searchNav} activeOpacity={0.7}><View style={styles.searchBar}>
			 <View style={{width:40,height:45,justifyContent:'center',alignItems:'center'}}>
			  <Icon name={lang.srch} color={helper.silver} size={24} />
			 </View>
			 
			  <Text numberOfLines={1} style={{flex:1,color:helper.silver,fontSize:18}}>Search for Products, Brands and more</Text>
			 
			 <TouchableOpacity activeOpacity={0.7} onPress={this.startSpeech} style={{width:40,height:45,justifyContent:'center',alignItems:'center'}}>
			  <Icon name={lang.mc} color={helper.primaryColor} size={24} />
			 </TouchableOpacity>
			</View></TouchableOpacity>
		)
	}
	renderCategory = ({item,index}) => {	    
		const {title,items,type} = item;
		const image = helper.validUrl(item.image);
		return (
			<TouchableOpacity activeOpacity={1} onPress={() => this.navigateCat(item)} style={styles.catCover}>
				<View style={styles.catCont}>
				 <Image
			 		 source={{uri:image}}
			 		 hash={item.hash}
			 		 sty={{width:catSize - 15,height:catSizeHalf - 10, shadowColor: '#000000',shadowRadius: 10,shadowOpacity: 1,backgroundColor:helper.secondaryColor,elevation:24}}
			 		 resizeMode="cover"
					 imgSty={{width:catSize - 15,height:catSizeHalf - 10}}		 		 
					 borderRadius={10}
			 	 />
			 	 <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
			 	 <Text numberOfLines={1} style={styles.catTitle}>{item.name}</Text>
			 	 <Text numberOfLines={2} style={styles.catDesc}>Best and high quality, {item.name}</Text>
			 	 </View>
				</View>				
			</TouchableOpacity>
		)		
	}
	_renderFeatured = ({item, index}) => {	   	
		const validUrl = helper.validUrl(item.image)
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.sliderNav(item)} style={styles.fItem}>
                <Image
		 		 source={{uri:validUrl}}			 		 
		 		 hash={item.hash}
		 		 sty={styles.fImage}
		 		 resizeMode="cover"
				 imgSty={styles.fImage}		 
				 borderRadius={10}
		 		/>
                {/*<LinearGradient colors={['transparent',helper.blk+'b4']} style={styles.fHolder}>
                 <Text numberOfLines={1} style={styles.tt}>#{index + 1} {item.title}</Text>
                 <Text numberOfLines={1} style={styles.desc}>{item.desc}</Text>
                </LinearGradient>*/}
            </TouchableOpacity> 
        );
    }

    sliderNav = async ({type_data, type, extra_data}) => {
    	if(type == helper.slider_types.link){
    		try {	      
		      await InAppBrowser.open(type_data, {
		      	toolbarColor:helper.blk,
				secondaryToolbarColor:helper.primaryColor
		      })
		    } catch (error) {
		      
		    }
    	}else if(type == helper.slider_types.product){
    		this.props.navigation.navigate('ProductView', {
				product_id:type_data,
				name:''
			});
    	}else if(type == helper.slider_types.category){
    		this.props.navigation.navigate('CategoryView', {
				parentCat:{id:type_data, name:''}
			});
    	}else if(type == helper.slider_types.sub_category){
    		this.props.navigation.navigate('CategoryView', {
				subCatId:type_data,
				parentCat:{id:extra_data, name:''}
			});
    	}
    }    
}


class Shimmer extends Component {
	render() {
		return (
			<View style={{height:container}}>
			    	<SkeletonContent
						containerStyle={{width:'100%'}}
						isLoading={true}
						boneColor={helper.faintColor}
						highlightColor={helper.secondaryColor}
						layout={[
							{width:'100%',height:200,alignSelf:'center',borderRadius:0},
							helper.skTT,
						]}
					/>
					<SkeletonContent
						containerStyle={{width:'100%',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}
						isLoading={true}
						boneColor={helper.faintColor}
						highlightColor={helper.secondaryColor}
						layout={[skChip,skChip,skChip,skChip,skChip,skChip,skChip,skChip]}
					/>
					<SkeletonContent
						containerStyle={{width:'100%'}}
						isLoading={true}
						boneColor={helper.faintColor}
						highlightColor={helper.secondaryColor}
						layout={[
							helper.skTT,
						]}
					/>
					<SkeletonContent
						containerStyle={{width:'100%',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}
						isLoading={true}
						boneColor={helper.faintColor}
						highlightColor={helper.secondaryColor}						
						layout={[skChip,skChip,skChip,skChip,skChip,skChip,skChip,skChip]}
					/>				
				</View>
		)
	}
}
const skCAT = {borderRadius:100,width: 65,height: 65,marginTop:10,marginLeft:20};
const skChip = {width:catSize,height:catSize,marginTop:5,marginLeft:5,borderRadius:0};
const styles = StyleSheet.create({
	center:{justifyContent:'center',alignItems:'center'},
	sitBtn:{width:230,height:50,borderRadius:30,backgroundColor:helper.primaryColor,justifyContent:'center',alignItems:'center',marginTop:10},
	sitBtnTxt:{fontSize:17,width:'100%',textAlign:'center',color:helper.white},
	sitTitle:{fontSize:23,width:'100%',color:helper.blk,fontWeight:'bold',marginTop:16,textAlign:'center'},
	sitDesc:{fontSize:16,width:'100%',color:helper.blk,textAlign:'center',marginTop:10},
	disBar:{width:70,height:30,backgroundColor:helper.primaryColor,elevation:13,position:'absolute',bottom:-10,left:'12%',justifyContent:'center',alignSelf:'center',borderRadius:10,alignItems:'center',justifyContent:'center'},
	disChip:{marginRight:20,height:100,width:100,borderRadius:10,marginTop:10},
	catDesc:{fontSize:10,color:helper.grey,textAlign:'center',width:catSize - 10,marginTop:2},
	catTitle:{fontSize:15,color:helper.black,textAlign:'center',width:catSize - 10,marginTop:10},
	catCover:{width:catSize,alignItems:'center',marginTop:15,height:catSize + 40},
	searchBar:{justifyContent:'space-between',alignItems:'center',marginTop:10,height:45, width:'97%',alignSelf:'center',backgroundColor:helper.bgColor,borderRadius:13,elevation:24,flexDirection:'row',shadowColor: '#000000',shadowRadius: 10,shadowOpacity: 1},
	barTxt:{fontSize:15,color:helper.white,width:'70%'},
	icon:{width:40,height:40,justifyContent:'center',alignItems:'center'},
	bar:{flexDirection:'row',height:40,alignItems:'center',paddingLeft:10,borderTopWidth:1,borderColor:helper.borderColor},
	hr:{height:1,width:'100%',backgroundColor:helper.borderColor},
	catCont:{justifyContent:'center',width:catSize,height:catSize + 40,borderRadius:10,alignItems:'center',backgroundColor:helper.white,elevation:24,paddingTop:10},
	title2:{fontSize:20,color:helper.blk,marginTop:5,marginBottom:2,marginLeft:10},
	subTxt:{fontSize:14,color:helper.grey,marginLeft:10},
	main:{flex:1,backgroundColor:helper.homeBgColor},
	featured:{height:210, marginTop:20},
	section:{width:'100%'},
	title:{fontSize:13,width:'90%',fontWeight:'bold',color:helper.primaryColor,marginVertical:10,marginLeft:5},
	items:{flexDirection:'row',flexWrap:'wrap'},
	cntr:{flexDirection:'row',overflow:'hidden',backgroundColor:helper.grey6,borderRadius:10,marginBottom:10,width:'100%',alignSelf:'center'},
	fItem:{width:'100%',height:180},
	ndsc:{fontSize:12,color:helper.silver},
	mvka:{width:'70%',padding:10},
	disTxt:{fontSize:13,color:helper.white,width:'100%',textAlign:'center'},
	bdg:{elevation:10,width:30,height:30,marginRight:9,justifyContent:'center',alignItems:'center',backgroundColor:helper.red,borderRadius:60},	
	qa:{justifyContent:'center',flexDirection:'row',width:width95,justifyContent:'flex-start',backgroundColor:helper.grey2,borderRadius:10,paddingVertical:5,paddingLeft:5,alignItems:'center',margin:5},
	ql:{flexDirection:'row',flexWrap:'wrap',},
	cat:{marginTop:0,marginBottom:12,marginHorizontal:4,alignItems:'center'},
	dd:{fontSize:12,color:'white',textAlign:'center',marginTop:5,width:80},
	tt:{fontSize:13,fontWeight:'bold',width:'90%',color:'#fff',marginHorizontal:5},
	desc:{fontSize:12,width:'90%',color:'#fff',marginBottom:8,marginTop:3,marginHorizontal:5},
	fHolder:{width:'100%',height:'100%',position:'absolute',top:0,left:0,borderRadius:7,justifyContent:'flex-end'},
	fImage:{width:'100%',height:'100%'},
	nicn:{width:80,height:80},
	ntt:{fontSize:14,fontWeight:'bold',color:helper.primaryColor},
	ntt:{fontSize:14,fontWeight:'bold',color:helper.primaryColor},
	tq:{color:helper.silver,fontSize:14,fontWeight:'bold'},
});