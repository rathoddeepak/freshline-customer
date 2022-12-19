import React, {Component} from 'react';
import {
	View,
	Text,
	FlatList,
	Image,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	RefreshControl,
	ScrollView
} from 'react-native';
import helper from 'assets/helper' ;
import {
	Picker,
	Button,
	LoadingModal
} from 'components';
import request from 'libs/request';
import FoodNot from 'components/foodNot';
const types = ['Starter', 'Main Course', 'Dessert'];
const vegs = ['Veg', 'Non Veg'];
export default class UpdateList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy:false,
			catList:[],
			foodList:[],
			page:1
		}
	}
	
	componentDidMount() {
		this.loadData();
	}
	
	catHandle = (index, item) => {
		let cats = [];
		this.state.catList.forEach(cat => {
			cats.push(cat.name);
		});
		this.moreModal.setForValues(cats);		
		setTimeout(() => {
			this.moreModal.show((data, idx) => {			
				let cat_id = this.state.catList[idx].id;
				let foodList = this.state.foodList;
				foodList[index].cat = cat_id;
				this.setState({foodList})
			});
		}, 100);
	}

	typeHandle = (index, item) => {		
		this.moreModal.setForValues(types);		
		setTimeout(() => {
			this.moreModal.show((data, idx) => {
				let foodList = this.state.foodList;
				foodList[index].type = idx;
				this.setState({foodList})
			});
		}, 100);
	}
	
	vegHandle = (index, item) => {
	    this.moreModal.setForValues(vegs);		
		setTimeout(() => {
			this.moreModal.show((data, idx) => {
				let foodList = this.state.foodList;
				foodList[index].veg = idx;				
				this.setState({foodList})
			});
		}, 100);
	}
	
	loadData = async () => {
		let offset = (this.state.page - 1) * 20;
		this.setState({busy:true})		
		var res = await request.perform('temp', {
			req:'get_list',
			offset
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){
			this.setState({foodList:res.data.food_list, catList:res.data.categories});
		}
	}

	submit = async () => {
		this.setState({busy:true});	
		let foodList = [];
		this.state.foodList.forEach(food => {
			foodList.push({
				id:food.id,
				type:food.type,
				veg:food.veg,
				cat:food.cat
			})
		})
		var res = await request.perform('temp', {
			req:'update_list',
			foodList:JSON.stringify(foodList)
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){			
			ToastAndroid.show('Updated Successfully', ToastAndroid.SHORT);
		}
	}

	render() {
		const {
			foodList,
			busy,
			page
		} = this.state;
		return (
			<View style={helper.main2}>
			 <View style={{helper:50,width:'100%',alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
			         <TextInput onSubmitEditing={this.loadData} style={{backgroundColor:'#f2f2f2',width:100,padding:0,fontSize:15,fontWeight:'bold',color:'#000'}} value={page.toString()} onChangeText={(page) => this.setState({page})} keyboardType='numeric' />
			         <Button
				       text={'Load Page'}
				       size={16}
				       br={30}
				       onPress={this.loadData}
				       hr={20}		       
				      />
			 </View>
			 <FlatList
			  data={foodList}
			  renderItem={this.renderItem}
			  extraData={foodList}
			  refreshControl={<RefreshControl refreshing={false} onRefresh={this.loadData} colors={[helper.primaryColor, "#000"]} />}
			  keyExtractor={(item, index) => item.id}
			 />
			 
			 <View style={{helper:50,width:'100%',alignItems:'center'}}>
			         <Button
				       text={'Submit'}
				       size={16}
				       br={30}
				       onPress={this.submit}
				       hr={20}		       
				      />
			 </View>

			 <LoadingModal visible={busy} />
			 <Picker ref={ref => this.moreModal = ref}  />
			</View>
		)
	}
	renderItem = ({item, index}) => {
		let catName = this.state.catList.findIndex(({id}) => id == item.cat);
		catName = this.state.catList[catName]?.name;
		const type = types[item.type];		
		return (
			<ScrollView horizontal><View style={{flexDirection:'row',marginVertical:10,justifyContent:'space-between',width:'100%'}}>
			 
			 <TouchableOpacity onPress={() => this.vegHandle(index, item)} style={{width:50,height:50,marginRight:10}}>
				  <Image source={{uri:helper.site_url + item.image}} style={{width:'100%',height:'100%'}}/>
				  <FoodNot veg={item.veg} />
			 </TouchableOpacity>

			 <TouchableOpacity style={{width:100}} onPress={() => this.vegHandle(index, item)} style={{width:50,height:50,marginRight:10}}>
				 <Text style={{fontSize:14,color:'white'}}>{item.name}</Text>			
			 </TouchableOpacity>
			 
			 <TouchableOpacity style={{height:'100%',width:100,alignItem:'center'}} onPress={() => this.catHandle(index, item)}>
				 <Text style={{fontSize:14,textAlign:'center',color:'white'}}>{catName}</Text>				 				 
			 </TouchableOpacity>
			 <TouchableOpacity style={{height:'100%',width:100,alignItem:'center'}} onPress={() => this.typeHandle(index, item)}>
				 <Text style={{fontSize:14,textAlign:'center',color:'white'}}>{type}</Text>				 
			 </TouchableOpacity>

			</View></ScrollView>
		);
	}
}
