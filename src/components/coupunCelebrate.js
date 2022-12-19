import React, {Component} from 'react'
import {
	View,
	Text,
	Modal,
	TouchableOpacity
} from 'react-native';
import LottieView from 'lottie-react-native';
import helper from 'assets/helper';
import Icon from './icon';
import {View as AniView} from 'react-native-animatable';
import lang from 'assets/lang';

const cardSize = helper.width * 80 / 100;
export default class CoupunCelebrate extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title:'',
			desc:'',
			v:false,
			text:''
		}
	}

	show = ({title, desc, type, amount, percent}) => {
		let wonText = ''
		if(type == helper.DISCOUNT_TYPE_AMOUNT){
			wonText = `${lang.rp}${amount}`
		}else{
			wonText = `${lang.percent}%`
		}
		wonText += ' OFF';
		this.setState({title, desc, wonText, v:true}, () => {
			setTimeout (() => {
				this.close()
			}, 3000) 
		})
	}

	close = () => this.setState({v:false});

	render () {
		const {
			wonText,
			title,
			desc,
			v
		} = this.state;
		return (
			<Modal visible={v} transparent onRequestClose={this.close} animationType="fade"><View style={s.main}>
			 <AniView style={s.container} duration={300} animation="zoomIn">
			  
			  <Icon name="star3" color={helper.white} size={80} style={{position:'absolute',top:-40}} />
			  <Icon name="discount" color={helper.green} size={40} style={{position:'absolute',top:-20}} />
			  
			  <Text style={s.wonTitle}>{wonText}</Text>

			  <Text style={s.title}>{title}</Text>
			  <Text style={s.desc}>{desc}</Text>

			  <TouchableOpacity onPress={this.close} style={s.footer}>
				  <Text style={s.footerTxt}>YAY!!</Text>
			  </TouchableOpacity>
			  <View pointerEvents="none" style={{position:'absolute',zIndex:100}}><LottieView		        
		        autoPlay
		        loop={false}
		        style={{width:'100%',height:'100%',alignSelf:'center'}}
		        source={require('assets/anims/celebrate.json')}
		     /></View>
			 </AniView>
			 
			</View></Modal>
		)
	}
}

const s = {
	footer:{
		width:'100%',
		height:50,
		borderBottomLeftRadius:18,
		borderBottomRightRadius:18,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:helper.primaryColor,
		position:'absolute',
		bottom:0
	},
	footerTxt:{
		fontSize:22,
		color:helper.white,
		fontWeight:'bold',
		width:'100%',
		textAlign:'center',
		fontFamily:'sans-serif-medium'
	},
	celeb:{
		fontSize:18,
		color:helper.primaryColor,
		marginTop:15,
		fontWeight:'bold'
	},
	main : {
		backgroundColor:'#000000b4',
		width:'100%',
		height:'100%',
		justifyContent:'center',
		alignItems:'center'
	},
	container : {
		borderWidth:2,
		borderColor:helper.primaryColor,
		backgroundColor:helper.white,
		borderRadius:20,
		elevation:24,
		width:cardSize,
		height:cardSize,
		justifyContent:'center',
		alignItems:'center'		
	},
	title : {
		fontSize:18,
		color:helper.blk,
		fontWeight:'bold',
		width:'100%',
		marginTop:10,
		textAlign:'center',
		marginBottom:5
	},
	desc : {
		fontSize:15,
		width:'100%',
		textAlign:'center',
		color:helper.grey
	},
	wonTitle:{
		fontSize:50,
		color:helper.primaryColor,
		fontWeight:'bold',
		width:'100%',
		marginTop:10,
		textAlign:'center',
		marginBottom:5
	}
}