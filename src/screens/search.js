import React, { Component } from 'react';
import {
	View,
	Text,	
	FlatList,
	Animated,	
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	ImageBackground,
	RefreshControl,
	ActivityIndicator,
	PermissionsAndroid,
	ToastAndroid,
	TextInput
} from 'react-native';
import request from 'libs/request';
import helper from 'assets/helper';
import {
	Image,
	Icon
	//Button,
} from 'components';
import recentDB from 'libs/recents';
import lang from 'assets/lang';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import VoiceText from 'components/voiceText';
import Parse from 'parse/react-native';
const RECENT_SEARCH = 0;
const TRENDING_SEARCH = 1;
const SEARCH_RESULT = 3;
export default class Search extends Component {
	constructor(props){
		super(props)
		this.state = {
			suggestions:[],
			searchKey:'',
			results:[],
			reset:false,
			recents:[],
			trending:[]
		}
		this.timeoutInterval = null
		this.focus = null;
	}

	componentDidMount(){
		this.focus = this.props.navigation.addListener('focus', () => {
			this.setData();
		});
		this.loadTrendings();
	}


	loadTrendings = async () => {
		try {
			const tdQuery = new Parse.Query(helper.tbls.TD);
			const trendList = await tdQuery.find();
			const trending = [];
			for(let trend of trendList){
				const {id, attributes: {text}} = trend;
				trending.push({
					id,
					text
				})
			}
			this.setState({trending,reset:!this.state.reset})
		}catch(err){
			alert(err)
		}
	}

	componentWillUnmount(){
		if(this.focus != null)this.focus();
	}

	setData = () => {
		recentDB.getRecents(recents => {
			this.setState({recents,reset:!this.state.reset});
		});
		setTimeout(() => {
			this.input.focus();
		}, 500);
	}

	removeRecent = (id, index) => {
		let recents = this.state.recents;
		recents.splice(index, 1);
		recentDB.removeRecent(id)
		this.setState({recents,reset:!this.state.reset});
	}

	handleChangeText = (searchKey) => {
		if(this.timeoutInterval != null){
			clearTimeout(this.timeoutInterval)
			this.timeoutInterval = null;
		}
		this.setState({searchKey}, () => {
			if(searchKey.length == 0){
				this.setState({results:[]});
				return
			}
			this.timeoutInterval = setTimeout(() => {
				this.loadSuggestions();
			}, 400);
		});
	}

	loadSuggestions = () => {
		const searchKey = this.state.searchKey;
		if(request.isBlank(searchKey)){
			return
		}
		Parse.Cloud.run("searchKeywords", {searchKey}).then(({data, status}) => {
			if(status == 200){
				this.setState({results:data})
			}
		}).catch(err => {

		})
	}

	handleKeyPress = (data, type) => {
		if(type == RECENT_SEARCH){
			this.props.navigation.navigate("ProductList", {
				searchKey:data.text
			})
		}else if(type == SEARCH_RESULT){
			this.addToRecent(data.text)
			if(data.type == 0){
				this.props.navigation.navigate("ProductList", {
					searchKey:data.text
				})
			}else if(data.type == 1){
	    		this.props.navigation.navigate('CategoryView', {
					parentCat:{id:data.id, name:data.text}
				});
	    	}else if(data.type == 2){
	    		this.props.navigation.navigate('CategoryView', {
					subCatId:data.id,
					parentCat:{id:data.parent_cat, name:''}
				});
	    	}
		}
	}

	handleSubmit = () => {
		const searchKey = this.state.searchKey;
		if(request.isBlank(searchKey)){
			ToastAndroid.show("Please Enter Product Name...", ToastAndroid.SHORT);
			return;
		}
		this.addToRecent(searchKey, () => {
			this.props.navigation.navigate('ProductList', {searchKey})
		})
	}

	addToRecent = (text, callback) => {
		let recents = this.state.recents;		
		if(recents.findIndex(i => i.text == text) == -1){
			recents.push({text});
			let deleteLast = false;
			deleteLast = recents.length >= 5;
			recentDB.addRecent(text, deleteLast);
			this.setState({recents}, () => {
				if(callback != null)callback()
			});
		}else{
			if(callback != null)callback()
		}
	}

	render(){
		const {
			results,
			reset
		} = this.state;
		return (
			<View style={s.main}>
			 {this.renderSearchBar()}
			 <FlatList
			  data={results}
			  extraData={!reset}
			  renderItem={this.renderItem}
			  ListFooterComponent={this.renderFooter}
			 />
			 <VoiceText ref={ref => this.voiceText = ref} />	 
			</View>
		)
	}

	renderItem = ({item, index}) => {
		return this.renderResult(item, index, SEARCH_RESULT)
	}

	renderFooter = () => {
		const {results, recents, trending} = this.state
		if(results.length != 0){
			return <View />
		}
		return (
			<>
			 {recents.map((data, index) => {
			 	return this.renderResult(data, index, RECENT_SEARCH)
			 })}
			 {recents.length > 0 ? <View style={s.hr} /> : null}
			 {trending.map((data, index) => {
			 	return this.renderResult(data, index, TRENDING_SEARCH)
			 })}
			</>
		)
	}

	startSpeech = () => {
		this.voiceText.start(searchKey => {
			if(searchKey.length > 0)this.props.navigation.navigate('ProductList', {searchKey})
		})
	}

	handleSubmitAction(isMic){
		if(isMic == true){
			this.startSpeech();
		}else{
			this.handleSubmit();
		}
	}

	renderSearchBar = () => {
		const {
			searchKey
		} = this.state;
		const isMic = searchKey.length == 0;
		return (
			<TouchableOpacity onPress={this.searchNav} activeOpacity={0.7} style={s.searchBody}><View style={s.searchBar}>
			 <View style={{width:40,height:45,justifyContent:'center',alignItems:'center'}}>
			  <Icon name={lang.srch} color={helper.grey} size={24} />
			 </View>
			 <View style={{justifyContent:'center',flex:1}}>
			  <TextInput ref={ref => this.input = ref} onSubmitEditing={this.handleSubmit} placeholderTextColor={helper.grey} placeholder="Search for Products, Brands and more..." selectionColor={helper.primaryColor} style={s.input} value={searchKey} onChangeText={this.handleChangeText} />
			 </View>
			 <TouchableOpacity activeOpacity={0.7} onPress={() => this.handleSubmitAction(isMic)} style={{width:40,height:45,justifyContent:'center',alignItems:'center'}}>
			  <Icon name={isMic ? lang.mc : lang.arwfrw} color={helper.primaryColor} size={24} />
			 </TouchableOpacity>
			</View>
			</TouchableOpacity>
		)
	}

	renderResult = (data, index, type) => {
		const icon = getIcon(type);
		const typeText = getText(data.type);
		const color = helper.primaryColor
		return (
			<TouchableOpacity style={s.result} key={index} onPress={() => this.handleKeyPress(data, type)}>
			 <View style={s.icon}>
			  <Icon name={icon} size={25} color={color} />
			 </View>
			 <View style={s.textCont}>
			  <Text style={{color,fontSize:18}}>{data.text}</Text>
			  {data.type == undefined ? null : 
					<Text style={s.subTxt}>{typeText}</Text>
				}
			 </View>
			 {type == RECENT_SEARCH ? <TouchableOpacity onPress={() => this.removeRecent(data.id, index)} style={s.icon}>
			  <Icon name={'trash'} size={25} color={helper.grey} />
			 </TouchableOpacity> : null}
			</TouchableOpacity>
		)
	}
}

function getIcon(type) {
	switch(type){
		case RECENT_SEARCH:
		return 'recent';
		case TRENDING_SEARCH:
		return 'trend';
		case SEARCH_RESULT:
		return 'upright';
		default:
		return ''
	}
}

function getText(type) {
	switch(type){
		case 0:
		return 'PRODUCT';
		case 1:
		case 2:
		return 'CATEGORY'
		default:
		return ''
	}
}

const s = {
	searchBody:{width:'100%',height:80,justifyContent:'center',backgroundColor:helper.primaryColor},
	searchBar:{borderRadius:10,width:'95%',height:45,alignSelf:'center',backgroundColor:helper.white,elevation:24,flexDirection:'row'},
	textCont:{
		flex:1,
		justifyContent:'center'
	},
	subTxt:{
		color:helper.grey,
		fontSize:12,
		marginTop:3
	},
	icon:{
		justifyContent:'center',
		alignItems:'center',
		width:50,
		height:50
	},
	main:{
		backgroundColor:helper.homeBgColor,
		height:'100%',
		width:'100%'
	},
	hr:{
		marginVertical:20,
		backgroundColor:helper.borderColor,
		height:2,
		width:'100%',
	},
	result:{
		width:'100%',
		minHeight:50,
		flexDirection:'row',
		alignItems:'center'
	},
	input:{color:helper.primaryColor,fontSize:18},
}