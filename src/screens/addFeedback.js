import React, {Component} from 'react';
import {
	View,
	Text,
	TextInput,
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
export default class AddFeedback extends Component {
	constructor(props){
		super(props)
		this.state = {
			feedbackTypes:[],
			text:'',
			type:undefined,
			typeTxt:undefined,
			busy:false
		}
	}
	
	componentDidMount(){
		const types = this.props.route.params.types;
		const feedbackTypes = []; 
		for(const type of types){
			const {value, id} = type;
			feedbackTypes.push({type:0, value, id})
		}
		feedbackTypes.push({type:0, value:'Other', id:''})
		this.setState({
			typeTxt:undefined,
			feedbackTypes,
			busy:false
		});
	}

	textChange = (text) => this.setState({text});

	submit = async () => {
		try {
			const {type, text} = this.state;
			if(type == undefined){
				ToastAndroid.show('Please Select Type!', ToastAndroid.SHORT);
				return
			}else if(request.isBlank(text)){
				ToastAndroid.show('Please Enter Feedback!', ToastAndroid.SHORT);
				return
			}else if(text.length < 5){
				ToastAndroid.show('Feedback too short!', ToastAndroid.SHORT);
				return
			}
			this.setState({busy:true});
			const Feedback = Parse.Object.extend(helper.tbls.FB);
			const feedback = new Feedback();
			feedback.set("user_id", user_id);
			feedback.set("text", text);
			feedback.set("replies", []);
			feedback.set("status", helper.FB_CREATED);
			if(type != '')feedback.set("type", type);
			await feedback.save();
			this.setState({busy:false}, () => {
				this.props.navigation.goBack();
				ToastAndroid.show('Feedback Submitted Successfully!', ToastAndroid.SHORT);
			});
		}catch(err){
			console.log(err)
			ToastAndroid.show('Unable To Add Feedback', ToastAndroid.SHORT);
			return
		}
	}

	selectPicker = () => {
		const values = this.state.feedbackTypes;
		RNSelectionMenu.Show({
			values,
			selectedValues: ["One"],
			selectionType: 0,
			presentationType: 1,
			enableSearch: false,
			theme:1,
			title:'Select Feedback Types',
			subtitle:'Below are the feedback types select from them',
			onSelection: value => {
				const item = values.find(v => v.value == value);
				if(item != undefined){
					this.setState({
						typeTxt:item.value,
						type:item.id
					})
				}
			}
		});
	}

	render(){
		const {
			typeTxt,
			busy
		} = this.state;
		const pickerTxt = typeTxt == undefined ? 'Type' : typeTxt;
		const color = typeTxt == undefined ? helper.grey : helper.primaryColor;
		return (
			<View style={s.main}>
			 <View style={s.header.main}>
			  <TouchableOpacity onPress={this.back} style={s.header.icn}>
			   <Icon name={lang.arwbck} color={helper.white} size={30}  />
			  </TouchableOpacity>
			  <Text style={s.header.txt}>Add New Feedback</Text>
			 </View>
			 <TouchableOpacity onPress={this.selectPicker} style={s.picker.main}>
			  <Text style={[s.picker.txt, {color}]}>{pickerTxt}</Text>
			  <View style={s.picker.arrow}>
			   <Icon name={lang.cvd} color={helper.primaryColor} size={20}  />
			  </View>
			 </TouchableOpacity>
			 <TextInput onChangeText={this.textChange} style={s.input} multiline placeholderTextColor={helper.borderColor} placeholder="Please Write Your Feedback in Brief!" />
			 <View style={{height:6}} />
			 <TouchableOpacity style={s.btn} onPress={this.submit}>
			  <Text style={s.btnTxt}>SUBMIT</Text>
			 </TouchableOpacity>
			 <LoadingModal visible={busy} />
			</View>
		)
	}
}

const s = {
	main:{
		height:'100%',
		width:'100%',
		backgroundColor:helper.bgColor
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
			fontWeight:'bold',
			width:'60%'
		},
		main:{
			height:50,
			width:'100%',
			elevation:24,
			backgroundColor:helper.primaryColor,
			flexDirection:"row",
			alignItems:'center'
		}
	},
	picker:{
		main:{
			width:'95%',
			height:45,
			backgroundColor:helper.white,
			borderRadius:10,
			elevation:24,
			alignSelf:'center',
			marginVertical:6,
			justifyContent:'center'
		},
		txt:{
			fontSize:18,
			paddingLeft:10
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
	input:{
		flex:1,
		width:'95%',
		elevation:24,
		padding:10,
		borderRadius:10,
		backgroundColor:helper.white,
		fontSize:16,
		color:helper.blk,
		alignSelf:'center',
		textAlignVertical: "top"
	},
	btn:{
		width:'95%',
		elevation:24,
		height:50,
		borderRadius:10,
		marginBottom:10,
		alignSelf:'center',
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:helper.primaryColor
	},
	btnTxt:{
		fontSize:17,
		color:helper.white,
		width:'100%',
		textAlign:'center',
		fontWeight:'bold'
	}
}