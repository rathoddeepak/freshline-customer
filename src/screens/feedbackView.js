import React, {Component} from 'react';
import {
	View,
	Text,
	ScrollView,
	ToastAndroid,
	TouchableOpacity
} from 'react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Icon from 'components/icon';
import LoadingModal from 'components/loadingModal';
import Parse from 'parse/react-native';
import { RNSelectionMenu } from 'react-native-selection-menu';
import request from 'libs/request';
export default class FeedbackView extends Component {
	constructor(props){
		super(props)
		this.state = {
			title:[],
			text:'',
			type:undefined,
			typeTxt:undefined,
			busy:false,
			replies:[]
		}
	}
	
	componentDidMount(){
		const data = this.props.route.params;
		this.setState({
			typeTxt:data.type,
			id:data.id,
			time:data.time
		}, this.loadData);
	}

	loadData = async () => {
		try {
			this.setState({busy:true});
			const query = new Parse.Query(helper.tbls.FB);
			const data = await query.get(this.state.id);
			const {id, attributes: {text, replies, status}} = data;
			this.setState({
				text,
				replies:replies == undefined ? [] : replies,
				status,
				busy:false
			})
		}catch(err){
			alert(err)
			this.setState({busy:false});
			this.props.navigation.goBack();			
			ToastAndroid.show('Unable To Load Feedback', ToastAndroid.SHORT);
			return
		}
	}

	render(){
		const {
			replies,
			typeTxt,
			text,
			time
		} = this.state;
		return (
			<View style={s.main}>
			 <View style={s.header.main}>
			  <TouchableOpacity onPress={this.back} style={s.header.icn}>
			   <Icon name={lang.arwbck} color={helper.white} size={30}  />
			  </TouchableOpacity>
			  <View style={{width:'60%'}}>
				  <Text style={s.header.txt}>{typeTxt}</Text>
				  <Text style={s.header.time}>{time}</Text>
			  </View>
			 </View>
			 <ScrollView><View style={{marginBottom:20}}>
				 <Text style={[s.text, {marginLeft:7,marginTop:10}]}>Feedback:</Text>
				 <View style={s.textCont}>
				  <Text style={s.text}>{text}</Text>
				 </View>
				 {replies.map(this.renderReply)}

			 </View></ScrollView>
			</View>
		)
	}

	renderReply = (reply) => {
		return (
			<View style={s.reply}>
			  <View style={s.arrow} />
			  <View style={s.replyBox}>
			   <Text style={s.replyTxt}>{reply}</Text>
			  </View>
			</View>
		)
	}
}

const s = {
	main:{
		height:'100%',
		width:'100%',
		backgroundColor:helper.homeBgColor
	},
	header:{
		icn:{
			width:40,
			height:50,
			justifyContent:'center',
			alignItems:'center'
		},
		txt:{
			fontSize:18,
			color:helper.white,
			marginLeft:10,
			width:'100%'
		},
		time:{
			fontSize:12,
			color:helper.white,
			marginLeft:10,
			width:'100%'
		},
		main:{
			height:55,
			width:'100%',
			elevation:24,
			backgroundColor:helper.primaryColor,
			flexDirection:"row",
			alignItems:'center'
		}
	},
	picker:{
		main:{
			width:'98%',
			height:45,
			borderWidth:1,
			borderColor:helper.borderColor,
			alignSelf:'center',
			marginVertical:6,
			justifyContent:'center'
		},
		txt:{
			fontSize:18,
			marginLeft:5
		},
		arrow:{
			width:50,
			height:50,
			justifyContent:'center',
			alignItems:'center',
			position:'absolute',
			right:0
		}
	},
	textCont:{
		width:'95%',
		borderRadius:10,
		backgroundColor:helper.white,
		elevation:12,
		alignSelf:'center',
		padding:10,
		marginVertical:10
	},
	text:{
		fontSize:16,
		color:helper.blk,
		width:'100%'
	},
	btn:{
		width:'100%',
		height:50,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:helper.borderColor
	},
	btnTxt:{
		fontSize:17,
		color:helper.primaryColor,
		width:'100%',
		textAlign:'center',
		fontWeight:'bold'
	},
	reply:{
		flexDirection:'row',
		marginLeft:10,
		paddingBottom:10,
	},
	replyBox:{
		width:'90%',
		justifyContent:'center',
		alignItems:'center',
		borderRadius:10,
		padding:10,
		top:10,
		elevation:12,
		backgroundColor:helper.white
	},
	replyTxt:{
		fontSize:14,
		width:'100%',
		marginLeft:10,
		color:helper.grey
	},
	arrow:{
		height:25,
		width:30,
		borderBottomWidth:2,
		borderLeftWidth:2,
		borderColor:helper.primaryColor
	}
}