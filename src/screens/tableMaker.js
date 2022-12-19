import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,	
	ScrollView	
} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {Text as AniText} from 'react-native-animatable';
import helper from 'assets/helper';
import lang from 'assets/lang';
import {
	Icon,
	HeuButton,
	SButton,
	Button,
	Closed,
	Picker,
	CHeader
} from 'components';
const minWidth  = helper.width * 70 / 100;
const maxWidth  = helper.width * 80 / 100;
const minHeight = helper.height * 30 / 100;
const midHeight = helper.height * 40 / 100;
const leftX = maxWidth/2.2;
const rightX = -leftX;
const preLeftX = -maxWidth/4;
const fiveY = -minHeight/2.1;
const sixY = -(fiveY);

const CIRCLE = 1000;
const ROUND = 10;
const duration = 600;
const {
	Value,
	timing,	
} = Animated;

const formal = {
	duration:duration,
	easing:Easing.inOut(Easing.ease)
}
export default class TableMaker extends Component {
	constructor(props){
		super(props);
		this.state = {
			width:new Value(minWidth),
			height:new Value(minWidth),
			borderRadius:new Value(CIRCLE),
			morePeople:false,
			customActived:false,

			c1Y:new Value(-100),
			c1X:new Value(0),

			c2Y:new Value(100),
			c2X:new Value(0),
			
			c3X:new Value(0),

			c4X:new Value(0),

			c5Y:new Value(0),

			c6Y:new Value(0),

			currentChair:0
		}
		this.chair = []
	}
	componentDidMount(){
		this.setForOne();
		let {limitPeople, closed, open_time, sltav, table_booking, close_time, name, time_diff} = this.props.route.params;		
		if(sltav == 0){
			this.closed.show({
				name,
				text:'All Slots Full 😮, Please Check Later'
			})			
		}else if(closed){
			this.closed.show({
				name,
				open_time,
				close_time,
				hrs:time_diff.hrs,
				mins:time_diff.mins
			})
		}else if(table_booking != 1){
			this.closed.show({
				name,
				text:'Temporarily Closed, Please Check Later 😞'
			})			
		}else{
			if(limitPeople != undefined && limitPeople < 6){				
				for(let i = (limitPeople + 1); i < 7; i++)
					this.chair[i]?.tdisable(true);							
			}else if(limitPeople > 6){
				this.setState({morePeople:true}, () => {
					this.moreModal.setForNumeric(7, limitPeople);
				})			
			}
		}
		
	}
	setForOne = () => {
		timing(this.state.c1Y, {
			toValue:-40,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();
		this.setState({currentChair:1})
		this.chair[1].act(true);		
	}	
	startCustom = () => {
	    if(this.state.customActived){	    	
	    	this.animateChair(6);
	    	this.chair[6].act(true);
	    	return;
	    }
		this.moreModal.show(morePeople => {			
			if(morePeople){
				this.animateChair(6);
				this.setState({morePeople}, () => {					
					setTimeout(() => this.setState({customActived:true}), 100);
				});			    
			}else{
				this.morePeople.act(false)
			}
		});
	}
	handleSelect = () => {
		let params = this.props.route.params;
		const {currentChair, morePeople} = this.state;
		if(this.state.customActived)params['selectNumber'] = morePeople;
		else params['selectNumber'] = currentChair;
		this.props.navigation.navigate('FinalizeTable', params);
	}

	handleSelect = () => {
		let params = this.props.route.params;
		const {currentChair, morePeople} = this.state;
		if(this.state.customActived)params['selectNumber'] = morePeople;
		else params['selectNumber'] = currentChair;
		this.props.navigation.navigate('FinalizeTable', params);
	}

	animateChair = (toC, block = false) => {
		let fromC = this.state.currentChair;
		let morePeople = this.state.morePeople;
		let animations = [];
		let borderRadius = null;
		let width = null;
		let height = null;
		let c1X = null;

		let c2Y = null;
		let c2X = null;

		let c3X = null;

		let c4X = null;

		let c5Y = null;

		let c6Y = null;
		//BorderRadius Part		
		if(toC >= 3 && fromC < 3)borderRadius = ROUND;
		else if(toC <= 2 && fromC > 2)borderRadius = CIRCLE;
		if(borderRadius != null)animations.push(
			timing(this.state.borderRadius, {toValue:borderRadius,...formal})
		);

		//Width And Height Part	
		if(fromC < 4 && toC >=4){
			width = maxWidth;
			height = minHeight;
		}else if(fromC >= 4 && toC == 3){
			width = minWidth;
			height = midHeight;
		}else if(fromC >= 4 && toC == 2){			
			height = maxWidth;
		}else if(fromC >= 4 && toC == 1){			
			width = minWidth;
			height = minWidth;
		}else if(fromC == 3 && toC == 2){
			width = maxWidth;
			height = maxWidth;
		}else if(fromC == 2 && toC == 3){
			width = minWidth;
			height = midHeight;
		}else if(fromC == 3 && toC == 1){			
			height = minWidth;
		}else if(fromC == 1 && toC == 3){
			height = midHeight;
		}else if(fromC == 2 && toC == 1){
			width = minWidth;
			height = minWidth;
		}else if(fromC == 1 && toC == 2){
			width = maxWidth;
			height = maxWidth;
		}

		if(width != null)animations.push(
			timing(this.state.width, {toValue:width,...formal})
		);
		if(height != null)animations.push(
			timing(this.state.height, {toValue:height,...formal})
		);

		//c1X Part
	    if(toC == 6)c1X = preLeftX;
	    else if(fromC == 6)c1X = 0;
	    if(c1X != null)animations.push(
			timing(this.state.c1X, {toValue:c1X,...formal})
		);

	    //c2X && c2Y Part
	    if(toC == 1)c2Y = 100;
	    else if(toC >= 2 && fromC == 1)c2Y = 40;
	    if(c2Y != null)animations.push(
			timing(this.state.c2Y, {toValue:c2Y,...formal})
		);
	    if(toC >= 5 && fromC < 5)c2X = preLeftX;
	    else if(toC < 5 && fromC >= 5)c2X = 0;
	    if(c2X != null)animations.push(
			timing(this.state.c2X, {toValue:c2X,...formal})
		);

	    //c3X Part
	    if(toC >= 3 && fromC < 3)c3X = leftX;
	    else if(toC < 3 && fromC >= 3)c3X = 0;
	    if(c3X != null)animations.push(
			timing(this.state.c3X, {toValue:c3X,...formal})
		);

	    //c4X Part
	    if(toC >= 4 && fromC < 4)c4X = rightX;
	    else if(toC < 4 && fromC >= 4)c4X = 0;
	    if(c4X != null)animations.push(
			timing(this.state.c4X, {toValue:c4X,...formal})
		);

	    //c5Y Part
	    if(toC >= 5 && fromC < 5)c5Y = fiveY;
	    else if(toC < 5 && fromC >= 5)c5Y = 0;
	    if(c5Y != null)animations.push(
			timing(this.state.c5Y, {toValue:c5Y,...formal})
		);

	    //c6Y Part
	    if(toC == 6)c6Y = sixY;
	    else if(fromC == 6)c6Y = 0;
	    if(c6Y != null)animations.push(
			timing(this.state.c6Y, {toValue:c6Y,...formal})
		);
	    if(this.state.customActived){
	    	this.customDisable();
	    }else {
	    	this.chair[fromC].act(false);
	    }
	    animations.forEach(anim => anim.start());
	    this.setState({currentChair:toC});
	}
	customDisable = () => {
		this.morePeople.act(false);
    	this.textRef.fadeOutUp();
    	setTimeout(() => {
    		this.setState({customActived:false});
    	}, 900);
	}
	onPhotos = () => {
		this.props.navigation.navigate('Photos', {id:this.props.route.params.id})
	}
	render() {
		const {
			//Table Related
			width,
			height,
			morePeople,
			borderRadius,
			customActived,
			//Chair Related			
			c1Y,
			c1X,

			c2X,
			c2Y,
			
			c3X,
			
			c4X,

			c5Y,

			c6Y
		} = this.state;

		return (
			 <View style={[helper.hldr, {justifyContent:'center',alignItems:'center'}]}>			     			      
			      {/*Chair 2*/}
			      <Animated.View style={[s.chair, {
				  	transform:[
				  	 {translateY:c2Y},
				  	 {translateX:c2X}
				  	]
				  }]}/>
				  
				  <Animated.View style={[{width,height,borderRadius}, s.table]}>
				  	{customActived ? 
				  		<AniText ref={ref => this.textRef = ref} animation="fadeIn" style={s.td}>
				  			6 + {Math.abs(6 - morePeople)} = {morePeople}
				  		</AniText>
				  	: null}
				  </Animated.View>
				  
				  {/*Chair 1*/}
				  <Animated.View style={[s.chair, {
				  	transform:[
				  	 {translateY:c1Y},
				  	 {translateX:c1X}
				  	]
				  }]}/>

				  {/*Chair 3*/}
				  <Animated.View style={[s.chair2, {
				  	transform:[				  	 
				  	 {translateX:c3X}
				  	]
				  }]}/>


				  {/*Chair 4*/}
				  <Animated.View style={[s.chair2, {
				  	transform:[				  	 
				  	 {translateX:c4X}
				  	]
				  }]}/>

				  {/*Chair 5*/}
				  <Animated.View style={[s.chair3, {
				  	transform:[				  	 
				  	 {translateX:maxWidth/4},//60
				  	 {translateY:c5Y}				  	
				  	]
				  }]}/>

				  {/*Chair 6*/}
				  <Animated.View style={[s.chair3, {
				  	transform:[				  	 
				  	 {translateX:maxWidth/4},//60
				  	 {translateY:c6Y}				  	
				  	]
				  }]}/>
				 <View style={s.ftr}>
				  <Text style={{margin:5,fontSize:16,color:helper.primaryColor,fontWeight:'bold'}}>{lang.z[cl].nm_ppl}</Text>
				  <ScrollView horizontal>				  	
					 <SButton toggle={false} ref={ref => this.chair[1] = ref } text={1} style={{margin:10,minWidth:40,height:40}} onPress={() => this.animateChair(1)} />
					 <SButton toggle={false} ref={ref => this.chair[2] = ref } text={2} style={{margin:10,minWidth:40,height:40}} onPress={() => this.animateChair(2)} />
					 <SButton toggle={false} ref={ref => this.chair[3] = ref } text={3} style={{margin:10,minWidth:40,height:40}} onPress={() => this.animateChair(3)} />
					 <SButton toggle={false} ref={ref => this.chair[4] = ref } text={4} style={{margin:10,minWidth:40,height:40}} onPress={() => this.animateChair(4)} />
					 <SButton toggle={false} ref={ref => this.chair[5] = ref } text={5} style={{margin:10,minWidth:40,height:40}} onPress={() => this.animateChair(5)} />
					 <SButton toggle={false} ref={ref => this.chair[6] = ref } text={6} style={{margin:10,minWidth:40,height:40}} onPress={() => this.animateChair(6)} />
					 {morePeople != false ? 
					 	<SButton ref={ref => this.morePeople = ref} text={`Custom`} style={{margin:10,minWidth:40,height:40}} onPress={this.startCustom} />
					 : null}
				  </ScrollView>
				 </View>
				 <View style={s.hdr}>
				 <CHeader text={lang.z[cl].slt_chrs} renderLeft={this.renderLeft}/>
				 </View>
				 <Picker ref={ref => this.moreModal = ref} title={lang.z[cl].slt_np} />
				 <Closed ref={ref => this.closed = ref} onClose={this.cls}/>
			 </View>
		)
	}
	cls = () => {
		this.props.navigation.goBack();
	}
	renderLeft = () => {
		return (
			<>
			    <Button
					text={'Photos'}
					size={14}
					br={30}
					style={{marginTop:4,marginRight:4,alignSelf:'center'}}					       
					onPress={this.onPhotos}
					hr={15}		       
				/>
				<HeuButton onPress={this.handleSelect} style={{width:50,height:40,justifyContent:'center',alignItems:'center'}}>				
					<Icon name={lang.chk} color={helper.primaryColor} size={30} />			    
				</HeuButton>
			</>
		)
	}
}
class MoreModal extends Component {
	render() {
		return (
			<Modal transparent onRequestClose={this.handleClose} animationType='fade'><View style={helper.model}>
				 <View style={{width:'90%',alignSelf:'center',backgroundColor:helper.grey4}}>
			</View></View></Modal>
		)
	}
}
const extra = {
	backgroundColor:'#FFED97',
	borderRadius:9,
	elevation:7
}
const s = StyleSheet.create({
	td:{fontSize:22,fontWeight:'bold',color:'white'},
	table:{
		borderWidth:3,
		borderColor:'#D0AA45',
		backgroundColor:'#896E4B',
		elevation:7,
		zIndex:10000,
		justifyContent:'center',
		alignItems:'center'
	},
	chair : {
		width:100,
		height:70,
		...extra
	},
	chair2 : {
		width:70,
		height:100,		
		position:'absolute',
		...extra
	},
	chair3:{
		width:100,
		height:70,		
		position:'absolute',
		...extra
	},
	plateO:{
		height:110,
		width:110,
		backgroundColor:helper.silver,
		elevation:5,
		borderRadius:220,
		alignItems:'center',
		justifyContent:'center',		
	},	
	ftr:{
		position:'absolute',
		bottom:0,
		width:'100%',
		backgroundColor:'black'
	},
	hdr:{
		position:'absolute',
		width:'100%',
		top:0
	}
});

/*setForTwo = () => {
		timing(this.state.width, {
			toValue:maxWidth,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();
		
		timing(this.state.height, {
			toValue:maxWidth,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();

		timing(this.state.c2Y, {
			toValue:40,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();

	}
	setForThree = () => {
	    timing(this.state.width, {
			toValue:minWidth,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();		
		timing(this.state.height, {
			toValue:midHeight,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();
		timing(this.state.borderRadius, {
			toValue:ROUND,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();

		timing(this.state.c3X, {
			toValue:leftX,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();
	}
	setForFour = () => {
		timing(this.state.width, {
			toValue:maxWidth,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();		
		timing(this.state.height, {
			toValue:minHeight,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();
		timing(this.state.c4X, {
			toValue:rightX,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();			
	}

	setForFive = () => {
		timing(this.state.c2X, {
			toValue:preLeftX,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();
		timing(this.state.c5Y, {
			toValue:fiveY,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();
	}

	setForSix = () => {
		timing(this.state.c1X, {
			toValue:preLeftX,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();
		timing(this.state.c6Y, {
			toValue:sixY,
			duration:duration,
			easing:Easing.inOut(Easing.ease)
		}).start();
	}*/