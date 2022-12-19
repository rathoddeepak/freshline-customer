import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Alert,
	Linking
} from 'react-native';
import {
	Icon,
	Image,
	HeuButton
} from 'components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import LottieView from 'lottie-react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
import { CommonActions } from '@react-navigation/native';
import UserDB from 'libs/userdb';
import MyCart from 'libs/mycart';
import Address from 'libs/address';
import OneSignal from 'react-native-onesignal';
import ChatWootWidget from '@chatwoot/react-native-widget';
import {Bar as Progressbar} from 'react-native-progress'
import Parse from 'parse/react-native';

const avatar = 'https://gcdnb.pbrd.co/images/oxURQh5tbHri.png?o=1';
export default class UserProfile extends Component {
	constructor(props){
		super(props)
		this.state = {
			name:'',
			balance:'Retry...',
			showWidget:false		
		}
		this.focus = null;
	}
	
	componentDidMount(){
		this.setName();
		this.focus = this.props.navigation.addListener('focus', () => {
	      this.setName();
	      this.loadBalance();
	    });
	}

	componentWillUnmount(){
		if(this.focus == null)this.focus();
	}

	setName = () => {
		UserDB.init(() => {
			let {name, user_id} = UserDB.getUser();
			this.setState({name,user_id});
		})		
	}

	loadBalance = () => {
		this.setState({busy:true})
		Parse.Cloud.run("getWalletAmount", {
			user_id			
		}).then(({status, data}) => {
			this.setState({busy:false});
			if(status == 200){
				this.setState({balance:lang.rp + data})
			}else{
				this.setState({balance:'Retry...'})
			}
		}).catch(err => {
			this.setState({balance:'Retry...',busy:false})
		})
	}

	nv = (screen) => {
		if(screen == 'wp'){
			Linking.openURL('whatsapp://send?text=Hello, FreshLine Team&phone=+917038193132')
		}else if(screen == 'tg'){
			Linking.openURL('https://t.me/famdelsupport')
		}else{
			this.props.navigation.navigate(screen);
		}		
	}

	logout = () => {
		OneSignal.sendTags({status: "logout", userid:null });		
		UserDB.flush();
		Address.flush();
		MyCart.flush();
		setTimeout(() => {
			this.props.navigation.dispatch(
			  CommonActions.reset({
			    index: 1,
			    routes: [
			      { name: 'SplashScreen'}			      			     
			    ],
			  })
			);
		}, 200)
	}
	async openUrl(url) {
	    try {	      
	      await InAppBrowser.open(helper.site_url + url)
	    } catch (error) {
	      //Alert.alert(error.message)
	    }
	}
	render() {
		const {
			name,
			showWidget,
			busy,
			balance
		} = this.state;
		return (
			<View style={s.main}>			 
			 <View style={s.hdr}>
			  <Text style={s.hdrt}>My Profile</Text>			  
			  <HeuButton style={s.lgt} onPress={this.logout}>
			   <Icon name={lang.lgt} size={22} color={helper.white} />
			   <Text style={[s.itx, {color:helper.white,width:53}]}>Logout</Text>
			  </HeuButton>
			 </View>
			 <ScrollView>

			 
			 <View style={s.userCard}>

				 <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('EditProfile')} style={s.usr}>
					   <Image
				        sty={s.isz}
					    imgSty={helper.max}
					    borderRadius={100}
					    hash={'LHH4kbof00bI0rWB~8j[dCj?[*ax'}
					    source={{uri:avatar}}
				      />			      
					  <View style={s.cx}>
					   <Text style={s.un}>{name}</Text>				   
					   <Text style={s.zb}>{lang.z[cl].edp}</Text>
					  </View>
				 </TouchableOpacity>

				 <View style={s.ch}>
				  
				  <TouchableOpacity onPress={() =>
				  	this.props.navigation.navigate('Orders')
				  } style={s.xdv} activeOpacity={0.7}>
				   <Icon name={lang.bell} size={40} color={helper.grey2} />
				   <Text style={s.opt}>Updates</Text>
				  </TouchableOpacity>

				  <TouchableOpacity onPress={() =>
				  	this.props.navigation.navigate('Cart')
				  } style={s.xdv} activeOpacity={0.7}>
				   <Icon name={lang.bskt} size={40} color={helper.grey2} />
				   <Text style={s.opt}>Cart</Text>
				  </TouchableOpacity>

				  <TouchableOpacity  onPress={() =>
				  	this.props.navigation.navigate('Addresses')
				  } style={s.xdv} activeOpacity={0.7}>
				   <Icon name={lang.adrs} size={40} color={helper.grey2} />
				   <Text style={s.opt}>Address</Text>
				  </TouchableOpacity>

				 </View>

			 </View>

			 <View style={s.walletCard}>
			  <Text style={s.walletTitle}>FreshLine Wallet</Text>
			  <Text style={s.walletDesc}>Get Cashback on orders</Text>
			  <View style={s.walletFooter}>
			   <Text style={s.walletFooterDesc} onPress={this.loadBalance}>Balance</Text>
			   <Text style={s.walletBalance} onPress={this.loadBalance}>{busy ? 'Loading...' : balance}</Text>
			    {busy ? <Progressbar
			 	  style={{position:'absolute',top:-1}}
			 	  indeterminate
			 	  width={helper.width}
			 	  borderColor={helper.primaryColor}
			 	  color={helper.white}
			 	  height={4}
			 	/> : null}
			  </View>
			 </View>

			 
			 <View style={s.cnt}>
			  
			  {/*<View style={s.zca}><TouchableOpacity style={s.itm} onPress={() => this.nv('wp')} activeOpacity={0.7}>
			   <Icon name={'wp'} color={'default'} size={25} />
			   <Text style={s.itx}>Whatsapp Support</Text>
			  </TouchableOpacity></View>

			  <View style={s.zca}><TouchableOpacity style={s.itm} onPress={() => this.nv('tg')} activeOpacity={0.7}>
			   <Icon name={'tg'} color={'default'} size={25} />
			   <Text style={s.itx}>Telegram Support</Text>
			  </TouchableOpacity></View>*/}

			  <View style={s.zca}><TouchableOpacity   onPress={() => this.setState({showWidget:true})} style={s.itm} activeOpacity={0.7}>
			   <Icon name={lang.hlctr} color={helper.blk} size={25} />
			   <Text style={s.itx}>Help Center</Text>
			  </TouchableOpacity></View>

			  <View style={s.zca}><TouchableOpacity style={s.itm} onPress={() => this.nv('Feedbacks')} activeOpacity={0.7}>
			   <Icon name={'fb'} color={helper.blk} size={25} />
			   <Text style={s.itx}>Feedback/Complaint</Text>
			  </TouchableOpacity></View>

			  <View style={s.zca}><TouchableOpacity style={s.itm} onPress={() => this.nv('Refunds')} activeOpacity={0.7}>
			   <Icon name={lang.rfd} color={helper.blk} size={25} />
			   <Text style={s.itx}>{lang.z[cl].myrf}</Text>
			  </TouchableOpacity></View>

			  {/*<View style={s.zca}><TouchableOpacity onPress={() => this.nv('Complaints')} style={s.itm} activeOpacity={0.7}>
			   <Icon name={lang.rpt} color={helper.blk} size={25} />
			   <Text style={s.itx}>My Complaints</Text>
			  </TouchableOpacity></View>*/}

			  <View style={s.zca}><TouchableOpacity onPress={() => this.openUrl('about')} style={s.itm} activeOpacity={0.7}>
			   <Icon name={lang.abt} color={helper.blk} size={20} />
			   <Text style={s.itx}>About</Text>
			  </TouchableOpacity></View>

			  <View style={s.zca}><TouchableOpacity onPress={() => this.openUrl('terms')} style={s.itm} activeOpacity={0.7}>
			   <Icon name={lang.lw} color={helper.blk} size={20} />
			   <Text style={s.itx}>Terms & Conditions</Text>
			  </TouchableOpacity></View>

			  <View style={s.zca}><TouchableOpacity onPress={() => this.openUrl('licenses')} style={s.itm} activeOpacity={0.7}>
			   <Icon name={lang.opl} color={helper.blk} size={20} />
			   <Text style={s.itx}>Open Source Licenses</Text>
			  </TouchableOpacity></View>

			  <View style={s.zca}><TouchableOpacity onPress={() => Linking.openURL(helper.applink)} style={s.itm} activeOpacity={0.7}>
			   <Icon name={lang.st2} color={helper.blk} size={20} />
			   <Text style={s.itx}>Rate Our App</Text>
			  </TouchableOpacity></View>

			 </View>

			 </ScrollView>

			 {showWidget ? 
		          <ChatWootWidget
		            websiteToken={helper.chatwoot}
		            locale={'en'}
		            baseUrl={helper.chatwoot_base}
		            closeModal={() => this.setState({showWidget:false})}
		            isModalVisible={showWidget}
		            user={{name:`${name} | ${user_id}`,identifier:`${user_id}@freshlineapp.com`}}
		            customAttributes={{type:'help'}}
		          />
		     : null}

			</View>
		)
	}
}

const s = StyleSheet.create({
	walletCard:{
		width:'95%',
		height:150,
		elevation:5,
		backgroundColor:helper.white,
		borderRadius:20,
		elevation:24,
		marginTop:15,
		marginBottom:10,
		alignSelf:'center',
		overflow:'hidden'
	},
	walletFooter:{
		width:'100%',
		height:65,
		backgroundColor:helper.primaryColor,
		borderBottomRightRadius:20,
		borderBottomLeftRadius:20,
		justifyContent:'center',
		paddingLeft:15
	},
	walletFooterDesc:{		
		color:helper.secondaryColor,
		fontSize:15,
		top:-5
	},
	walletBalance:{
		fontSize:17,
		top:-5,
		fontWeight:'bold',
		color:helper.white
	},
	walletTitle:{fontFamily:'sans-serif-medium',fontSize:30,color:helper.blk,fontWeight:'bold',width:'100%',marginTop:15,marginLeft:15},
	walletDesc:{fontSize:15,color:helper.grey,width:'100%',marginTop:5,marginLeft:15,marginBottom:10},
	main:{width:'100%',height:'100%',backgroundColor:helper.homeBgColor},
	hdr:{flexDirection: 'row',justifyContent: 'space-between',padding:6,backgroundColor:helper.primaryColor},
	itm:{flexDirection:'row',height:40,marginTop:6,marginBottom:6,alignItems:'center'},
	hdrt:{fontSize:26,marginVertical:5,color:helper.white,width:200},
	itx:{marginLeft:10,fontSize:16,color:helper.blk,width:'100%'},
	cnt:{width:'95%',alignItems:'center',marginTop:10,backgroundColor:helper.white,elevation:24,marginBottom:10,alignSelf:'center',borderRadius:10},
	usr:{flexDirection:'row',paddingTop:5,paddingHorizontal:5,paddingBottom:7,paddingTop:10,paddingLeft:10},
	userCard:{backgroundColor:helper.white,elevation:10,width:'95%',borderRadius:15,alignSelf:'center',marginTop:15},
	isz:{height:70,width:70},
	zca:{width:'95%',marginLeft:10},
	un:{fontSize:17,width:'100%',color:helper.blk},
	cx:{marginLeft:10,marginTop:8,width:'100%'},
	za:{fontSize:16,color:helper.primaryColor},
	zb:{fontSize:13,color:helper.primaryColor},
	ch:{flexDirection:'row',paddingBottom:10,marginLeft:7},
	xcc:{width:70,height:70,justifyContent:'center',alignItems:'center'},
	xdv:{width:70,height:70,marginRight:10,justifyContent:'center',alignItems:'center'},
	opt:{fontSize:12,fontWeight:'bold',color:helper.grey2},
	lgt:{height:40,flexDirection:'row',padding:10,borderRadius:20,backgroundColor:helper.secondaryColor + '33',justifyContent:'center',alignItems:'center'},
})