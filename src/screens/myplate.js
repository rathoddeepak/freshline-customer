import React, { Component} from 'react';
import {
	View,
	Text,
	Image,
	FlatList,
	StyleSheet,
	Pressable,
	ScrollView,
	TextInput,
} from 'react-native';
import {
	CHeader,
	Icon,
	Dazar,
	FoodCardSmall,
	CartView
} from 'components';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import MyCart from 'libs/mycart';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
const chipSize = helper.width * 30 / 100;
const FAMILY = '1';
const FRIENDS = '2';
const PARTY = '3';
const COUPLE = '4';
const BREAKFAST = '5';
const LUNCH = '6';
const DINNER = '7';
export default class MyPlate extends Component {
	constructor(props) {
		super(props);
		this.state = {			
			index: 0,
			isFirst:true,
		    routes: [
		      { key: FAMILY, title: 'Family' },
		      { key: PARTY, title: 'Party' },		      
		      { key: FRIENDS, title: 'Friends' },
		      { key: COUPLE, title: 'Couple' },
		      { key: BREAKFAST, title: 'Breakfast' },
		      { key: LUNCH, title: 'Lunch' },
		      { key: DINNER, title: 'Dinner' },
		    ]
		},
		this.pageList = [];
		this.focus = null;
	}
	componentDidMount () {						
		this.focus = this.props.navigation.addListener('focus', () => {		    		  
		  this.cartView?.init();		  
		  if(this.state.isFirst){
		  	this.setState({isFirst:false});
		  }else{
		  	for(var i = 0; i < 6; i++){
		  		this.pageList[i]?.remount();
			}
		  }
		  setTimeout(this.handleCart, 300);
	    });	    
	    this.blur = this.props.navigation.addListener('blur', () => {	    	
	      MyCart.release();
	    });
	}
	handleCart = () => {		
		MyCart.init(null, this.hotelChange, this.recount);
	}
	hotelChange = (amount) => {		
		this.cartView.direct(1, amount);
	}
	recount = ({id,price}) => {		
		this.pageList[this.state.index].reverse(id)
		this.cartView.decrease(1, price);		
	}
	handleAdd = (item) => {		
    	this.cartView.addToCart(item);
    }
    handleRemove = (item) => {    	
    	this.cartView.removeFromCart(item);
    }    
	_handleIndexChange = index => this.setState({ index });	
	_renderTabBar2 = (props) => <TabBar {...props} scrollEnabled getLabelText={({route}) => route.title } labelStyle={{fontSize:14}} indicatorStyle={{backgroundColor:helper.primaryColor}} tabStyle={{width:'auto'}}indicatorContainerStyle={{backgroundColor:'#000'}} />;
	render() {
		return (
			<View style={helper.hldr}>
			 <CHeader text={lang.z[cl].mk_my_plt} />
			 <View style={{height:'93%',width:'100%'}}>
			  <TabView
			    lazy
		        navigationState={this.state}
		        renderScene={this._renderScene}
		        renderTabBar={this._renderTabBar2}
		        swipeEnabled={false}
		        initialLayout={{ width:helper.width,height:helper.height }}
		        onIndexChange={this._handleIndexChange}		        
		        renderLazyPlaceholder={() => {
		        	return (
		        		<Dazar
					      loading={true}
					      error={false}
					      length={0}					      
					     />
		        	)
		        }}		        
		      />
		      <CartView {...this.props} ref={ref => (this.cartView = ref)} marginLeft={7} />
			 </View>			 
			</View>
		)
	}
	_renderScene = SceneMap({		
		1:() => <PlateViewer ref={ref => this.pageList[0] = ref} key={FAMILY} id={FAMILY} onAdd={this.handleAdd} onRemove={this.handleRemove} />,
		2:() => <PlateViewer ref={ref => this.pageList[1] = ref} key={PARTY} id={PARTY} onAdd={this.handleAdd} onRemove={this.handleRemove} />,
		3:() => <PlateViewer ref={ref => this.pageList[2] = ref} key={FRIENDS} id={FRIENDS} onAdd={this.handleAdd} onRemove={this.handleRemove} />,
		4:() => <PlateViewer ref={ref => this.pageList[3] = ref} key={COUPLE} id={COUPLE} onAdd={this.handleAdd} onRemove={this.handleRemove} />,
		5:() => <PlateViewer ref={ref => this.pageList[4] = ref} key={BREAKFAST} id={BREAKFAST} onAdd={this.handleAdd} onRemove={this.handleRemove} />,
		6:() => <PlateViewer ref={ref => this.pageList[5] = ref} key={LUNCH} id={LUNCH} onAdd={this.handleAdd} onRemove={this.handleRemove} />,
		7:() => <PlateViewer ref={ref => this.pageList[6] = ref} key={DINNER} id={DINNER} onAdd={this.handleAdd} onRemove={this.handleRemove} />
	});
}

class PlateViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			panels:[],
			loading: true,
			error: false
		}
		this.panels = [];
	}
	componentDidMount() {
		this.loadPanels();
	}
	loadPanels = async () => {		
		this.setState({loading: true,error:false})		
		var res = await request.perform('plate', {
			id:this.props.id,
			user_id
		});
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200)
			this.setState({
				panels:res.data
			});
		else this.setState({error:true});	
	}
	remount = () => {		
		this.state.panels.forEach((p) => {			
			this.panels[p.id]?.mount();
		})
	}
	reverse = (id) => {
		this.state.panels.forEach((p) => {			
			this.panels[p.id]?.reset(id);
		})
	}
	render() {
		const {
			panels,
			loading,
			error
		} = this.state;
		return (
			<View style={s.cnt}>			 
			 <ScrollView>
			 <View style={{height:10}} />
			 {panels.map(({id, name}, idx) => {
			 	return (
			 		<PlatePanel ref={ref => this.panels[id] = ref} id={id} title={name} key={id} toCart={this.props.onAdd} fromCart={this.props.onRemove} />
			 	)
			 })}
			 <Dazar
		      loading={loading}
		      error={error}
		      length={panels.length}
		      onRetry={this.loadPanels}
		     />
			 <View style={{height:45}} />
			 </ScrollView>
			</View>
		)
	}
}

class PlatePanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items:[],
			loading:true,
			error:false
		}
		this.foodItem = [];
	}
	componentDidMount() {
		this.loadFoods();
	}
	reset = (id) => {
		this.foodItem[id]?.setCartCount(0)
	}
	loadFoods = async () => {		
		this.setState({loading: true,error:false})		
		var res = await request.perform('plate', {
			user_id,
			user_lat,
			user_long,			
			req:'plt_fds',
			plate_id:this.props.id,			
			offset:this.state.items.length			
		});
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200)
			this.setState({
				items:res.data
			});
		else this.setState({error:true});	
	}
	onAdd = (item) => {
		this.props.toCart(item);
	}
	onRemove = (item) => {
		this.props.fromCart(item);
	}
	onFCMount(id){
		let c = MyCart.getItemCount(id);		
		if(c)this.foodItem[id]?.setCartCount(c);
	}
	mount = () => {
		MyCart.init(() => {
			this.state.items.forEach(item => {						
				let c = MyCart.getItemCount(item.id);							
				this.foodItem[item.id]?.setCartCount(c ? c : 0);				
			})	
		});			
	}
	render() {
		const {
			id,
			title
		} = this.props;
		const {
			items,
			loading
		} = this.state;
		return (
			<View style={s.panel}>			 
			 <Text numberOfLines={1} style={s.ptt}>{title}</Text>			 
			 <SkeletonContent
				containerStyle={{width:'100%',flexDirection:'row'}}
				isLoading={loading}
				boneColor={helper.grey2}
				highlightColor={helper.grey4}
				layout={[
					s.foodChip,
					s.foodChip,
					s.foodChip
				]}
			 />
			 <FlatList
			    data={items}
			    horizontal
			    keyExtractor={item => item.id.toString()}			    
			    renderItem={({item, index}) => {
				 	return (
				 		<FoodCardSmall 
					       ref={ref => this.foodItem[item.id] = ref}
					       onAdd={() => this.onAdd(item)}
					       onRemove={() => this.onRemove(item)}
					       onMount={() => this.onFCMount(item.id)}
					       width={220}
					       cStyle={{marginVertical:20,marginHorizontal:5}}
					       backgroundColor="#505050"					       
					       hasRating={false}
					       imgSize={50}
					       data={item}			       
					    />				 		
				 	)
			    }}
			  />			  
			</View>
		)
	}
}
const s = StyleSheet.create({
	cnt: {
	    flex: 1,
	},
	hdrh: {		
		width: '100%',
		paddingBottom:5,		
		backgroundColor: '#000'
	},
	tabItem: {	    
	    alignItems: 'center',
	    marginHorizontal:10,
	    marginVertical:5
	},
	panel:{		
		width:'100%',
		marginVertical:10		
	},
	ptt:{
		fontSize:19,
		fontWeight:'bold',
		marginLeft:8,
		marginTop:5,
		color:helper.silver,
		width:'50%',
	},
	psrchc:{		
		width:'45%',		
		borderRadius:8,
		borderWidth:1,
		position:'absolute',
		top:5,
		right:5,
		borderColor:helper.greyw,
		backgroundColor:helper.grey2,
		flexDirection:'row'
	},
	picn:{
		height:"100%",
		width:33,
		justifyContent:'center',
		alignItems:'center'
	},
	psrh:{
		fontSize:13,
		color:'white',
		width:'100%',
		margin:0,
		padding:0
	},
	desc:{fontSize:12,width:'90%',color:'#fff',marginBottom:8,marginTop:3,marginHorizontal:5},
	fHolder:{width:'100%',height:'100%',position:'absolute',top:0,left:0,borderRadius:7,justifyContent:'flex-end'},
	fImage:{borderRadius:7,backgroundColor:helper.grey,flex:1},
	foodChip:{width:200,marginVertical:20,marginHorizontal:5,height:81,borderRadius:8},
})