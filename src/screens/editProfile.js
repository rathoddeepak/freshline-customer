import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ToastAndroid,
	TextInput
} from 'react-native';
import {
	NHeader,
	LoadingModal,
	Dazar,
	Button,
	SuccessModal
} from 'components';
import UserDB from 'libs/userdb';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
import Parse from 'parse/react-native';

export default class EditProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:'',
			busy:false,
			loading:true,
			error:false
		}
		this.abt = '';
		this.phn = '';
	}
	componentDidMount() {
		this.loadData();		
	}
	loadData = async () => {
		this.setState({loading:true,error:false});
		try {
			const query = new Parse.Query(helper.tbls.UR);
			const user = await query.get(user_id);
			const {id, attributes:{name, phone_no}} = user;
			this.setState({name,phone_no,loading:false});
		}catch(err){
			alert(err)
			this.setState({loading:false,error:true})
		}
	}
	submit = async () => {
		let phone_no = request.removeSpaces(this.state.phone_no);		
		let name = request.removeSpaces(this.state.name);		
		if(request.isBlank(name)){
			ToastAndroid.show('Please Enter First Name', ToastAndroid.SHORT);
			return;
		}else if(name.length == 2){
			ToastAndroid.show('First Name too short!', ToastAndroid.SHORT);
			return;
		}else if(request.isBlank(phone_no) && phone_no.length != 10){
			ToastAndroid.show('Invalid Phone Number!', ToastAndroid.SHORT);
			return;
		}
		try {
			this.setState({busy:true});
			const User = Parse.Object.extend(helper.tbls.UR);
			const user = new User();
			user.id = user_id;
			user.set("name", name);
			await user.save();
			this.setState({busy:false});

			this.successModal.show();
	  	setTimeout(() => {
	  		this.successModal.close(true);		  		
	  	}, 2000);
	  	UserDB.setName(name);
			ToastAndroid.show('Details Updated Successfully!', ToastAndroid.SHORT);
		}catch(err){
			this.setState({busy:false});
			ToastAndroid.show(lang.z[cl].aeo, ToastAndroid.SHORT);	
		}
	}
	render() {
		const {
			busy,
			name,
			phone_no,
			loading,
			error
		} = this.state;
		return (
			<View style={s.main}>
				<NHeader title={lang.z[cl].edp} onPressBack={() => this.props.navigation.goBack()}/>
				 <Dazar
			      loading={loading}
			      error={error}			      
			      onRetry={this.loadData}
			      length={1}			      
			     />			
				 {!loading && !error ? <View style={helper.max}><ScrollView>
				  
				  <TextInput onChangeText={name => this.setState({name})} value={name} style={s.stb} placeholder={lang.z[cl].fnm} placeholderTextColor={helper.grey} />
				  <TextInput keyboardType="numeric" editable={false} onChangeText={phone_no => this.setState({phone_no})} value={phone_no} style={s.stb} placeholder={lang.z[cl].phn} placeholderTextColor={helper.grey} />

				  <Button
			       text={lang.z[cl].smt}
			       size={16}
			       br={30}
			       style={{alignSelf:'center',marginTop:10}}
			       onPress={this.submit}
			       hr={40}
			      />

				 </ScrollView></View> : null}
				 <LoadingModal visible={busy} />
				 <SuccessModal ref={ref => this.successModal = ref} cancel={false}/>
			</View>
		)
	}
}


function cp(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const s = StyleSheet.create({
	main:{height:'100%',width:'100%',backgroundColor:helper.homeBgColor},
	stb:{height:50,fontSize:19,padding:6,backgroundColor:helper.white,borderRadius:9,marginVertical:10,color:helper.blk,elevation:12,width:'90%',alignSelf:'center'}
})