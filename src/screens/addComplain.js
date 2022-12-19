import React, {Component} from 'react';
import {
	ScrollView,
	Text,
	View,
	ToastAndroid,
	TextInput,
	Dimensions
} from 'react-native';
import {
	Icon,
	Button,
	CHeader,
	Dazar,
	LoadingModal,
	SuccessModal
} from 'components';
import helper from 'assets/helper';
import request from 'libs/request';
const maxHeight = Dimensions.get('window').height - 110;
export default class AddComplain extends Component {
	constructor(props) {
		super(props)
		this.state = {
			id:0,
			content:'',
			loading:false,
			error:false,
			busy:false
		}
	}
	
	componentDidMount () {
		let id = this.props.route?.params?.id;
		if(id > 0){			
			this.setState({
				id:this.props.route.params.id,
				loading:true
			}, this.loadData)
		}
	}

	loadData = async () => {
		this.setState({loading:true,error:false})		
		var res = await request.perform('user', {
			req:'cpmdta',
			user_id,
			se,
			id:this.state.id
		});
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200){
			this.setState({content:res.data.content});
		} else {
			this.setState({error:true});
		}
	}

	createComplain = async () => {
		let content = this.state.content;
		if(request.isBlank(content)){
			ToastAndroid.show('Please Enter Your Complain', ToastAndroid.SHORT);
			return;
		}else if(content.length < 10){
			ToastAndroid.show('Complain too short!', ToastAndroid.SHORT);
			return;
		}
		this.setState({busy:true})		
		var res = await request.perform('user', {
			req:'crt_cmp',
			user_id,
			content,
			se
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){			
			this.successModal.show();
	    	setTimeout(() => {
		  		this.props.navigation.goBack();
			this.props.route?.params?.onAdded({
				id:res.data,
				content:this.state.content
			});
		  	}, 2000);			
		}else{
			ToastAndroid.show("Unable to add complain", ToastAndroid.SHORT);
		}
	}
	render(){
		const {
			id,
			content,
			loading,
			error,
			busy
		} = this.state;
		const title = id == 0 ? 'Add Complain' : 'View Complain'; 
		return (
			<View style={helper.main2}>
			 <CHeader text={title} renderLeft={null} />
			 <Dazar
		      loading={loading}
		      error={error}
		      length={1}
		      onRetry={this.loadData}		      
		     />
			 <View style={{padding:5}}>			 			 
			 {id == 0 ?
			 	<TextInput value={content} onChangeText={content => this.setState({content})} style={{width:'98%',height:maxHeight,fontSize:16,alignSelf:'center',color:helper.silver,padding:0,textAlignVertical:'top'}} placeholder="Enter Your Complain In Brief" multiline placeholderTextColor={helper.grey} /> :
			 	<ScrollView>
			 	 <Text style={{fontSize:16,height:100,color:helper.silver,flex:1,width:'98%',alignSelf:'center'}}>{content}</Text>
			 	</ScrollView>
			 }			 
			 </View>
			 {id == 0 ?
			 	<View style={{position:'absolute',bottom:0,width:'100%',height:50,justifyContent:'center',alignItems:'center'}}>
			 	 <Button 
			       text={'Submit Complain'} 
			       size={14}
			       br={30}
			       onPress={this.createComplain}
			       hr={20}		      
			      />
			 	</View>
			 : null}
			 <SuccessModal ref={ref => this.successModal = ref} cancel={false}/>
			 <LoadingModal visible={busy} />
			</View>
		)
	}
}