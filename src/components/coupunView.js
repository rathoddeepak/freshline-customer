import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	TouchableOpacity
} from 'react-native';
import Image from './image';
import helper from 'assets/helper';
import lang from 'assets/lang';
import {View as AniView} from 'react-native-animatable';

export default class CoupunView extends Component {
	constructor(props){
		super(props)
		this.state = {			
			v:false
		}
	}
	show = (data) => {
		data.v = true;
		this.setState(data);
	}
	close = () => this.setState({v:false})
	render(){
		const {
			thumb,
			hash,
			title,
			desc,
			min_order,
			max_discount,
			type,
			amount,
			percent,
			v
		} = this.state;
		const image = helper.validUrl(thumb);
		return (
			<Modal animationType="fade" visible={v} transparent onRequestClose={this.close}><View style={helper.model}>
				<AniView duration={500} animation="zoomIn" style={s.cont}>
				    <Image
					 source={{uri:image}}
					 hash={hash}
					 sty={s.img}
					 resizeMode="cover"
					 imgSty={{width:100,height:100}}
					 borderRadius={100}
					/>
					{this.renderMain(type, amount, percent)}
					<Text style={s.title}>{title}</Text>
					<Text style={s.desc}>{desc}</Text>
					<Text style={s.desc}>Minimum Order Value: {min_order}</Text>
					<Text style={s.desc}>Maximum Discount: {max_discount}</Text>

					<Text style={[s.desc, {fontWeight:'bold',fontSize:17,color:helper.primaryColor}]}>You can apply it from cart!</Text>

					<TouchableOpacity onPress={this.close} style={s.bottomButton}>
					 <Text style={s.btnTxt}>Okay, Got it!</Text>
					</TouchableOpacity>
				</AniView>
			</View></Modal>
		)
	}

	renderMain = (type, amount, percent) => {
		if(type == helper.DISCOUNT_TYPE_AMOUNT){
			return (
				<Text style={s.mainTxt}>Upto {lang.rp}{amount} OFF</Text>
			)
		}else{
			return (
				<Text style={s.mainTxt}>Upto {percent}% OFF</Text>
			)
		}
	}
}


const s = {
	mainTxt:{
		width:'90%',
		fontSize:22,
		color:helper.blk,
		fontWeight:'bold',
		marginTop:7
	},
	title:{
		fontSize:17,
		width:'90%',
		marginTop:5,
		marginBottom:3,
		color:helper.grey2
	},
	desc:{
		fontSize:13,
		width:'90%',
		marginBottom:2,
		color:helper.grey,
	},
	img:{width:100,height:100,marginTop:10,marginBottom:10,elevation:24,backgroundColor:helper.grey},
	cont : {
		width:300,
		paddingTop:10,
		backgroundColor:helper.white,
		elevation:24,
		borderRadius:20,
		borderWidth:2,
		borderColor:helper.primaryColor,
		alignItems:'center'
	},
	bottomButton:{
		height:50,
		width:'100%',
		justifyContent:'center',
		backgroundColor:helper.primaryColor,
		borderBottomRightRadius:10,
		borderBottomLeftRadius:10,
		marginTop:15
	},
	btnTxt:{
		fontSize:20,
		width:'100%',
		textAlign:'center',
		color:helper.white,
		fontWeight:'bold',
		fontFamily:'sans-serif-medium'
	}
}