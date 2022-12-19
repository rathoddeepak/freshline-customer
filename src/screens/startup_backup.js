import React, {Component} from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	StyleSheet,
	Animated,
	Keyboard,
	TouchableOpacity,
	KeyboardAvoidingView,
	ToastAndroid	
} from 'react-native';
import request from 'libs/request';
import UserDB from 'libs/userdb';
import helper from 'assets/helper';
import {
	LoadingModal,
	AddressModal2
} from 'components';
import ViewPager from '@react-native-community/viewpager';
import LottieView from 'lottie-react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import LinearGradient from 'react-native-linear-gradient';
// import TRUECALLER, {
// 	TRUECALLER_EVENT	
// } from 'react-native-truecaller-sdk';
import RNOtpVerify from 'react-native-otp-verify';
import SmsRetriever from 'react-native-sms-retriever';
import {CommonActions} from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
import lang from 'assets/lang';
import Parse from 'parse/react-native';
const cover = require('assets/images/cover.jpg');
const colors = ['#000000', '#00000021','#000000b4', '#00000021','#000000'];
export default class Startup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy:false,
			opacity:new Animated.Value(1)
		}
	}
	componentDidMount(){		
		OneSignal.sendTags({status: "logout", userid:null });
		this.keyboardDidShowListener = Keyboard.addListener(
	      'keyboardDidShow',
	      this._keyboardDidShow,
	    );
	    this.keyboardDidHideListener = Keyboard.addListener(
	      'keyboardDidHide',
	      this._keyboardDidHide,
	    );
	}

	_keyboardDidShow = () => {
	    Animated.timing(this.state.opacity, {
	    	toValue:0,
	    	useNativeDriver:false
	    }).start()
	}
	_keyboardDidHide = () => {
	    Animated.timing(this.state.opacity, {
	    	toValue:1,
	    	useNativeDriver:false
	    }).start()
	}
	landHome = () => {
		this.props.navigation.dispatch(
	      CommonActions.reset({
	        index: 0,
	        routes: [
	          { name: 'Detector' }            
	        ],
	      })
	    );
	}
	render() {
		const {
			busy,
			opacity
		} = this.state;		
		return (
			<KeyboardAvoidingView style={s.inptr} enabled={false}>				
			    <Text style={s.tt}>Fam<Text style={{color:helper.white}}>Del</Text></Text>
				<Inputer toHome={this.landHome} onBusy={busy => this.setState({busy})} />				
				<Animated.View pointerEvents="none" style={[{opacity}, s.btn]}>
					<Image
					    tintColor={helper.borderColor}
				        style={{width:'100%',height:170}}
				        source={require('assets/images/city.png')}
				    />				    
			    </Animated.View>			    			    
			    <LoadingModal visible={busy} />
			    <AddressModal2 ref={ref => this.address = ref} />
			</KeyboardAvoidingView>
		)
	}
}

class Inputer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			phone_no:'',
			otp:'',
			wrt_otp:'',
			first_name:'',
			last_name:'',
			hash:'',
			otpMode:false		
		}
	}
	componentDidMount(){
		UserDB.init();
		RNOtpVerify.getHash()
		.then(hash => this.setState({hash}));		
		setTimeout(() => {
			/*TRUECALLER.initializeClient();		
			TRUECALLER.isUsable(result => {
			    if (result){
					TRUECALLER.on(TRUECALLER_EVENT.TrueProfileResponse, ({phoneNumber,firstName,lastName}) => {
						this.setState({
							phone_no: phoneNumber,
							first_name: firstName,
							last_name: lastName
						}, () => {
							this.pager.setPage(2);
							this.saveDetails();
						})				    
					});
					TRUECALLER.on(TRUECALLER_EVENT.TrueProfileResponseError, error => {
					    
					})
					setTimeout(() => {
						TRUECALLER.requestTrueProfile();
					}, 300);
			    }else{
			    	this.showPhoneNumber();		        
			    }
			})*/
			//this.showPhoneNumber();
		}, 500)		
	}
	showPhoneNumber = async () => {
	  try {
	    const phone_no = await SmsRetriever.requestPhoneNumber();
	    this.setState({phone_no}, () => {
	    	this.sendOtp()
	    })
	  } catch (error) {
	    
	  }
	}
		

	attachSMSListener = () =>
	    RNOtpVerify.getOtp()
	    .then(p => RNOtpVerify.addListener(this.otpHandler))
	    .catch(p => {

	    });

	otpHandler = (message) => {
	    if(message.includes("Famdel")){
	    	var wrt_otp = parseInt(message.replace( /^\D+/g, ''));
	    	if(wrt_otp == this.state.otp){
	    		this.setState({wrt_otp}, this.verifyOtp);
	    		RNOtpVerify.removeListener();
	    	}
	    }
	}

	componentWillUnmount() {
	    RNOtpVerify.removeListener();
	}
	
	sendOtp = async () => {
		let phone_no = this.state.phone_no;
		phone_no = request.removeSpaces(phone_no);
		if (phone_no.length < 10){
			ToastAndroid.show(lang.z[cl].psc, ToastAndroid.SHORT);
			return;
		}else if(isNaN(phone_no)){
			ToastAndroid.show(lang.z[cl].inp, ToastAndroid.SHORT);
			return;
		}
		this.props.onBusy(true);	
		let hash = undefined;
		if(this.state.hash.length > 0){
			hash = this.state.hash[0];
		}
		Parse.Cloud.run("sendOtp", {phone_no, hash}).then(({data, status}) => {
			this.props.onBusy(false);
			if(status == 200){
				this.setState({otp:data.otp}, () => {
					this.setState({otpMode:true}, () => {
						this.pager.setPage(1);
						this.timer.start();
					})				
				});
				this.attachSMSListener();
			}else{
				ToastAndroid.show(data, ToastAndroid.SHORT);
			}
		}).catch(err => {
			this.props.onBusy(false);
			ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
		})
	}
	verifyOtp = async () => {
		let otp = this.state.otp;		
		if(this.state.wrt_otp != parseInt(otp)){
			ToastAndroid.show(lang.z[cl].ico, ToastAndroid.SHORT);
			return;
		}
		this.props.onBusy(true);
		Parse.Cloud.run("userViaPhone", {phone_no:this.state.phone_no}).then(({data, status}) => {
			this.props.onBusy(false);
			if(status == 200){
				if(data == false){
					this.setState({otpMode:false});
					this.pager.setPage(2);
				}else{
					let {id, name} = data;
					UserDB.setUser({user_id:id, name}, () => {				
						this.props.toHome();
					});
				}
			}else{
				this.error2();
			}
		}).catch(err => {
			this.error2();
		});
	}

	error2 = () => {
		this.props.onBusy(false);
		this.setState({otpMode:false});
		this.pager.setPage(0);
		ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
	}

	saveDetails = async () => {
		let {name,phone_no} = this.state;
		name = request.removeSpaces(name);
		if(name.length < 3){
			ToastAndroid.show(lang.z[cl].evn, ToastAndroid.SHORT);
			return;
		}
		this.props.onBusy(true);
		Parse.Cloud.run("registerUser", {phone_no, name}).then(({data, status}) => {
			this.props.onBusy(false);
			if(status === 400){
				ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
			}else if(status === 200){
				const {id, name} = data;
				UserDB.setUser({
					user_id:id, 
					name
				}, () => {				
					this.props.toHome();
				});
			}
		}).catch(err => {
			this.props.onBusy(false);
			ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);
		});
	}

	verifyAttempt = (wrt_otp) => {
		if(wrt_otp === this.state.otp){
			this.setState({wrt_otp}, () => {
				this.verifyOtp();
			})			
		}
	}

	onChangeRq = () => {
		this.setState({otpMode:false}, () => {
			this.pager.setPage(0)
		})
	}

	render() {
		const {
			otp,			
			phone_no,
			name
		} = this.state;
		return (
			<ViewPager initialPage={0} ref={ref => this.pager = ref} style={{width:'95%',alignSelf:'center',height:260}} scrollEnabled={false}>
				<View style={s.deck}>
					 <Text style={s.dd}>we will send a sms with a verifcation code to this number</Text>
					 <View style={s.inh}>
					     <Text style={s.ctTxt}>+91</Text>
						 <TextInput keyboardType='numeric' 
						  style={s.inpt}
						  placeholder="Phone Number"
						  placeholderTextColor={helper.secondaryColor}
						  value={phone_no}
						  selectionColor={helper.primaryColor}
						  onChangeText={phone_no => this.setState({phone_no})}
						 />
					 </View>
					 <TouchableOpacity activeOpacity={0.8} style={s.ee} onPress={this.sendOtp}>
						 <Text style={s.btnTxt}>Get OTP</Text>
					 </TouchableOpacity>
				</View>
				<View style={s.deck}>
					 <Text style={s.dd}>We have sent OTP on your registered mobile number</Text>
					 <OTPInputView
					    style={s.otpv}
					    pinCount={6}
					    codeInputFieldStyle={s.bs}
					    codeInputHighlightStyle={s.z}
					    onCodeFilled = {(code) => this.verifyAttempt(code)}
					    ref={ref => (this.otpRef = ref)}
					/>
					<OtpTimer ref={ref => this.timer = ref} onResend={this.sendOtp} onChange={this.onChangeRq} />
					 <TouchableOpacity onPress={this.verifyOtp} activeOpacity={0.8} style={s.ee}>
						 <Text style={s.btnTxt}>Verify</Text>
					 </TouchableOpacity>
				</View>
				<View style={s.deck}>
					 <Text style={s.dd}>Your name will be visible to our delivery heroes, famdel team</Text>
					 <TextInput style={s.inBox} placeholder="Full Name" placeholderTextColor={helper.borderColor} value={name} onChangeText={name => this.setState({name})}/>
					 <TouchableOpacity onPress={this.saveDetails} activeOpacity={0.8} style={s.ee}>
						 <Text style={s.btnTxt}>Save</Text>
					 </TouchableOpacity>
				</View>
			</ViewPager>
		)
	}
}

class OtpTimer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			counter:'60',
			ended:false
		}
		this.timer = null;
	}
	start = () => {
		this.setState({counter:60,ended:false});
		this.timer = setInterval(() => {
			this.setState({counter:this.state.counter - 1}, () => {
				if(this.state.counter == 0)this.end();
			})
		}, 1000);
	}
	stop = () => {
		clearInterval(this.timer);
		this.setState({counter:60})
	}
	end = () => {
		this.setState({ended:true,counter:60});
		clearInterval(this.timer);		
	}
	resend = () => {
		this.props.onResend();
		this.stop();
		setTimeout(this.start, 100);
	}
	change = () => {
		this.stop();
		this.props.onChange();
	}
	render() {
		const {
			ended,
			counter
		} = this.state;
		return (
			<View style={{width:'100%'}}>
			 {ended	?		   
			    <Text style={[s.dtf, {alignSelf:'center'}]} onPress={this.resend}>Resend OTP</Text>
			 :
				<View style={{alignSelf:'center',flexDirection:'row'}}>
				<Text style={s.dtf}>00:{counter} •</Text>
				<Text style={s.dtf} onPress={this.change}> Change Number</Text>
				</View>
			 }
			</View>
		)
	}
}
const s = StyleSheet.create({
	deck:{width:'100%'},
	inptr:{height:'100%',width:'100%',backgroundColor:helper.bgColor,justifyContent:'center',alignItems:'center'},
	inh:{flexDirection:'row',alignItems:'center',marginBottom:20},
	ctTxt:{fontSize:34,width:70,color:helper.primaryColor,fontWeight:'bold'},
	header:{height:200,width:'100%',marginBottom:30,marginTop:20},
	dtf:{fontSize:13,color:helper.silver,fontWeight:'bold',marginBottom:10},
	hin:{height:200,width:'100%',position:'absolute',justifyContent:'center',alignItems:'center'},
	ht:{fontSize:50,color:helper.primaryColor,fontFamily:'scriptmt'},
	tt:{width:'95%',fontSize:30,fontWeight:'bold',color:helper.primaryColor,marginBottom:5},
	dd:{fontSize:15,fontWeight:'bold',color:helper.secondaryColor,marginBottom:15},
	ee:{height:45,width:'100%',justifyContent:'center',alignItems:'center',backgroundColor:helper.borderColor},
	inpt:{fontSize:30,fontWeight:'bold',color:helper.white,padding:0,width:'100%'},
	btn:{width:'100%',bottom:0,position:'absolute'},
	otpv:{width:200,alignSelf:'center',height:40,marginBottom:20},
	bs:{width: 30,height: 45,borderWidth: 0,borderBottomWidth: 1},
	z:{borderColor: helper.primaryColor},
	inBox:{borderWidth:2,borderColor:helper.borderColor,color:helper.white,fontSize:20,marginBottom:20,paddingLeft:10},
	btnTxt:{fontSize:20,color:helper.primaryColor,fontWeight:'bold',width:'100%',textAlign:'center'}
})
