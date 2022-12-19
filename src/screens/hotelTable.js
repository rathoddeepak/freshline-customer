import React, { Component } from 'react';
import {
	View,
	Text,	
	FlatList,
	TextInput,
	StyleSheet,
	ToastAndroid
} from 'react-native';
import {
	Button,
	NHeader,
	LoadingModal,
	SuccessModal
} from 'components';
import helper from 'assets/helper';
import lang from 'assets/lang';
import moment from 'moment';
import request from 'libs/request';
import FoodCard3 from 'components/foodCard3';
import {CommonActions} from '@react-navigation/native';
export default class HotelTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			title:'',
			items:[],
			tableno:0,
			busy:false
		}
	}
	componentDidMount(){		
		let {items,title,vendor_id,totalAmount} = this.props.route?.params;
		this.setState({items,title,vendor_id,totalAmount});
	}
	sbmt = async () => {
		let tableno = this.state.tableno;
		if(isNaN(tableno)){
			ToastAndroid.show(lang.z[cl].pan, ToastAndroid.SHORT);
			return;
		}if(tableno == 0){
			ToastAndroid.show(lang.z[cl].tblz, ToastAndroid.SHORT);
			return;
		}else if(request.isBlank(tableno)){
			ToastAndroid.show(lang.z[cl].pltb, ToastAndroid.SHORT);
			return;
		}
	    this.setState({busy:true});
	    let ims = this.state.items;
	    let items = [];
	    ims.forEach(({price,id,cartCount}) => {
	    	items.push({id,amount:price,quantity:cartCount});
	    });
	    items = JSON.stringify(items);
	    var res = await request.perform('visits', {
	      tableno,
	      items,
	      vendor_id:this.state.vendor_id,
	      user_id,
	      se
	    });
	    if(res)this.setState({busy:false});
	    if(typeof res === 'object' && res?.status == 200){	     
	      this.successModel.show();
	      setTimeout(() => {
	      	this.successModel?.close();
	      	this.props.navigation.dispatch(
		        CommonActions.reset({
		          index: 1,
		          routes: [
		            { name: 'HomeActivity'},
		            { name: 'HotelVisits'}
		          ],
		        })
		    );
	      }, 700)
	    }else {
	      this.setState({error:true});
	      ToastAndroid.show('There was an error', ToastAndroid.SHORT);
	    }
    }
	invoice = () => {
		let items = this.state.items;
		if(items.length == 0){
			this.pls();
			return;
		} 
		let entities = [];
		items.forEach((item) => {
			entities.push({
				title: item.name,
				quantity: item.cartCount,
				total:item.price * item.cartCount,
				amount:item.price
			})
		});
		let title = 'Food Ordering';
		let time = moment().format('DD-MM-YYYY HH:MM A');
		this.props.navigation.navigate('Invoice', {
			title2:'Food Ordering',
			totalAmount:this.state.totalAmount,
			entities,
			title,
			time
		});
	}
	changeText = (tableno) => this.setState({tableno});

	render() {
		const {
			totalAmount,
			title,
			items,
			busy,
			tableno
		} = this.state;
		return (
			<View style={helper.main2}>
			 <NHeader
			  color={helper.white}
			  title={title}
			  onPressBack={() => alert("title")}
			 />
			 <View style={s.main3}>			  
			  <View style={s.card}>
			   <Text style={s.tt}>Enter Table No.</Text>
			   <FlatList				     
			     data={items}			     
			     showsHorizontalScrollIndicator={false}		     			     
			     contentContainerStyle={{maxHeight:230,flexDirection:'column',flexWrap:'wrap'}}    
			     horizontal
			     renderItem={({item,index}) =>
			      <FoodCard3 imgRadius={100} borderRadius={10} backgroundColor={helper.grey6} data={item} width={240} cStyle={{margin:5}} />
			     }
	             keyExtractor={(item, index) => index.toString()}
			   />	   
			   <View style={s.chip}>
			    <TextInput keyboardType="numeric" onChangeText={this.changeText} value={tableno} placeholderTextColor={helper.grey} placeholder="Table No." style={s.ch} />
			   </View>

			   <View style={{flexDirection: 'row',alignSelf:'center',marginTop:6,marginBottom:10}}>
			      <Button
			       text={'Bill '+lang.rp+totalAmount}
			       size={16}
			       br={30}
			       onPress={this.invoice}
			       hr={20}
			       style={{marginRight:5}}		       
			      />
			      <Button
			       text={'Submit'}
			       size={16}
			       br={30}
			       onPress={this.sbmt}
			       hr={20}		       
			      />
			   </View>

			  </View>

			 </View>
			 <SuccessModal ref={ref => this.successModel = ref}/>
			 <LoadingModal visible={busy} />
			</View>
		)
	}
}

const s = StyleSheet.create({
	card:{
		backgroundColor:helper.grey4,
		borderRadius:10,
		width:'95%',		
		alignSelf:'center'		
	},
	main3:{justifyContent:'center',width:'100%',height:'100%',alignItems:'center',position:'absolute',zIndex:-1},
	tt:{
		fontSize:16,
		color:helper.silver,
		textAlign:'center',
		width:'100%',
		marginVertical:20,
		fontWeight:'bold'			
	},
	chip:{
		maxWidth:'95%',
		alignSelf:'center',		
		backgroundColor:helper.grey6,		
		alignItems:'center',		
		borderRadius:23,
		padding:2,
		marginVertical:10,
		flexDirection:'row',
		flexWrap:'wrap'
	},
	ch:{
		fontSize:17,
		fontWeight:'bold',
		marginVertical:5,
		marginHorizontal:10,
		padding:0,
		textAlign:'center',
		color:helper.silver
	}
})