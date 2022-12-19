import React, { Component } from 'react';
import {
	View,
	Text,
	Animated,
	StyleSheet,
	Dimensions,
	BackHandler,
	ActivityIndicator
} from 'react-native';
import {
	Icon
} from 'components';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
import LottieView from 'lottie-react-native';
import Svg, {Image,Line} from 'react-native-svg';
const progress = '#666666';
const pathColor = '#383838';
const DownMan = require('assets/images/delivery.png');
const RightMan = require('assets/images/dlright.png');
const LeftMan = require('assets/images/dlleft.png');
const didiagonal = require('assets/images/dldiagonal.png');
const ONE = 1;
const HALF = 2;
function decodeStatus(status,za){
	switch(status){
		case helper.FOOD_NOT_PREPARED:		
		return {sts:'Waiting', anim:require('assets/anims/waiting.json')};
		case helper.FOOD_ACCEPT:
		case helper.DELIVERY_FN_PREPARED:
		return {sts:lang.z[za].ckng, anim:require('assets/anims/cooking.json')};
		case helper.FOOD_PREPARED:
		case helper.DELIVERY_F_PREPARED:
		return {sts:lang.z[za].rdy, anim:require('assets/anims/confirm.json')};
		case helper.HAS_PICKED_C:
		case helper.HAS_PICKED_F:
		case helper.HAS_CENTERED:
		return {sts:lang.z[za].otw, anim:false};
		case helper.HAS_DELIVERED:
		return {sts:lang.z[za].dld, anim:require('assets/anims/delivered.json')};
		default:
		return {sts:'', anim:false};
	}
}
export default class Tracking extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading:false,
			surface:{width:0,height:0},

			//DH1 Values
			DHOL1YPOS:0,
			DHOL1XPOS:0,
			DHOL1Y2POS:0,
			DHOL2X2POS:0,
			//DH2 Values
			DHTL1YPOS:0,
			DHTL1XPOS:0,
			DHTL1Y2POS:0,
			//DH3 Values
			DHHL1XPOS:0,
			DHHL1YPOS:0,
			DHHL1Y2POS:0,
			DHHL1X3POS:0,

			//DH4 Values
			DHFL1XPOS:0,
			DHFL1X2POS:0,
			DHFL1YPOS:0,

			//DH5 Values
			DHVL1Y2POS:0,

			pd_status:[-1,-1,-1,-1],
			pd_names:['','','',''],
			showTill:0,
			mounted:true,
			order_code:''
		}
		this.deliveryPath = [];
	}
	componentDidMount(){
		let {order_id, order_code} = this.props.route.params;
		const surface = Dimensions.get('window');
		this.setState({surface,order_id,order_code});
		
		//DH -1 START
		let DHOL1YPOS = surface.height * 45.69 / 100;
		let DHOL1XPOS = surface.width * 7.98 / 100;
		let DHOL1Y2POS = surface.height * 56.08 / 100;
		let DHOL2X2POS = surface.width * 32.6 / 100;

		//DH -2 START
		let DHTL1YPOS = surface.height * 23.99 / 100;
		let DHTL1XPOS = surface.width * 33.57 / 100;
		let DHTL1Y2POS = surface.height * 55.58 / 100;

		//DH -3 START
		let DHHL1XPOS = surface.width * 70.85 / 100;
		let DHHL1YPOS = surface.height * 28.90 / 100;		
		let DHHL1Y2POS = surface.height * 37.89 / 100;
        //let DHHL1X2POS = DHHL1XPOS;
		//let DHHL1Y3POS = DHHL1Y2POS;		
		let DHHL1X3POS = surface.width * 52.81 / 100;

		//DH - 4		
		let DHFL1X2POS = surface.width * 65.65 / 100;
		
		//DH - 5
		let DHVL1Y2POS = surface.height * 80.46 / 100;
		this.setState({
			DHOL1YPOS,DHOL1XPOS,DHOL1Y2POS,DHOL2X2POS,
			DHTL1YPOS,DHTL1XPOS,DHTL1Y2POS,DHHL1XPOS,
			DHHL1YPOS,DHHL1Y2POS,DHHL1X3POS,
			DHFL1X2POS,DHVL1Y2POS
		}, () => {
			this.startFecthing();
		});
		this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction);
	}	
	componentWillUnmount() {
		this.setState({mounted:false})
	    this.backHandler.remove();
	}
	backAction = () => {
		this.setState({mounted:false});
		return false;
	}
	startFecthing = async () => {		
		this.setState({loading:true})	
		var res = await request.perform('orders', {
			order_id:this.state.order_id,
			req:'trk_ord',			
			user_id
		});		
		if(res){
			this.setState({loading:false});
			this.refetch()
		}		
		if(typeof res === 'object' && res?.status == 200){			
			if(res.data && this.state.mounted)this.formulateData(res.data);			
		}		
	}
	refetch = () => {
		setTimeout(() => {
			if(this.state.mounted)this.startFecthing();
		}, 5000)
	}
	formulateData = (data) => {
		let {tracking, dispatch} = data;		
		this.setState({
			showTill:tracking.length
		}, () => {
			setTimeout(() => {
					let pd_status = [-1, -1, -1, -1];
				let pd_names = ['', '', '', ''];
				for(let i = 0; i < tracking.length; i++) {				
					if(tracking[i].percent != 0){					
						this.deliveryPath[i]?.setValue(tracking[i].percent);
					}
					pd_status[i] = tracking[i].status;
					pd_names[i] = tracking[i].name;
				}
				this.setState({pd_status,pd_names});
				if(dispatch.percent != 0)this.deliveryPath[4]?.setValue(dispatch.percent);
			}, 500)
		})		
	}
	render() {
		const {
			loading,
			surface,

			//DH1VALUES
			DHOL1YPOS,
			DHOL1XPOS,
			DHOL1Y2POS,
			DHOL2X2POS,

			//DH2VALUES
			DHTL1YPOS,
			DHTL1XPOS,
			DHTL1Y2POS,

			//DH3VALUES
			DHHL1XPOS,
			DHHL1YPOS,
			DHHL1Y2POS,
			DHHL1X3POS,

			//DH4VALUES			
			DHFL1X2POS,				
			
			//DH5VALUES
			DHVL1Y2POS,

			pd_status,
			pd_names,
			showTill,
			order_code
		} = this.state;
		return (
			<View style={helper.main2}>
				<Text style={{position:'absolute',top:20,width:'100%',textAlign:'center',fontSize:17,fontWeight:'bold',color:helper.primaryColor}}>Tracking Order - {order_code}</Text>
				<Svg height={surface.height} width={surface.width}>
				  {this.renderStatic(showTill)}				  
				  {showTill > 0 ?
				  <PathOne
				  	 startX={DHOL1XPOS} 
				  	 startY={DHOL1YPOS}
				  	 startY2={DHOL1Y2POS}
				  	 startX2={DHOL2X2POS}
				  	 ref={ref => this.deliveryPath[0] = ref}
				  /> : null}
			      {showTill > 1 ?
				  <PathTwo
				  	startY={DHTL1YPOS}
					startY2={DHTL1Y2POS}
					startX={DHTL1XPOS}
					ref={ref => this.deliveryPath[1] = ref}
				  /> : null}

				  {showTill > 2 ?
				  <PathThree
				  	startX={DHHL1XPOS}
					startY={DHHL1YPOS}
					startY2={DHHL1Y2POS}
					startX2={DHHL1X3POS}
					startX3={DHTL1XPOS}
					startY3={DHTL1Y2POS}
					ref={ref => this.deliveryPath[2] = ref}
				  /> : null}

				  {showTill > 3 ?
				  <PathFour
				  	startX={DHFL1X2POS}
				  	startX2={DHTL1XPOS}
					startY={DHTL1Y2POS}
					ref={ref => this.deliveryPath[3] = ref}
				  /> : null}


				  {DHOL1XPOS != 0 ?
				  <PathFive
				  	startX={DHTL1XPOS}				  	
					startY={DHTL1Y2POS}
					startY2={DHVL1Y2POS}
					ref={ref => this.deliveryPath[4] = ref}
				  /> : null}

				</Svg>

				<View style={{height:60,width:60,borderRadius:10,justifyContent:'center',alignItems:'center',elevation:10,backgroundColor:helper.primaryColor,position:'absolute',transform:[
					{translateX:DHOL2X2POS - 20},
					{translateY:DHTL1Y2POS - 20}
				]}}>
				  <Icon name={lang.mctr} size={35}/>
				</View>

				<View style={{height:60,width:60,justifyContent:'center',alignItems:'center',position:'absolute',transform:[
					{translateX:DHTL1XPOS - 30},
					{translateY:DHVL1Y2POS + 20}
				]}}>
					<Icon name={lang.pin} color={helper.primaryColor} size={50}/>
				</View>

				<PathDescriptor x={DHOL1XPOS - 30}  y={DHOL1YPOS - 125} name={pd_names[0]} status={pd_status[0]} />
				<PathDescriptor x={DHTL1XPOS - 30}  y={DHTL1YPOS - 125} name={pd_names[1]} status={pd_status[1]} />
				<PathDescriptor x={DHHL1XPOS - 30}  y={DHHL1YPOS - 125} name={pd_names[2]} status={pd_status[2]} />
				<PathDescriptor x={DHFL1X2POS + 50} y={DHTL1Y2POS - 75} name={pd_names[3]} status={pd_status[3]} />

				{loading ?
					<View style={s.vh}>
					 <ActivityIndicator size={30} color={helper.primaryColor} />
					</View>
				: null}
			</View>
		)
	}
	renderStatic = (showTill) => {
		const {
			surface,

			//DH1VALUES
			DHOL1YPOS,
			DHOL1XPOS,
			DHOL1Y2POS,
			DHOL2X2POS,

			//DH2VALUES
			DHTL1YPOS,
			DHTL1XPOS,
			DHTL1Y2POS,

			//DH3VALUES
			DHHL1XPOS,
			DHHL1YPOS,
			DHHL1Y2POS,
			DHHL1X3POS,

			//DH4VALUES			
			DHFL1X2POS,					
			
			//DH5VALUES
			DHVL1Y2POS
		} = this.state;		
		return (
			<>				  
				  <Line x1={DHOL1XPOS} y1={DHOL1YPOS} x2={DHOL1XPOS} y2={DHOL1Y2POS} stroke={pathColor} strokeWidth={6} opacity={showTill > 0 ? ONE : HALF} />
				  <Line x1={DHOL1XPOS - 3} y1={DHOL1Y2POS} x2={DHOL2X2POS} y2={DHOL1Y2POS} stroke={pathColor} strokeWidth={6} opacity={showTill > 0 ? ONE : HALF} />				  

				  {/*Path Two*/}				  
				  <Line x1={DHTL1XPOS} y1={DHTL1YPOS} x2={DHTL1XPOS} y2={DHTL1Y2POS} stroke={pathColor} strokeWidth={6} opacity={showTill > 1 ? ONE : HALF} />				  

				  {/*Path Three*/}				  
				  <Line x1={DHHL1XPOS} y1={DHHL1YPOS} x2={DHHL1XPOS} y2={DHHL1Y2POS} stroke={pathColor} strokeWidth={6} opacity={showTill > 2 ? ONE : HALF} />
				  <Line x1={DHHL1XPOS + 3} y1={DHHL1Y2POS} x2={DHHL1X3POS} y2={DHHL1Y2POS} stroke={pathColor} strokeWidth={6} opacity={showTill > 2 ? ONE : HALF} />
				  <Line x1={DHHL1X3POS + 1.5} y1={DHHL1Y2POS} x2={DHTL1XPOS} y2={DHTL1Y2POS} stroke={pathColor} strokeWidth={6}opacity={showTill > 2 ? ONE : HALF}  />				  

				  {/*Path Four*/}				  
				  <Line x1={DHFL1X2POS} y1={DHTL1Y2POS} x2={DHTL1XPOS} y2={DHTL1Y2POS} stroke={pathColor} strokeWidth={6} opacity={showTill > 3 ? ONE : HALF}/>

				  {/*Path Five*/}				  
				  <Line x1={DHTL1XPOS} y1={DHTL1Y2POS} x2={DHTL1XPOS} y2={DHVL1Y2POS} stroke={pathColor} strokeWidth={6} />
			</>
		)
	}
}

class PathDescriptor extends Component {
	render() {
		const {
			status,
			name,
			x,
			y
		} = this.props;
		const {sts, anim} = decodeStatus(status, cl);
		return (
			<View style={{width:60,justifyContent:'center',alignItems:'center',position:'absolute',transform:[
					{translateX:x},
					{translateY:y}
				]}}>
				  <View style={{width:60,height:60}}>
				   {anim ? <LottieView		        
			        autoPlay
			        loop			        
			        style={{width:100,height:100,left:-12,bottom:5}}
			        source={anim}
			      /> : null}
			      </View>				
			        <Text numberOfLines={2} style={{color:helper.silver,fontWeight:'bold',fontSize:12,textAlign:'center'}}>{sts}</Text>
					<Text numberOfLines={2} style={{color:helper.primaryColor,fontWeight:'bold',fontSize:11,textAlign:'center'}}>{name}</Text>
				</View>
		)
	}
}
class PathOne extends Component {
	constructor(props) {
		super(props)
		this.state = {
			startX:0,
			startY:0,
			startY2:0,
			startX2:0,
			aniValue:new Animated.Value(0),
			sub:0,
			currentMan:1,
			manLink:DownMan
		}
		this.state.aniValue.addListener( ({value}) => {		 
		 if(value < this.state.startY2){
		 	this.manCon(1)
		 	this.lineOne[0]?.setNativeProps({ y2: value});		 	
		 	this.rider?.setNativeProps({y:value - 15})
		 }else{
		 	this.manCon(2)
		 	let a = JSON.stringify(this.state.aniValue.interpolate({
			 inputRange:[this.state.startY2, this.state.sub],
			 outputRange:[this.state.startX, this.state.startX2],			 
			}));			
		 	this.lineOne[1]?.setNativeProps({ x2: a });
		 	this.rider?.setNativeProps({x:(parseInt(a) - 20)})
		 }
	    });	    		
		this.lineOne = [];
	}
	componentDidMount() {
		let {startX,startY,startY2,startX2} = this.props;
		this.state.aniValue.setValue(startY);
		this.setState({startX,startY,startY2,startX2,sub:startY2 + startX2});
	}
	setValue = (percent) => {				
		if(this.state.sub == 0)return;
		let addOn = (this.state.startY / this.state.sub) * 100;
		percent = ((percent / (addOn + 100)) * 100);
		let value = this.state.startY + (this.state.sub * percent) / (100 + addOn);		
		Animated.timing(this.state.aniValue, {
			toValue:value,
			duration:3000,
			useNativeDriver:true
		}).start();
	}
	manCon = (currentMan) => {		
		if(currentMan == this.state.currentMan || this.state.startY == 0)return;
		this.setState({manLink:currentMan == 1 ? DownMan : RightMan, currentMan})
	}
	render() {
		const {
			startX,startY,startY2,startX2,
			manLink,
			currentMan
		} = this.state;
		return (
	        <>	        
				<Line ref={ref => this.lineOne[0] = ref} x1={startX} y1={startY} x2={startX} y2={startY} stroke={progress} strokeWidth={6} />
				<Line ref={ref => this.lineOne[1] = ref} x1={startX - 3} y1={startY2} x2={startX - 3} y2={startY2} stroke={progress} strokeWidth={6} />				
				<Image
				    x={startX - 15}
				    y={startY - 15}
				    width={currentMan == 1 ? 30 : 50}				    
				    height={currentMan == 1 ? 50 : 30}				    
				    ref={ref => this.rider = ref}				    
				    href={manLink}				    
				 />
			</>
		)
	}
}
class PathTwo extends Component {
	constructor(props){
		super(props)
		this.state = {			
			startY:0,
			startY2:0,
			startX:0,
			aniValue:new Animated.Value(0),
			sub:0			
		}
		this.state.aniValue.addListener( ({value}) => {		 
			let v = JSON.stringify(this.state.aniValue.interpolate({
				inputRange:[0, 100],
				outputRange:[this.state.startY, this.state.startY2]
			}))
		 	this.lineTwo?.setNativeProps({ y2: v });		 	
		 	this.rider?.setNativeProps({y:(parseInt(v) - 15)})
	    });
	}
	componentDidMount() {
		let {startY,startY2} = this.props;		
		this.setState({startY, startY2});
	}
	setValue = (percent) => {				
		Animated.timing(this.state.aniValue, {
			toValue:percent,
			duration:3000,
			useNativeDriver:true
		}).start();
	}
	render() {
		const {startY,startY2,startX} = this.props;
		return (
			<>
			 <Line ref={ref => this.lineTwo = ref} x1={startX} y1={startY} x2={startX} y2={startY} stroke={progress} strokeWidth={6} />	
			 <Image
			    x={startX - 15}
			    y={startY - 15}
			    width={30}
			    height={50}
			    ref={ref => this.rider = ref}			    
			    href={DownMan}				    
			 />
			</>
		)
	}
}
class PathThree extends Component {
	constructor(props){
		super(props)
		this.state = {			
			startY:0,
			startY2:0,
			startX:0,
			aniValue:new Animated.Value(0),
			sub:0,
			riderW:30,
			riderH:50,
			currentMan:1,
			manLink:DownMan
		}
		this.lineThree = [];
		this.state.aniValue.addListener( ({value}) => {
		    if(value < 30){
		    	this.manCon(1)
		    	let y2 = JSON.stringify(this.state.aniValue.interpolate({
					inputRange:[0, 30],
					outputRange:[this.state.startY, this.state.startY2]
				}))
			 	this.lineThree[0].setNativeProps({ y2 });
			 	this.rider?.setNativeProps({y:(parseInt(y2) - 15)})
		    }else if(value < 50){		    	
		    	this.manCon(2)
		    	let x2 = JSON.stringify(this.state.aniValue.interpolate({
					inputRange:[30, 50],
					outputRange:[this.state.startX, this.state.startX2 - 2]
				}))
			 	this.lineThree[1].setNativeProps({ x2 });
			 	this.rider?.setNativeProps({x:(parseInt(x2) - 15)})
		    }else{
		    	this.manCon(3)
		    	let x2 = JSON.stringify(this.state.aniValue.interpolate({
					inputRange:[50, 100],
					outputRange:[this.state.startX2, this.state.startX3]
				}))
				let y2 = JSON.stringify(this.state.aniValue.interpolate({
					inputRange:[50, 100],
					outputRange:[this.state.startY2, this.state.startY3]
				}))
				
			 	this.lineThree[2].setNativeProps({ x2, y2});
			 	this.rider?.setNativeProps({x:parseInt(x2 - 20), y:parseInt(y2 - 20)})
		    }			
	    });
	}
	componentDidMount() {
		let {startX,startY,startY2,startX2,startX3,startY3} = this.props;		
		this.setState({startX,startY,startY2,startX2,startX3,startY3});
	}
	setValue = (percent) => {				
		Animated.timing(this.state.aniValue, {
			toValue:percent,
			duration:3000,
			useNativeDriver:true
		}).start();
	}
	manCon = (currentMan) => {		
		if(currentMan == this.state.currentMan || this.state.startY == 0)return;
		let manLink = null;
		let riderH = 0;
		let riderW = 0;
		if(currentMan == 1){
			riderH = 30;
			riderW = 50;
			manLink = DownMan;
		}else if(currentMan == 2){
			riderH = 30;
			riderW = 50;
			manLink = LeftMan;
		}else if(currentMan == 3){
			riderH = 60;
			riderW = 40;
			manLink = didiagonal;
		}
		this.setState({manLink, currentMan, riderH, riderW})
	}
	render() {
		const {startX,startY,startY2,startX2,startX3,startY3} = this.props;
		const {manLink,riderW,riderH} = this.state;
		return (
			<>
			 <Line ref={ref => this.lineThree[0] = ref} x1={startX} y1={startY} x2={startX} y2={startY} stroke={progress} strokeWidth={6} />
		     <Line ref={ref => this.lineThree[1] = ref} x1={startX + 3} y1={startY2} x2={startX + 3} y2={startY2} stroke={progress} strokeWidth={6} />
			 <Line ref={ref => this.lineThree[2] = ref} x1={startX2} y1={startY2} x2={startX2} y2={startY2} stroke={progress} strokeWidth={6} />
			 <Image
			    x={startX - 15}
			    y={startY - 15}
			    width={riderW}
			    height={riderH}
			    ref={ref => this.rider = ref}			    
			    href={manLink}				    
			 />
			</>
		)
	}
}
class PathFour extends Component {
	constructor(props){
		super(props)
		this.state = {			
			startY:0,
			startY2:0,
			startX:0,
			aniValue:new Animated.Value(0),
			sub:0			
		}
		this.state.aniValue.addListener( ({value}) => {		 
			let v = JSON.stringify(this.state.aniValue.interpolate({
				inputRange:[0, 100],
				outputRange:[this.state.startX, this.state.startX2]
			}))
		 	this.lineFive?.setNativeProps({ x2: v });		 	
		 	this.rider?.setNativeProps({x:(parseInt(v) - 18)})
	    });
	}
	componentDidMount() {
		let {startX,startX2} = this.props;		
		this.setState({startX, startX2});
	}
	setValue = (percent) => {				
		Animated.timing(this.state.aniValue, {
			toValue:percent,
			duration:3000,
			useNativeDriver:true
		}).start();
	}
	render() {
		const {
			startX,
			startX2,
			startY
		} = this.props;
		return (
			<>
			 <Line ref={ref => this.lineFive = ref} x1={startX} y1={startY} x2={startX} y2={startY} stroke={progress} strokeWidth={6} />
			 <Image
			    x={startX - 15}
			    y={startY - 15}
			    width={50}
			    height={30}
			    ref={ref => this.rider = ref}			    
			    href={LeftMan}				    
			 />
			</>
		)
	}
}

class PathFive extends Component {
	constructor(props){
		super(props)
		this.state = {			
			startY:0,
			startY2:0,
			startX:0,
			aniValue:new Animated.Value(0),
			sub:0			
		}
		this.state.aniValue.addListener( ({value}) => {		 
			let v = JSON.stringify(this.state.aniValue.interpolate({
				inputRange:[0, 100],
				outputRange:[this.state.startY, this.state.startY2]
			}))
		 	this.lineFive?.setNativeProps({ y2: v });		 	
		 	this.rider?.setNativeProps({y:(parseInt(v) - 18)})
	    });
	}
	componentDidMount() {
		let {startY,startY2} = this.props;		
		this.setState({startY, startY2});
	}
	setValue = (percent) => {				
		Animated.timing(this.state.aniValue, {
			toValue:percent,
			duration:3000,
			useNativeDriver:true
		}).start();
	}
	render() {
		const {startX,startY,startY2} = this.props;
		return (
			<>
			 <Line ref={ref => this.lineFive = ref} x1={startX} y1={startY} x2={startX} y2={startY} stroke={progress} strokeWidth={6} />
			 <Image
			    x={startX - 15}
			    y={startY - 18}
			    width={30}
			    height={50}
			    ref={ref => this.rider = ref}			    
			    href={DownMan}				    
			 />
			</>
		)
	}
}

const s = StyleSheet.create({
 vh:{position:'absolute',top:6,right:0,width:50,height:50,justifyContent:'center',alignItems:'center'}
})