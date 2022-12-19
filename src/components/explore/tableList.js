import React from 'react';
import {
	StyleSheet,	
	ScrollView,
	FlatList,
	Text,
    View
} from 'react-native';
import TableCard from  '../tableCard';
import request from 'libs/request';
import helper from 'assets/helper';
import Dazar from '../dazar';
import lang from 'assets/lang';
export default class VendorList extends React.Component {
 constructor(props){
	  super(props)
	  this.state={	    
	    results:[],	    
	    fetched:true,
	    error:false,	    
	    mounted:true,	    
	    isFirst:true,
	    previousKey:'',
	    id:null,
		type:undefined,
	  }
	  this.review = [];
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
 handleNavVdr(item){	
	this.props.navigation.navigate('TableMaker', item);
 }
 async searchKey(key, id = null, type = undefined, force = false){   
   if(this.state.isFirst && this.state.previousKey != '')this.setState({isFirst:false});
   if(key.length == 0 && !force){   	    
   	    this.setState({previousKey:'',fetched:true,id,type})   
   } else if(key != this.state.previousKey || force) {
   	   var offset = this.state.offset;
   	   var fD = this.state.filterData;
	   let radius = parseFloat(fD.distance);
   	   this.setState({previousKey:key,results:[],fetched:false})
   	   let data = {user_id,se,key,user_lat,user_long,radius,table:1,req:'ld_vendors',allFood:true};
	   if(fD.type != 0)data['meal_type'] = fD.type;	   
	   try {	   	  
	      let res =  await request.perform("vendor", data,false);	      
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
 retry = () => {
 	const {previousKey, id, type} = this.state;
 	this.searchKey(previousKey, id, type, true);
 }
 onCommentPress = (index) => {
	this.review[index]?.loopStart();
 }
 render(){
	const {fetched,results,error,isFirst} = this.state;
	return(
		<View>		    
		   	<FlatList
				data={results}				
				renderItem={({ item , index }) => <TableCard ref={ref => this.review[index] = ref} onCommentPress={this.onCommentPress} index={index} item={item} onPress={() => this.handleNavVdr(item)} />}
				keyExtractor={(item,index) => index.toString()}
		    />		    
		    <Dazar
		      loading={!fetched}
		      error={error}
		      length={results.length}
		      lcont_size={70}
		      onRetry={this.retry}
		      isFirst={isFirst}
		      custom={lang.z[cl].srraphr}
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