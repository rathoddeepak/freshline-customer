import React, { Component } from 'react';
import {
	View,
	Text,	
	StyleSheet,		
	RefreshControl,
	ActivityIndicator
} from 'react-native';
import {	
	Icon,	
	TableCard,	
	CHeader,
	HeuButton,
	FlatList,
	Err
} from 'components';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
const darkCl = '#a68222';
export default class Resturant extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items:[],
			loading:false,
			error:false,
			couple:0,
			counting:false,
			bk_count:0,
			end:false
		}
		this.review = [];
		this.focus = null;	
	}
	componentDidMount() {
		this.loadCount();
		this.loadVendors();
		this.focus = this.props.navigation.addListener('focus', () => {			
			this.loadCount();
	    });	
	}
	componentWillUnmount() {
		if(this.focus != null)this.focus();
	}
	loadVendors = async (r = true) => {		
		const items = this.state.items;		
		this.setState({loading: true,error:false})
		if(r)this.setState({end:false,items:[]})
		var res = await request.perform('vendor', {
			req:'ld_vendors',
			sltdta:true,
			user_id,
			se,			
			offset:r ? 0 : items.length,
			couple:this.state.couple,
			user_lat,
			user_long,
			table:1,			
			radius:15
		});	    
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200)
			this.setState({
				items:items.length == 0 || r ? res.data : [...items, ...res.data],
				end:res.data.length == 0				
			});
		else this.setState({error:true});		
	}
	loadCount = async () => {
		if(this.state.counting)return;
		this.setState({counting:true})		
		var res = await request.perform('vendor', {
			req:'ldbkcn',			
			user_id,
			se
		});	
		if(res)this.setState({counting:false});
		if(typeof res === 'object' && res?.status == 200){
			this.setState({bk_count:res.data});		
		}
	}
	srch = () => {
		this.props.navigation.navigate('TableSearch');
	}
	render() {
 		const {items} = this.state;
		return (
			<View style={helper.hldr}>
			 <CHeader text={lang.z[cl].bk_my_tb} renderLeft={this.renderLeft} />
			 <FlatList
			  id={"id"}
			  data={items}
			  inAnimation={"fadeIn"}
			  outAnimation={"fadeOut"}
			  duration={1000}
			  ref={ref => (this.list = ref)}
			  rowItem={this.renderItem}
			  keyExtractor={item => item.id.toString()}
			  ListFooterComponent={this.renderFooter}
			  refreshControl={<RefreshControl refreshing={false} onRefresh={this.loadVendors} colors={[helper.primaryColor, "#000"]} />}
			 />
			</View>
		)
	}
	onCommentPress = (index) => {
	 this.review[index]?.loopStart();
	}
	renderFooter = () => {
		const {loading,error,end} = this.state		
		if(!loading && error){
			return (
				<Err onPress={() => this.loadVendors(false)} />			
			);
		}else if(loading && !error){
			return (
			  <LottieView
		        ref={animation => {
		          this.animation = animation;
		        }}
		        autoPlay
		        loop
		        style={{width:200,height:200,alignSelf:'center'}}
		        source={require('assets/anims/loader.json')}
		      />
			)
		}else if(!loading && !error && this.state.items.length === 0){
			return (
				<View style={s.bb}>
					<Text style={s.tt}>No Vendors Found!</Text>
				</View>
			);
		}else if(!loading && !error && end){			
			return (
				<View style={s.bb}>
					<Text style={s.tt}>End of List!</Text>
				</View>
			);
		}else if(!loading && !error){
			return (
				<View style={s.bb}>				
					<Text onPress={() => this.loadVendors(false)} style={s.tt2}>Load More</Text>
				</View>
			);
		}
	}	
	renderItem = ({item, index}) => {		
		return (
			<TableCard
			 item={item}
			 index={index}
			 onCommentPress={this.onCommentPress}
			 onPress={() => this.handleNav(item)}
			 ref={ref => this.review[index] = ref}
			/>
		)
	}
	handleNav = item => {
		this.props.navigation.navigate('TableMaker', item);
	}
	renderLeft = () => {
		const {
			bk_count,
			counting
		} = this.state;
		return (
		  <View style={{flexDirection:'row'}}>			
		      <HeuButton onPress={() =>
			  	this.props.navigation.navigate('Updates')
			  } style={s.qa}>
			  <Text style={[s.tq, {fontSize:12,marginHorizontal:6}]}>My Bookings</Text>
			   
			   <LinearGradient colors={bk_count > 0 ? [helper.primaryColor, darkCl] : [helper.grey, helper.blight]} style={s.bdg}>
			  	  <Text style={s.bdgi}>{bk_count}</Text>
			  	  {counting ? <View style={{right:-3,position:'absolute',borderRadius:60}}>
				     <ActivityIndicator color={helper.white} size={37} />
				  </View> : null}
			   </LinearGradient>

			 </HeuButton>

			  <HeuButton style={s.lgt} onPress={this.srch}>
			   <Icon name={lang.srch} size={25} color={helper.primaryColor} />
			  </HeuButton>
		  </View>
		)
	}
}

const s = StyleSheet.create({
	bdg:{elevation:10,width:30,height:30,marginRight:2,justifyContent:'center',alignItems:'center',backgroundColor:helper.red,borderRadius:60},
	bdgi:{fontSize:15,color:helper.white,fontWeight:'bold'},
	tq:{color:helper.silver,fontSize:14,fontWeight:'bold'},
	qa:{justifyContent:'center',flexDirection:'row',justifyContent:'flex-start',backgroundColor:helper.grey2,borderRadius:20,alignItems:'center',margin:5},

	lgt:{height:40,width:40,borderRadius:90,backgroundColor:helper.primaryColor + '42',justifyContent:'center',alignItems:'center'},	
	tt2:{fontSize:17,color:helper.primaryColor},
	bb:{width:'100%',height:70,justifyContent:'center', alignItems:'center'}
})