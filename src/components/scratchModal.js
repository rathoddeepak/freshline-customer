import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	TouchableOpacity
} from 'react-native';
import LottieView from 'lottie-react-native';
import ScratchView from 'react-native-scratch';
import helper from 'assets/helper';
import {View as AniView} from 'react-native-animatable';
import lang from 'assets/lang';
import Icon from './icon';

const cardSize = helper.width * 80 / 100;
const anim = require('assets/anims/success.json');

export default class ScratchModal extends Component {
	constructor(props){
		super(props)
		this.state = {
			coins:10,
			v1:false,
			v2:false
		}
		this.callback = null;
	}
	// componentDidMount () {
	// 	this.show(10, null)
	// }
	onImageLoadFinished = (data) => {
		
	}
	show = (coins, cb) => {
		this.setState({coins, v1:true}, () => {
			setTimeout(() => {
				this.setState({v2:true,v1:false})
			}, 2000)
		})
		this.callback = cb;
	}
	handleClose = () => {
		this.setState({v2:false}, () => {
				this.callback();
			if(this.callback != null){
				setTimeout(() => {
					this.callback = null;
				}, 100)
			}
		})		
	}
	onScratchDone = () => {
		this.dataView.fadeIn();
		this.btnForward.transitionTo({opacity:1})
		if(this.state.coins > 0){
			setTimeout(() => {
				this.scratchView.tada();
			}, 500)
			setTimeout(() => {
				this.animation.play()
			}, 800)
		}
	}
	render () {
		const {
			coins,
			v1,
			v2
		} = this.state;
		return (
			<>
				<Modal visible={v2} transparent animationType="fade">
				 <View style={s.main}>
				  <Text style={s.nextTitle}>YAY! You Won A Scratch Card!</Text>
				  <AniView style={s.card} ref={ref => this.scratchView = ref} duration={500} animation="zoomIn">				    
				    <AniView style={s.content} ref={ref => this.dataView = ref} animation="fadeOut" duration={700}>
				     {coins == 0 
					     ? this.renderBetterLuck()
					     : this.renderWin(coins)
				     }
				    </AniView>
				    <ScratchView
						brushSize={30}
						threshold={30}
						fadeOut={true}
						loop={false}
						resourceName="scratchcard"
						placeholderColor="#AAAAAA"
						onImageLoadFinished={this.onImageLoadFinished}
						onScratchDone={this.onScratchDone}
					/>
				  </AniView>
				  <AniView ref={ref => this.btnForward = ref} style={{opacity:0}} ><TouchableOpacity onPress={this.handleClose} style={s.bottomButton}>
					<Icon name={lang.arwfrw} color={helper.white} size={25} />
				  </TouchableOpacity></AniView>
				 </View>
				</Modal>

				<Modal visible={v1} transparent animationType="fade"><View style={helper.model}>
					<LottieView				    
					    loop={false}				   
					    autoPlay
						style={{width:250,height:250}}
						source={anim}
					/>
				</View></Modal>
			</>
		)
	}
	renderBetterLuck = () => {
		return (
			<View style={s.innerCover}>
			 <View style={s.noLuckCircle}>
			  <Text style={s.exlam}>!</Text>
			 </View>
			 <View style={[s.bottomCover, {position:'absolute',bottom:0}]}>
		      <Text style={s.noLuck}>Better Luck Next Time</Text>
		     </View>			 
			</View>
		)
	}
	renderWin = (coins) => {
		return (
			<View style={s.innerCover}>
			 <LottieView	
			    autoPlay={false}	 
			    loop={false}       
		        ref={ref => this.animation = ref}		        
		        style={{width:150,height:130,transform:[{scale:1.1}],alignSelf:'center'}}
		        source={require('assets/anims/wincoin.json')}
		     />
		     <Text style={s.winData}>You've Won {lang.rp}{coins}</Text>
		     <Text style={s.desc}>Amount will be credited to your wallet once your order is delivered!</Text>
		     <TouchableOpacity onPress={this.handleClose} style={s.bottomCover}>
		      <Text style={s.bottomText}>YAY, Thanks!</Text>
		     </TouchableOpacity>
			</View>
		)
	}
}

const s = {
	innerCover:{borderWidth:2,borderRadius:20,borderColor:helper.primaryColor,width:cardSize,height:cardSize,justifyContent:'center',alignItems:'center',backgroundColor:helper.secondaryColor},
	bottomCover:{width:'100%',height:45,marginTop:20,backgroundColor:helper.primaryColor,justifyContent:'center',alignItems:'center'},
	bottomText:{fontFamily:'sans-serif-medium',fontSize:22,color:helper.white,fontWeight:'bold'},
	nextTitle:{
		fontSize:18,
		color:helper.white,
		fontWeight:'bold',
		width:'100%',
		textAlign:'center',
		marginBottom:20
	},
	bottomButton:{width:40,height:40,backgroundColor:helper.primaryColor,justifyContent:'center',alignItems:'center',borderRadius:100,marginTop:70,elevation:20},
	exlam:{
		fontSize:80,
		color:helper.secondaryColor,
		fontWeight:'bold',
		fontFamily:'sans-serif-medium'
	},
	noLuckCircle:{
		height:130,
		width:130,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:helper.primaryColor,
		borderRadius:100,
		justifyContent:'center',
		alignItems:'center',
		marginBottom:10
	},
	content:{
		width:'100%',
		height:'100%',
		justifyContent:'center',
		alignItems:'center',
	},
	noLuck:{
		fontSize:20,
		fontFamily:'sans-serif-medium',
		color:helper.white,
		textAlign:'center'
	},
	winData:{
		fontSize:27,
		color:helper.primaryColor,
		marginTop:8,
		marginBottom:4,
		width:'100%',
		fontWeight:'bold',
		textAlign:'center',		
		fontFamily:'sans-serif-medium'
	},
	desc:{
		fontSize:13,
		color:helper.primaryColor,
		width:'100%',
		textAlign:'center',
		marginBottom:10
	},
	main : {
		backgroundColor: '#000000b4',
		height:'100%',
		width:'100%',
		justifyContent:'center',
		alignItems:'center'
	},
	card:{
		width:cardSize,
		height:cardSize,
		borderRadius:20,
		overflow:'hidden',
		backgroundColor:helper.white,
		elevation:24		
	}
}