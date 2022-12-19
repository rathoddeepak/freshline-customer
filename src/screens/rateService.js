import React, { Component } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	ScrollView,
	ToastAndroid,
	TouchableOpacity,
	Image,
	DeviceEventEmitter
} from 'react-native';

import {
	HeuButton,
	Icon,
	LoadingModal,
	ClapModel
} from 'components';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
import Parse from 'parse/react-native';
const rates = [1,2,3,4,5];
const dimColor = '#E8F8FF';
export default class RateService extends Component {
	constructor(props) {
		super(props);
		this.state = {
			current:0,			
			feedback:'',
			busy:false,
			features:[],
			rating_id:false
		}
	}
	componentDidMount() {
		let {task_id, rating_id, rateTags} = this.props.route.params;
		const features = [];
		for(let tag of rateTags){
			features.push({
				id:tag.id,
				name:tag.name,
				selected:false
			})
		}
		this.setState({task_id, rating_id, features}, () => {
			if(rating_id != false){
				this.loadRatingData();
			}
		})
	}
	submit = async () => {
		const {features, feedback, task_id, current} = this.state;
		const tags = [];
		for(let feature of features){
			if(feature.selected == true){
				tags.push(feature.id);
			}
		}
		if(current == 0){
			ToastAndroid.show('Please Select Rating!', ToastAndroid.SHORT);
			return;
		}
		this.setState({busy:true});		
		Parse.Cloud.run('addOrderRating', {
			tags,
			feedback:request.removeSpaces(feedback),
			task_id,
			user_id,
			rating:current
		}).then(({status, data}) => {
			this.setState({busy:false});
			if(status == 200){			   
			   this.clapModel.clap();		   
			   setTimeout(() => {
				   this.props.navigation.goBack();
				   DeviceEventEmitter.emit(helper.RATE_ADDED_HOOK, {
				   	task_id,
				   	id:data,
				   	rating:current
				   });
			   }, 1200)
			   ToastAndroid.show('Thanks For You Special Time & Feedback! 🤗🤗', ToastAndroid.SHORT);
			}else{
			   ToastAndroid.show('Unable to submit rating!', ToastAndroid.SHORT);
			}		   
		}).catch(err => {
			this.setState({busy:false});
			ToastAndroid.show('Unable to submit rating!', ToastAndroid.SHORT);
		});
	}
	loadRatingData = () => {
		this.setState({busy:true});
		const query = new Parse.Query(helper.tbls.OR);
		query.get(this.state.rating_id).then(({id, attributes}) => {
		   let features = this.state.features;
		   for(let i = 0; i < features.length; i++){
		   	features[i].selected = attributes.tags.indexOf(features[i].id) != -1;
		   }
		   this.setState({
		   	busy:false,
		   	current:attributes.rating,
		   	feedback:attributes.feedback,
		   	features
		   });		   
		}).catch(err => {
			this.setState({busy:false});
			this.props.navigation.goBack();
			ToastAndroid.show('Unable to load data!', ToastAndroid.SHORT);
		});
	}
	handleItemPress = (index, selected) => {
		if(this.state.rating_id != false)return
		const features = this.state.features;
		features[index].selected = !selected;
		this.setState({selected});
	}
	navBack = () => this.props.navigation.goBack();
	setCurrent = (i) => {
		if(this.state.rating_id == false)
			this.setState({current:i})
	}
	render () {
		const {
			features,
			current,
			busy,
			feedback,
			rating_id
		} = this.state;
		const editable = rating_id == false;
		const disabled = current == 0;
		const buttonColor = current == 0 ? helper.secondaryColor : helper.primaryColor;
		return (
			<View style={s.main}>
				 <View style={s.header}>
					 <TouchableOpacity onPress={this.navBack} style={s.iconCont}>
					  <Icon name={'arw_back'} color={helper.white} size={25} />
					 </TouchableOpacity>
					 <Text style={s.title}>Feedback</Text>
				 </View>
				 <ScrollView><View style={{justifyContent:'center',flex:1,alignItems:'center'}}>
				    <View style={s.rateStarBox}>
				     <Text style={s.rateBoxTitle}>Rate Your Experience</Text>
				     <Text style={s.rateBoxDesc}>Are you satisfied width our service?</Text>
				     <View style={{width:'85%',justifyContent:'space-around',flexDirection:'row',marginVertical:9}}>
					   {rates.map((i) =>
					   	 <HeuButton key={i} onPress={() => this.setCurrent(i)} style={{width:50,height:50,justifyContent:'center'}}>
					   	  <Icon name={i <= current ? lang.str : lang.st2} color={helper.primaryColor} size={40}  />
						 </HeuButton>
					   )}
					 </View>
				    </View>

				    <View style={s.featureBox}>
				     <Text style={s.featureBoxTitle}>Tell us what can be improved?</Text>
				     <View style={s.featureRow}>
					   {features.map(this.renderFeature)}
					 </View>
					 <TextInput 
					  onChangeText={feedback => this.setState({feedback})} 
					  maxLength={550} 
					  multiline
					  value={feedback}
					  editable={editable}
					  placeholderTextColor={helper.primaryColor}
					  style={s.dataInput} 
					  placeholder="Write About Your Experience (Optional), But It Will Help Us To Improve Our Service..."
					 />
				    </View>				    				   
				 </View>				 
				</ScrollView>
				{editable ? <View style={s.footer}>
				 <TouchableOpacity onPress={this.submit} activeOpacity={0.8} style={[s.button, {backgroundColor:buttonColor}]} disabled={disabled}>
				  <Text style={s.buttonTxt}>Submit</Text>
				 </TouchableOpacity>
			    </View> : null}
			    <LoadingModal visible={busy} />
				<ClapModel ref={ref => this.clapModel = ref} />
			</View>
		);
	}

	renderFeature = ({selected, name}, index) => {
		const backgroundColor = selected ? helper.primaryColor : dimColor;
		const color = selected ? helper.white : helper.primaryColor;
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={() => this.handleItemPress(index, selected)} style={[s.feature, {backgroundColor}]}>
				<Text style={[s.featureName, {color}]}>{name}</Text>
			</TouchableOpacity>
		)
	}
}

const s = {
	button:{
		width:'90%',
		height:50,
		borderRadius:10,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:helper.primaryColor,
	},
	buttonTxt:{
		fontSize:20,
		color:helper.white
	},
	footer:{
		height:80,
		backgroundColor:helper.white,
		width:'100%',
		justifyContent:'center',
		alignItems:'center'
	},
	dataInput:{
		backgroundColor:dimColor,
		height:150,
		borderRadius:7,
		padding:10,
		textAlignVertical:'top',
		marginTop:10,
		borderWidth:1,
		borderColor:helper.primaryColor,
		width:'90%',
		alignSelf:'center',
		fontSize:14,
		color:helper.blk
	},
	feature:{
		padding:10,
		borderRadius:20,
		marginTop:10,
		marginRight:10,		
	},
	featureName:{
		fontSize:13,
		color:helper.white,
		textAlign:'center',
		fontFamily:'sans-serif-medium'
	},
	featureBox:{
		width:'100%',
		backgroundColor:helper.white,
		marginTop:10,
		paddingTop:6,		
		paddingBottom:15,
		justifyContent:'center'
	},
	featureBoxTitle:{
		fontSize:17,
		color:helper.primaryColor,
		marginLeft:10
	},
	featureRow:{
		flexDirection:'row',
		flexWrap:'wrap',
		width:'90%',
		alignSelf:'center',
		marginTop:6
	},
	rateStarBox:{
		width:'100%',
		backgroundColor:helper.white,
		marginTop:10,
		height:160,
		justifyContent:'center'
	},
	rateBoxTitle:{
		fontSize:22,
		color:helper.primaryColor,
		marginTop:10,
		marginLeft:10,
	},
	rateBoxDesc:{
		fontSize:13,
		color:'#95DDFF',
		marginTop:3,
		marginLeft:10
	},	
	main:{
		height:'100%',
		width:'100%',
		backgroundColor:'#F1F1F1',
		borderLeftWidth:3,
		borderRightWidth:3,
		borderColor:helper.primaryColor
	},
	header:{
		width:'100%',
		height:60,
		alignItems:'center',
		flexDirection:'row',
		backgroundColor:helper.primaryColor
	},
	iconCont:{
		width:60,
		height:60,
		justifyContent:'center',
		alignItems:'center'
	},
	title:{
		fontSize:20,
		width:100,
		color:helper.white		
	}	
}