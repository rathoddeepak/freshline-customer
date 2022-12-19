import React from 'react';
import {
	StyleSheet,	
	ScrollView,
	FlatList,
	Text,
    View
} from 'react-native';
import Dazar from '../dazar';
import request from 'libs/request';
import helper from 'assets/helper';
import VendorFoodCard from  '../vendorFoodCard';
import lang from 'assets/lang';
export default class FoodList extends React.Component {
 constructor(props){
	  super(props)
	  this.state={	    
	    results:[],	    
	    fetched:true,
	    error:false,	    
	    mounted:true,	    
	    previousKey:'',
	    id:null,
			type:undefined,
			isFirst:true
	  }
	  this.foodCard = [];
 }; 
 componentDidMount(){
 	let filterData = this.props.filterData;
	this.setState({mounted:true,filterData});
 }
 filter = (filterData) => {
 	this.setState({filterData});
 }
 componentWillUnmount(){
	this.setState({mounted:false}); 	
 }
 async searchKey(key, id = null, type = undefined, force = false){   
   if(this.state.isFirst && this.state.previousKey != '')this.setState({isFirst:false});
   if(key.length == 0 && !force){
   	    this.setState({previousKey:'',error:false,fetched:true,id,type})   
   } else if(key != this.state.previousKey || force) {   	   
   	   var offset = this.state.offset;
   	   var fD = this.state.filterData;   	   
   	   this.setState({previousKey:key,error:false,results:[],fetched:false})
   	   let radius = parseFloat(fD.distance);
   	   let data = {user_id,isuser:true,se,key,user_lat,user_long,fdtype:JSON.stringify([helper.FD_BOTH,helper.FD_ONLYDLV]),radius,req:'srh_fd'};
   	   if(fD.type != 0)data['meal_type'] = fD.type;   	   
   	   if(fD.cat.length != 0)data['cats'] = fD.cat;

   	   if(!this.props.approved)data['allFood'] = true;   	   
   	   if (type != undefined){
   	   	data['type'] = type;
   	   	data['type_id'] = id;
   	   	if(type != 0)data['key'] = '';
   	   }
	   try {	   	  
	      let res =  await request.perform("vendor2", data,false);	      
	      if(res)this.setState({fetched:true});
	      if(res == 'fetch_error' || res == 'network_error'){    
		    this.setState({error:true})
		  }else{
		    if(res.status == 400){
		     this.setState({error:true})    
		    }if(res.status == 300){     
		      this.setState({error:true})
		    }else if(res.status == 200){		    	
		      if(this.state.mounted == true){
		          this.setState({           		            
		            results:res.data
		          });
		      }
		    }
		  }
	   }catch(err){
	      this.setState({error:true})
	   }	   
   }    
 }
 flushCount = (id) => {
 	this.foodCard[id]?.setCount(0);
 } 
 handleNavItem({vendor_id, id}){
	this.props.navigation.navigate('VendorView', {item:{id:vendor_id,food_id:id}});
 }
 retry = () => {
 	const {previousKey, id, type} = this.state;
 	this.searchKey(previousKey, id, type, true);
 }
 render(){
	const {fetched,results,error,isFirst} = this.state;
	const custom = this.props.approved == undefined ? lang.z[cl].srfaphr : 'Approved Food Appears Here!';	
	return(
		 <View>		    
		   	<FlatList
				data={results}				
				renderItem={({ item , index }) => (  
					  <VendorFoodCard 
							data={item}
							ref={ref => this.foodCard[item.id] = ref}
							onPress={() => this.handleNavItem(item)}
							index={index}
					  />
				)}
				keyExtractor={(item,index) => index.toString()}
		    />
		    <Dazar
		      loading={!fetched}
		      error={error}
		      isFirst={isFirst}
		      length={results.length}
		      custom={custom}
		      lcont_size={70}
		      emptyOther
		      emptyCustom={this.props.approved ? 'We Have Not Approved\nAny Food Related To Your Search' : undefined}
		      onRetry={this.retry}
				  lanim_size={160}
		    />    
		   </View>	  
		
		)
    }
}

const s = StyleSheet.create({
	note:{fontSize:13,fontWeight:'bold',padding:5,alignSelf:'flex-end',color:helper.primaryColor},
	bx:{justifyContent:'center',alignItems:'center',height:250,width:'100%'}
})