import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ToastAndroid,
	RefreshControl
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
	Dazar,
	CHeader,
	HeuButton,
	Icon
} from 'components';
import lang from 'assets/lang';
import helper from 'assets/helper';
import request from 'libs/request';
export default class Orders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
		    routes: [
		      { key: 0, title: 'Checked' },
		      { key: 1, title: 'Unchecked' }		     		     
		    ]
		}
		this.pageList = [];
	}	
	_handleIndexChange = index => {
		this.setState({ index });
		let unmount = [0,1];unmount.splice(index, 1);		
		unmount.forEach(page => this.pageList[page]?.unmount())
		this.pageList[index]?.mount();
	}
	_renderTabBar2 = (props) => <TabBar {...props} getLabelText={({route}) => route.title } labelStyle={{fontSize:14}} indicatorStyle={{backgroundColor:helper.primaryColor}} style={{backgroundColor:"#000"}}/>;
	_renderScene = SceneMap({		
		0:() => <OrderList onComplain={this.complain} checked={true} key={0} ref={ref => this.pageList[0] = ref} />,
		1:() => <OrderList onComplain={this.complain} checked={false} key={1} ref={ref => this.pageList[1] = ref} />,		
	});
	complain = (id = 0) => {
		let object = {id};
		if(id == 0){
			object['onAdded'] = (data) => {
				this.pageList[1]?.add(data);
			}
		}
		this.props.navigation.navigate('AddComplain', object);
	}
	render() {
		return (
			<View style={helper.main2}>
			  <CHeader text={'Complaints'} renderLeft={this.renderLeft} />
			  <TabView
			    lazy
		        navigationState={this.state}
		        renderScene={this._renderScene}
		        renderTabBar={this._renderTabBar2}		        
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
			</View>
		)
	}
	renderLeft = () => {
		return (
		  <HeuButton style={s.lgt} onPress={() => this.complain()}>
		   <Icon name={lang.pls} size={25} color={helper.primaryColor} />
		  </HeuButton>
		)
	}
}


class OrderList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			complaints:[],
			busy:false
		}
	}
	componentDidMount(){
		this.loadingComplain();
	}
	mount = () => {		
		this.setState({mounted: true});
	}
	unmount = () => {
		this.setState({mounted: false})
	}
	loadingComplain = async () => {
		if(this.state.busy)return;
		this.setState({busy: true})	
		var res = await request.perform('user', {
			user_id,
			se,			
			req:this.props.checked ? 'cmp' : 'ucmp'
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200)
			this.setState({
				complaints:res.data
			});
		else this.setState({error:true})		
	}
    add = (object) => {
    	let data = this.state.complaints;
    	data.unshift(object);
    	this.setState({data}) 
    }
	render() {
		const {
			complaints,
			busy
		} = this.state;
		return (
			<View style={helper.max}>			 
				<FlatList
				 data={complaints}
				 keyExtractor={(item) => item.id.toString()}
				 renderItem={({item, index}) =>
				     <ComplainCard
					  data={item}
					  onPress={() => this.props.onComplain(item.id)}
					 />
				 }
				 refreshControl={<RefreshControl
		            colors={[helper.primaryColor, helper.blk]}
		            refreshing={false}
		            onRefresh={this.loadingComplain} />
		         }
				 ListFooterComponent={
				 	<Dazar
				      loading={busy}
				      error={false}
				      emptyOther
				      length={complaints.length}		      
				    />
				 }
				/>			 
			</View>
		)
	}
}


class ComplainCard extends Component {
	render() {
		const {			
			time,
			content,
			checked
		} = this.props.data;		
		return (
			<HeuButton style={s.card} onPress={this.props.onPress}>
			 <Text style={{fontSize:14,fontWeight:'bold',color:helper.silver,margin:5}}>{time}</Text>
			 <Text numberOfLines={3} style={{fontSize:14,color:helper.silver,margin:5}}>{content}</Text>
			</HeuButton>
		)
	}
}

const s = StyleSheet.create({
	card:{
		width:'95%',
		borderRadius:10,
		marginVertical:8,
		padding:5,
		alignSelf:'center',
		backgroundColor:helper.grey6
	}
})