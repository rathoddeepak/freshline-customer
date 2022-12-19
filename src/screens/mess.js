import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,	
	TouchableOpacity,
	ScrollView,
	RefreshControl
} from 'react-native';
import {
	CHeader,
	Icon,
	Shimmer,
	Pager,
	RstrntRating,
	Button,
	VegNonVeg
} from 'components';
import LinearGradient from 'react-native-linear-gradient';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
import LottieView from 'lottie-react-native';

export default class Mess extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ourplans:[
			 {
			 	id:1,
			 	name:'Veg & Non Veg',
			 	theme:['#B3744B', '#CAAF44'],
			 	c1_title:'Monthly Plan',			 	
			 	c1_content:'Our Delivery  Hero Will Delivery Food to you Three Times a Day, You Can Also Customize Plan, Just Press On Customize',
			 	c2_title:'Customize',
			 	c2_content:'Delivery 3 Times A Day\nType  Veg + Non Veg'
			 },
			 {
			 	id:2,
			 	name:'Pure Veg',
			 	theme:['#B34B90', '#4C44CA'],
			 	c1_title:'Monthly Plan',			 	
			 	c1_content:'Our Delivery  Hero Will Delivery Food to you Three Times a Day, You Can Also Customize Plan, Just Press On Customize',
			 	c2_title:'Customize',
			 	c2_content:'Delivery 3 Times A Day\nType  Veg + Non Veg'
			 },
			 {
			 	id:3,
			 	name:'Heartly Non Veg',
			 	theme:['#A1531F', '#D44B4B'],
			 	c1_title:'Monthly Plan',			 	
			 	c1_content:'Our Delivery  Hero Will Delivery Food to you Three Times a Day, You Can Also Customize Plan, Just Press On Customize',
			 	c2_title:'Customize',
			 	c2_content:'Delivery 3 Times A Day\nType  Veg + Non Veg'
			 },
			]
		}
		this.review = [];
	}
	createPlan = () => {
		this.vgng.show();
	}
	navMessOptions = (food_type) => {
		this.props.navigation.navigate('MessOptions', {
			food_type
		});
	}
	render() {
 		const {ourplans} = this.state;
		return (
			<View style={helper.hldr}>
			 <CHeader text={`${lang.z[cl].ms} | ${lang.z[cl].sltpln}`} />		 			 
			 <ScrollView>
			 <View style={s.ffc}>
			  <Text style={s.fft}>{lang.z[cl].wipey}</Text>
			  <Text style={s.ffd}>{lang.z[cl].pldc}</Text>
			  <Button 
		       text={lang.z[cl].crtpln}
		       size={14}
		       style={{alignSelf:'center'}}
		       br={30}			   	     
		       onPress={this.createPlan}
		       hr={20}		      
		      />
			 </View>			
			 <Text style={s.sst}>{lang.z[cl].orplns}</Text>
			 <Text style={s.ssd}>{lang.z[cl].opdc}</Text>

			 <ScrollView horizontal style={{marginTop:15}}>
			 {ourplans.map((data, index) => {			 	
			 	return (
			 		<PlanCard
			 		  item={data}
			 		/>
			 	)
			 })}
			 </ScrollView>
			 <VegNonVeg ref={ref => this.vgng = ref} onSelect={this.navMessOptions} />
		    </ScrollView>		    
			</View>
		)
	}	
}

class PlanCard extends Component {
	render() {
		const {
			name,
			theme,
			c1_title,
			c1_content,
			c2_title,
			c2_content
		} = this.props.item;		
		return (
			<View style={s.pcc}>			
			 <LinearGradient style={s.pc1} colors={theme}>
			  <Text numberOfLines={2} style={s.ppt}>{name}</Text>
			  <Button 
		       text={lang.z[cl].chkms}
		       size={13}
		       br={30}
		       bgColor={helper.white}
		       style={{marginBottom:7}}
			   color={helper.primaryColor}
		       onPress={this.deleteCurrent}
		       hr={20}		      
		      />
		      <Button 
		       text={lang.z[cl].tmtb}
		       size={13}
		       br={30}
		       bgColor={helper.white}
			   color={helper.primaryColor}
		       onPress={this.deleteCurrent}
		       hr={20}		      
		      />
			 </LinearGradient>
			 <View style={s.pc2}>
			  <View style={s.pcrd}>
			   <Text numberOfLines={1} style={s.pct}>{c1_title}</Text>
			   <Text numberOfLines={5} style={s.pcd}>{c1_content}</Text>
			  </View>
			  <View style={s.pcrd}>
			   <Text numberOfLines={1} style={s.pct}>{c2_title}</Text>
			   <Text numberOfLines={3} style={s.pcd}>{c2_content}</Text>
			  </View>
			 </View>
			</View>
		)
	}
}
const s = StyleSheet.create({
	ffc:{width:'95%',borderRadius:8,alignSelf:'center',marginVertical:10,padding:7,backgroundColor:helper.grey2},
	fft:{fontSize:17,marginTop:5,fontWeight:'bold',color:helper.white},
	ffd:{fontSize:14,marginVertical:5,color:helper.blight},
	sst:{fontSize:20,fontWeight:'bold',marginVertical:5,marginLeft:9,color:helper.primaryColor},
	ssd:{fontSize:14,marginBottom:5,marginLeft:9,color:helper.blight},

	pcc:{flexDirection:'row', marginHorizontal:10},
	ppt:{fontSize:16,fontWeight:'bold',color:helper.white,textAlign:'center',width:'90%',marginBottom:10},
	pc1:{height:280,width:160,elevation:10,borderRadius:10,zIndex:1000,justifyContent:'center',alignItems:'center'},
	pc2:{height:280,marginLeft:-7,justifyContent:'center',alignItems:'center'},
	pcd:{fontSize:13,color:helper.silver,width:'98%',lineHeight:16},
	pct:{fontSize:15,fontWeight:'bold',color:helper.white,width:'98%',marginTop:5,marginBottom:3},
	pcrd:{backgroundColor:helper.grey2,borderRadius:10,elevation:10,height:120,width:180,paddingLeft:13,marginVertical:8},
})