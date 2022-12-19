import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,	
	Modal,
	FlatList,
	TextInput,
	StyleSheet,	
	BackHandler,
	TouchableWithoutFeedback
} from 'react-native';
import Icon from './icon';
import Button from './button';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Image from './image';
export default class FoodSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v:false,
			result:[],
			dataList:[]		
		}		
	}

	show2 = () => {
		this.setState({v:true,result:this.state.dataList})
	}

	show = (result) => {
		this.setState({dataList:result,v:true})
	}

	isLoaded = () => this.state.dataList.length > 0;
	
	jumpToItem = (item) => {
		this.setState({v:false}, () => {
			this.props.onJump(item)
		})
	}

	close = () => {
		this.setState({v:false,result:[]});
	}

	search = (text) => {
		this.setState({
			text
		}, () => {
			let result = this.state.dataList.filter(item => {				
				return item.name.toLowerCase().includes(
					text.toLowerCase()
				);
			});
			this.setState({result});
		})
	}
	render() {
		const {			
			result,
			v
		} = this.state;		
		return (			
			<Modal visible={v} transparent onRequestClose={this.close} animationType="fade"><View style={sty.cnt}><View style={sty.main}>
				 <View style={sty.hldr}>
				     <View style={{height:40,width:'90%',alignSelf:'center',backgroundColor:helper.grey6,borderRadius:20,marginTop:10,flexDirection: 'row',alignItems:'center'}}>
					     <Icon name={lang.srch} color={helper.grey} size={20} style={{margin:5}}/>
					     <TextInput onChangeText={this.search} style={{color:helper.white,width:'100%',fontSize:14,padding:0}} placeholder="Search Food" placeholderTextColor={helper.grey} />
					 </View>					 
				 </View>
				 <FlatList
				  data={result}
				  keyExtractor={(item) => item.id}
				  renderItem={({ item, index}) =>
				      <FoodCardSmall 				       				       
				       onPress={() => this.jumpToItem(item)}				       
				       imgSize={50}
				       data={item}
				      />					      
			      }
				 />
			</View></View></Modal>
		)
	}
}
class FoodCardSmall extends Component {	
	render() {
		 const {
		   data,
		   onPress		   
		} = this.props;			
		return (
			<View style={[sty.item, {width:'95%',backgroundColor:helper.grey4,borderRadius:5}]}>
			  <View style={sty.cntr}>
			   <Image
			    sty={{width:65,height:65}}
			    imgSty={{width:'100%',height:'100%'}}
			    borderRadius={100}
			    hash={data.hash}
			    source={{uri:helper.site_url + data.image}}
			   />	     
			   <View style={{width:'47%',padding:7}}>
			    <Text style={[sty.tt, {fontSize:14}]} numberOfLines={2}>{data.name}</Text>			     
			    <Text style={[sty.pr, {fontSize:13}]} numberOfLines={3}>₹{data.menu_price}</Text>
			   </View>
			   <View style={{width:'30%',alignItems: 'center',justifyContent: 'center',height:'100%'}}>
			    <Button onPress={onPress} text="View" />
			   </View>
			  </View>			  
			</View>
		)
	}
}

const sty = StyleSheet.create({
	main:{width:'95%',height:'95%',backgroundColor:helper.grey6,elevation:10,borderRadius:10},
	cnt:{flex:1,justifyContent: 'center',alignItems: 'center',backgroundColor:'#000000b4'},
	hldr:{width:'100%',height:60,backgroundColor:'#000',height:60},	
	icon:{width:45,height:45,backgroundColor:helper.primaryColor,borderRadius:90,justifyContent:'center',alignItems:'center'},	
	cst:{fontSize:18,fontWeight:'bold',color:helper.silver},
	csth:{height:60,justifyContent:'center'},

	item:{marginVertical:10,height:80,alignSelf:"center"},		
	tt:{fontWeight:'bold',color:helper.silver,width:'80%'},	
	pr:{color:helper.silver,width:'95%'},
	old:{textDecorationLine: 'line-through',color:helper.grey},
	cntr:{flexDirection: 'row',marginVertical:15}
})