import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,		
	ScrollView,
	RefreshControl,
	TextInput,
	TouchableOpacity,
	TouchableNativeFeedback,
	Modal
} from 'react-native';
import {
	CHeader,
	Icon,
	Shimmer,
	Pager,
	RstrntRating,
	Button,
	VegNonVeg,
	Image,
	CheckBox
} from 'components';
import LinearGradient from 'react-native-linear-gradient';
import request from 'libs/request';
import Calender from 'libs/calender';
import helper from 'assets/helper';
import lang from 'assets/lang';
import moment from 'moment';
import {View as AniView} from 'react-native-animatable';
const BreakfastColor = '#7DDCFF';
const lunchColor = '#FFFF1E';
const dinnerColor = '#8A58FF';
const seventh = '14.28%';
const trans = 'transparent';
export default class CustomPlan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			calenderData:[],
			plnName:'',
			total:0,
			forDays:0,
			weeks:[]
		}		
	}
	componentDidMount() {
		const calenderData = Calender.ganerateCalendar();
		this.setState({calenderData}, () => {
			this.startCalculating()
		})		
	}
	startCalculating = () => {
		let cData = this.state.calenderData;
		let total = 0;		
		let forDays = 0;
		cData.forEach((month) => {
			for(let i = 0; i < month.dates.length; i++) {
				if(month.dates[i]?.date){
					let idx = Calender.whichDay(i);
					total += breakfastOption[idx].amount;
					total += lunchOption[idx].amount;
					total += dinnerOption[idx].amount;
					forDays++;
				}
			}			
		});
		this.setState({total,forDays});
	}
	handleDatePress = ({date, breakfast, lunch, dinner}, monthIdx, idx) => {
		const {
			month,
			year,
			monthid
		} = this.state.calenderData[monthIdx];				
		let day = moment(`${year}-${("0" + (monthid)).slice(-2)}-${("0" + (date)).slice(-2)}`).day();		
		if(day == 0)day = 6;
		else day = day - 1;		
		const lunchItm = lunchOption[day];
		const dinnerItm = dinnerOption[day];
		const breakfastItm = breakfastOption[day];		
		this.dailyModal.show(
			{month,breakfast,dinner,lunch,date,idx,monthIdx},
			{lunchItm,dinnerItm,breakfastItm}
		);
	}
	handleDateChange = ({monthIdx,idx,breakfast,lunch,dinner}) => {		
		let calenderData = this.state.calenderData;
		let temp = calenderData[monthIdx].dates[idx];				
		let cData = this.state.calenderData;
		let total = this.state.total;
		let optIdx = Calender.whichDay(idx);
		let forDays = this.state.forDays;
		if(breakfast != temp['breakfast'])total = breakfast ? 
			(total + breakfastOption[optIdx].amount) : (total - breakfastOption[optIdx].amount);			
		if(lunch != temp['lunch'])total = lunch ? 
			(total + lunchOption[optIdx].amount) : (total - lunchOption[optIdx].amount);	
	    if(dinner != temp['dinner'])total = dinner ? 
			(total + dinnerOption[optIdx].amount) : (total - dinnerOption[optIdx].amount);

		if(!breakfast && !lunch && !dinner){
			if(breakfast != temp['breakfast'] || lunch != temp['lunch']  || dinner != temp['dinner'])
				forDays--;			
		}else if(!temp['breakfast'] && !temp['breakfast'] && !temp['breakfast']){
			if(breakfast != temp['breakfast']  || lunch != temp['lunch'] || dinner != temp['dinner'])
				forDays++;			
		}

	    temp['breakfast'] = breakfast;
		temp['lunch'] = lunch;
		temp['dinner'] = dinner;
		calenderData[monthIdx].dates[idx] = temp;		
		this.setState({calenderData, total, forDays})
	}
	render() {
 		const {calenderData,plnName,total,forDays} = this.state;
		return (
			<View style={helper.hldr}>
			 <CHeader 
			  text={`${lang.z[cl].ms} | ${lang.z[cl].sltpln}`}
			  renderLeft={null}
			  onLeftPress={this.handleVgNg}
			 />
			 <ScrollView>
			 <CalenderView
			  data={calenderData}
			  onDatePress={this.handleDatePress}
			 />
			 <View style={{flexDirection:'row'}}>			  
			  <View style={{width:'50%',padding:5}}>
			   <Text style={s.ssd}>Press on Date to Customize Your Plan</Text>
			  </View>

			  <View style={{width:'50%',flexDirection:'row',flexWrap:'wrap'}}>
			      <View style={{flexDirection:'row',alignItems:'center'}}>
				  	 <View style={{height:9,width:9,borderRadius:8,backgroundColor:BreakfastColor}} />
				  	 <Text style={[s.ssd, {fontWeight:'bold'}]}>{lang.z[cl].brfs} </Text>
			  	  </View>
			  	  <View style={{flexDirection:'row',alignItems:'center'}}>
				  	 <View style={{height:9,width:9,borderRadius:8,backgroundColor:lunchColor}} />
				  	 <Text style={[s.ssd, {fontWeight:'bold'}]}>{lang.z[cl].lnh} </Text>
			  	  </View>
			  	  <View style={{flexDirection:'row',alignItems:'center'}}>
				  	 <View style={{height:9,width:9,borderRadius:8,backgroundColor:dinnerColor}} />
				  	 <Text style={[s.ssd, {fontWeight:'bold'}]}>{lang.z[cl].dnr} </Text>
			  	  </View>
			  </View>
			 </View>

			 <View style={{flexDirection:'row'}}>
			    <TextInput
				   style={[s.inpt, {width:"60%"}]}
				   placeholder={lang.z[cl].plnNm}
				   onChangeText={this.handleAddress}
				   value={plnName}
				   placeholderTextColor={helper.greyw} 
			    />
			     <Text style={[s.inpt, {padding:5}]}>Option 1</Text>
			 </View>
			 <Text style={s.sst}>Settings</Text>
			 
			 <View style={{width:90,height:90,justifyContent:'center',alignItems:'center',backgroundColor:helper.grey4, marginTop:5, marginLeft:10,marginBottom:10,borderRadius:10}}>
			  <Icon name={lang.pry} color={helper.primaryColor} size={40} />
			  <Text style={s.ssz}>{lang.z[cl].upws}</Text>
			 </View>

			 </ScrollView>
			 <View style={s.ftr}>
			   <Text style={{fontSize:14,marginLeft:10,fontWeight:'bold',color:helper.silver}}>{lang.rp}{total} For {forDays} Days</Text>
			   <View style={{position: 'absolute',right:5,top:10}}>
			   <Button 
			       text={lang.z[cl].smt} 
			       size={14}
			       br={30}			       
			       onPress={this.deleteCurrent}
			       hr={20}		      
			    />
			   </View>
			 </View>
			 <UpwasModel ref={ref => (this.dailyModal = ref)} onSelect={this.handleDateChange} />
			 <DailyModal ref={ref => (this.dailyModal = ref)} onSelect={this.handleDateChange} />
			</View>
		)
	}
}

class UpwasModel extends Component {
	constructor(props) {
		this.state = {
			weeks:[],
			data:[
			 'Every Monday',
			 'Every Tuesday',
			 'Every Wednesday',
			 'Every Thursday',
			 'Every Friday',
			 'Every Saturday',
			 'Every Sunday'
			]
		}
	}	
	show = (weeks) => this.setState({visible:true,weeks})
	close = () => this.setState({visible:false})
	submit = () => this.props.onSubmit(this.state.weeks);	
	handleChange = (v, i) => {
		let weeks = this.state.weeks;
		weeks[i] = v;
		this.setState({ weeks })
	}	
	render() {
		const {
			data
		} = this.state;
		return (
			<Modal visible={visible} transparent animationType="fade" onRequestClose={this.handleClose}><View style={helper.model}>
			<View style={{width:'85%',backgroundColor:helper.grey4,borderRadius:10,elevation:10}}>
			 {data.map((item, i) => {
			 	<View style={{flexDirection:'row'}}>
			        <CheckBox
				     style={{margin:7}}
				     size={20}
				     borderColor={helper.white}
				     color={BreakfastColor}
				     selected={breakfast}
				     onChange={(v) => this.handleChange(v, i)}
				    />
				    <Text style={{fontSize:16,color:helper.white,fontWeight:'bold'}}>{item}</Text>
				 </View>
			 })}
			</View></View></Modal>
		)
	}
}
class CalenderView extends Component {
	render() {
		const {
			data,
			onDatePress
		} = this.props;
		return (
			<View style={{width:'98%',alignSelf:'center',backgroundColor:helper.grey4,borderRadius:10,elevation:10,padding:5,marginVertical:10}}>
			  {data.map((m, mi) => 
			  	<View style={{width:'96%',alignSelf:'center'}} key={mi}>
			  	 <Text style={{textAlign:'center',width:'100%',fontSize:14,fontWeight:'bold',color:helper.silver,marginVertical:10}}>{m.month}</Text>
			  	 <View style={{flexDirection:'row'}}>
				  	 <Text style={{textAlign:'center',width:seventh,fontSize:10,fontWeight:'bold',color:helper.silver}}>MON</Text>
				  	 <Text style={{textAlign:'center',width:seventh,fontSize:10,fontWeight:'bold',color:helper.silver}}>TUE</Text>
				  	 <Text style={{textAlign:'center',width:seventh,fontSize:10,fontWeight:'bold',color:helper.silver}}>WED</Text>
				  	 <Text style={{textAlign:'center',width:seventh,fontSize:10,fontWeight:'bold',color:helper.silver}}>THU</Text>
				  	 <Text style={{textAlign:'center',width:seventh,fontSize:10,fontWeight:'bold',color:helper.silver}}>FRI</Text>
				  	 <Text style={{textAlign:'center',width:seventh,fontSize:10,fontWeight:'bold',color:helper.silver}}>SAT</Text>
				  	 <Text style={{textAlign:'center',width:seventh,fontSize:10,fontWeight:'bold',color:helper.silver}}>SUN</Text>				  	 
			  	 </View>
			  	 <View style={{flexDirection:'row',flexWrap:'wrap'}}>
				  	 {m.dates.map((d, di) => <Date 
				  	 	key={di} 
				  	    date={d.date} 
				  	    onPress={() => onDatePress(d, mi, di)}
				  	    breakfast={d.breakfast}
				  	    lunch={d.lunch}
				  	    dinner={d.dinner}
				  	    disabled={d.disabled} />
				  	 )}
			  	 </View>
			  	</View>
			  )}
			</View>

		)
	}
}
class DailyModal extends Component {
	constructor(props){
		super(props)
		this.state = {
			visible: false,
			closing:false,
			lunchItm:{},
			dinnerItm:{},
			breakfastItm:{}		
		}
		this.anims = [];
	}
	show = ({breakfast, dinner, lunch, idx, date, month, monthIdx}, {lunchItm, dinnerItm, breakfastItm}) => {
		this.setState({
			breakfast,
			dinner,
			lunch,						
			month,
			date,
			idx,
			monthIdx,
			lunchItm,
			dinnerItm,
			breakfastItm
		}, () => {
			this.setState({
				visible: true,
				closing:false
			})
		})
	}
	handleClose = () => {
		if(this.state.closing == false)this.setState({closing:true})
		else return;
		this.anims.forEach(anim => anim?.fadeOutDown());
		setTimeout(() => this.setState({ visible: false }), 920)				
	}
	handleSelect = () => {
		const {monthIdx,idx,breakfast,lunch,dinner} = this.state;
		this.props.onSelect({monthIdx,idx,breakfast,lunch,dinner})
		this.handleClose();
	}
	render() {
		const {
			breakfastItm,
			lunchItm,
			dinnerItm,
			breakfast,
			visible,
			dinner,
			lunch,
			index,
			month,
			date
		} = this.state;
		return (
			<Modal visible={visible} transparent animationType="fade" onRequestClose={this.handleClose}><View style={helper.model}>
			  <Text style={{fontSize:16,fontWeight:'bold',marginBottom:5,color:'white'}}>{`${lang.z[cl].mspn} | ${date} ${month}`}</Text>
			  <Text style={{fontSize:14,fontWeight:'bold',marginBottom:25,color:'white'}}>{lang.z[cl].cdpl}</Text>
			     <AniView ref={ref => this.anims[0] = ref} duration={900} animation="fadeInUp" style={{flexDirection:'row',width:'90%',height:100,marginBottom:14}}>
				    <CheckBox
				     style={{margin:7}}
				     size={20}
				     borderColor={helper.white}
				     color={BreakfastColor}
				     selected={breakfast}
				     onChange={(breakfast) => this.setState({breakfast})}
				    />				    
				    <View style={{marginLeft:5,width:'90%',height:90,marginBottom:9,flexDirection:'row',alignItems:'center',backgroundColor:helper.grey2,borderRadius:10}}>
					     <Image
					        sty={{height:60,width:60,backgroundColor:helper.grey,marginLeft:10}}
						    imgSty={helper.max}
						    borderRadius={100}
						    hash={'LEHV6nWB2yk8pyo0adR*.7kCMdnj'}
						    source={{uri:breakfastItm.image}}
					     />
					     <View style={{position: 'absolute',paddingHorizontal:7,paddingVertical:3,top:-15,left:10,justifyContent:'center',borderRadius:5,alignItems:'center',backgroundColor:helper.grey2}}>
					      <Text style={{fontSize:15,fontWeight:'bold',color:'white'}}>{lang.z[cl].brfs}</Text>
					     </View>
					    <View style={s.itm}>
					     <Text style={s.itt}>{breakfastItm.foodSum}</Text>
					     <Text style={s.idd}>Served In Bowl</Text>
					     <Text style={s.idd}>{`${lang.rp}${breakfastItm.amount}`} <Text style={s.idc}>{`${lang.rp}${breakfastItm.amount}`}</Text></Text>
					    </View>
					</View>				    
				 </AniView>

				 <AniView ref={ref => this.anims[1] = ref} duration={900} animation="fadeInUp" style={{flexDirection:'row',width:'90%',height:100,marginBottom:14}}>
				    <CheckBox 
				     style={{margin:7}} 
				     size={20} 
				     borderColor={helper.white}
				     color={lunchColor}
				     selected={lunch}
				     onChange={(lunch) => this.setState({lunch})}
				    />     
				    <View style={{marginLeft:5,width:'90%',height:90,marginBottom:9,flexDirection:'row',alignItems:'center',backgroundColor:helper.grey2,borderRadius:10}}>
					     <Image
					        sty={{height:60,width:60,backgroundColor:helper.grey,marginLeft:10}}
						    imgSty={helper.max}
						    borderRadius={100}
						    hash={'LEHV6nWB2yk8pyo0adR*.7kCMdnj'}
						    source={{uri:lunchItm.image}}
					     />
					     <View style={{position: 'absolute',paddingHorizontal:7,paddingVertical:3,top:-15,left:10,justifyContent:'center',borderRadius:5,alignItems:'center',backgroundColor:helper.grey2}}>
					      <Text style={{fontSize:15,fontWeight:'bold',color:'white'}}>{lang.z[cl].lnh}</Text>
					     </View>
					    <View style={s.itm}>
					     <Text style={s.itt}>{lunchItm.foodSum}</Text>
					     <Text style={s.idd}>Served In Bowl</Text>
					     <Text style={s.idd}>{`${lang.rp}${lunchItm.amount}`} <Text style={s.idc}>{`${lang.rp}${lunchItm.amount}`}</Text></Text>
					    </View>
					</View>
				 </AniView>

				 <AniView ref={ref => this.anims[2] = ref} duration={900} animation="fadeInUp" style={{flexDirection:'row',width:'90%',height:100,marginBottom:14}}>
				    <CheckBox 
				     style={{margin:7}} 
				     size={20} 
				     borderColor={helper.white}
				     color={dinnerColor}
				     selected={dinner}
				     onChange={(dinner) => this.setState({dinner})}
				    />
				    <View style={{marginLeft:5,width:'90%',height:90,marginBottom:9,flexDirection:'row',alignItems:'center',backgroundColor:helper.grey2,borderRadius:10}}>
					     <Image
					        sty={{height:60,width:60,backgroundColor:helper.grey,marginLeft:10}}
						    imgSty={helper.max}
						    borderRadius={100}
						    hash={'LEHV6nWB2yk8pyo0adR*.7kCMdnj'}
						    source={{uri:dinnerItm.image}}
					     />
					     <View style={{position: 'absolute',paddingHorizontal:7,paddingVertical:3,top:-15,left:10,justifyContent:'center',borderRadius:5,alignItems:'center',backgroundColor:helper.grey2}}>
					      <Text style={{fontSize:15,fontWeight:'bold',color:'white'}}>{lang.z[cl].dnr}</Text>
					     </View>
					    <View style={s.itm}>
					     <Text style={s.itt}>{dinnerItm.foodSum}</Text>
					     <Text style={s.idd}>Served In Bowl</Text>
					     <Text style={s.idd}>{`${lang.rp}${dinnerItm.amount}`} <Text style={s.idc}>{`${lang.rp}${dinnerItm.amount}`}</Text></Text>
					    </View>
					</View>
				 </AniView>

				 <AniView ref={ref => this.anims[3] = ref} duration={900} animation="fadeInUp">
				 <Button 
			       text={lang.z[cl].smt} 
			       size={14}
			       br={30}			       
			       onPress={this.handleSelect}
			       hr={20}		      
			    />
			    </AniView>
			</View></Modal>
		)
	}
}
class Date extends Component {
	render() {
		const {
			date,
			disabled,
			onPress,
			dinner,
			breakfast,
			lunch
		} = this.props;
		if(disabled)
			return <View style={{width:seventh,marginVertical:10}} />
		else
			return (
				<TouchableNativeFeedback onPress={onPress}><View style={{width:seventh,marginVertical:10}}>
				 <Text style={{textAlign:'center',fontSize:14,fontWeight:'bold',color:helper.silver,width:'100%',color:helper.silver}}>{date}</Text>
				    <View style={{flexDirection:'row',justifyContent:'center'}}>
					  <View style={{height:4,width:4,borderRadius:8,backgroundColor:breakfast ? BreakfastColor : trans,margin:1}} />
					  <View style={{height:4,width:4,borderRadius:8,backgroundColor:lunch ? lunchColor : trans,margin:1}} />
					  <View style={{height:4,width:4,borderRadius:8,backgroundColor:dinner ? dinnerColor : trans,margin:1}} />
					</View>
				</View></TouchableNativeFeedback>
			)
	}
}
const s = StyleSheet.create({
	inpt:{fontSize:16,padding:0,color:helper.silver,justifyContent: 'center',borderWidth:1,borderColor:helper.grey1,backgroundColor:helper.grey6,borderRadius:5,height:34,margin:10,paddingHorizontal:10},
	rrc:{height:22,justifyContent:'center',paddingLeft:5,marginTop:5},
	fft:{fontSize:17,marginTop:5,fontWeight:'bold',color:helper.white},
	ffd:{fontSize:14,marginVertical:5,color:helper.blight},
	sst:{fontSize:20,fontWeight:'bold',marginVertical:5,marginLeft:9,color:helper.primaryColor},
	ssz:{fontSize:14,fontWeight:'bold',marginTop:5,color:helper.primaryColor},
	ssd:{fontSize:14,marginBottom:2,marginHorizontal:4,color:helper.blight},
	ftr:{justifyContent:'center',height:45,borderTopWidth:2,borderColor:helper.grey4,width:'100%'},
	pcc:{flexDirection:'row', marginHorizontal:10},
	ppt:{fontSize:16,fontWeight:'bold',color:helper.white,textAlign:'center',width:'90%',marginBottom:10},
	pc1:{height:280,width:160,elevation:10,borderRadius:10,zIndex:1000,justifyContent:'center',alignItems:'center'},
	pc2:{height:280,marginLeft:-7,justifyContent:'center',alignItems:'center'},
	pcd:{fontSize:13,color:helper.silver,width:'98%',lineHeight:16},
	pct:{fontSize:15,fontWeight:'bold',color:helper.white,width:'98%',marginTop:5,marginBottom:3},
	pcrd:{backgroundColor:helper.grey2,borderRadius:10,elevation:10,height:120,width:180,paddingLeft:13,marginVertical:8},

		
	itm:{marginLeft:10,width:'60%'},
	itt:{fontSize:13,fontWeight:'bold',color:helper.silver},
	idd:{fontSize:14,color:helper.silver},
	idc:{textDecorationLine: 'line-through',color:helper.greyw}
})

const breakfastOption = [
			 {
            	amount:10,
			 	image:'https://2.bp.blogspot.com/-cCZYo_TlMdk/Vp3XPbqfaSI/AAAAAAAADKU/Klj9ElXg_-4/s1600/2016-01-19_07.44.05.jpg',
			 	foodSum:'1 Banana, 1 Cup Organic Puffed Rice',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:5,
			 	 	carrier:helper.NONE,
			 	 	image:'https://api.time.com/wp-content/uploads/2019/11/gettyimages-459761948.jpg?quality=85&crop=0px%2C74px%2C1024px%2C536px&resize=1200%2C628&strip',
			 	 	name:'Banana'
			 	 },
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:10,
			 	 	carrier:helper.GLASS,
			 	 	image:'https://www.thefullpantry.com.au/wp-content/uploads/2017/10/puffed-brown-rice-organic-1.jpg',
			 	 	name:'Organic Puffed Rice'
			 	 }
			 	]
			 },
			 {
			 	amount:10,
			 	image:'https://www.yummymummykitchen.com/wp-content/uploads/2016/01/chia-pudding-ratio.jpg',
			 	foodSum:'Vanilla Chia pudding With 1 Cup Fresh Berries',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:10,
			 	 	carrier:helper.GLASS,
			 	 	image:'https://choosingchia.com/jessh-jessh/uploads/2020/04/classic-vanilla-chia-pudding-7-1.jpg',
			 	 	name:'Vanilla Chia'
			 	 }
			 	]
			 },			 
			 {
			 	amount:20,
			 	image:'https://www.jessicagavin.com/wp-content/uploads/2015/12/healthy-strawberry-smoothie-with-almond-milk-and-oats.jpg',
			 	foodSum:'Smoothie With 1 Cup Almond Milk',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:40,
			 	 	carrier:helper.GLASS,
			 	 	image:'https://detoxinista.com/wp-content/uploads/2010/11/how-to-make-almond-milk-500x375.jpg',
			 	 	name:'Smoothie'
			 	 }			 	 
			 	]
			 },
			 {
			 	amount:10,
			 	image:'https://www.cubesnjuliennes.com/wp-content/uploads/2019/11/Poha-1.jpg',
			 	foodSum:'1 Plate Red Rice Poha',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	image:'https://www.cubesnjuliennes.com/wp-content/uploads/2019/11/Poha-1.jpg',
			 	 	amount:50,
			 	 	carrier:helper.PLATE,			 	 	
			 	 	name:'Red Rice Poha'
			 	 }			 	 
			 	]
			 },			 
			 {
			 	amount:20,
			 	image:'https://www.shanazrafiq.com/wp-content/uploads/2016/03/2-DSC_0179.jpg',
			 	foodSum:'2 Alu Paratha',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:2,
			 	 	amount:50,
			 	 	carrier:helper.PLATE,
			 	 	image:'https://www.shanazrafiq.com/wp-content/uploads/2016/03/2-DSC_0179.jpg',
			 	 	name:'Alu Paratha'
			 	 }			 	 
			 	]
			 },			 	
			 {
			 	amount:20,
			 	image:'https://i1.wp.com/myvegetarianroots.com/wp-content/uploads/2020/08/DSC_0033.jpeg?fit=1920%2C1277&ssl=1',
			 	foodSum:'3 Fried Boiled Egg',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	amount:30,
			 	 	quantity:4,
			 	 	carrier:helper.PLATE,
			 	 	image:'https://i1.wp.com/myvegetarianroots.com/wp-content/uploads/2020/08/DSC_0033.jpeg?fit=1920%2C1277&ssl=1',
			 	 	name:'Fried Boiled Egg'
			 	 }			 	 
			 	]
			 },			 	
			 {
			 	amount:10,
			 	image:'https://www.sanjeevkapoor.com/UploadFiles/RecipeImages/Cauliflower-Manchurian.jpg',
			 	foodSum:'1 Plate Veg Manchurian',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	image:'https://www.sanjeevkapoor.com/UploadFiles/RecipeImages/Cauliflower-Manchurian.jpg',
			 	 	carrier:helper.PLATE,
			 	 	amount:50,
			 	 	name:'Veg Manchurian'
			 	 }			 	 
			 	]
			 }
			];

			const lunchOption = [
			 {
            	amount:10,
			 	image:'https://2.bp.blogspot.com/-cCZYo_TlMdk/Vp3XPbqfaSI/AAAAAAAADKU/Klj9ElXg_-4/s1600/2016-01-19_07.44.05.jpg',
			 	foodSum:'1 Banana, 1 Cup Organic Puffed Rice',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:5,
			 	 	carrier:helper.NONE,
			 	 	image:'https://api.time.com/wp-content/uploads/2019/11/gettyimages-459761948.jpg?quality=85&crop=0px%2C74px%2C1024px%2C536px&resize=1200%2C628&strip',
			 	 	name:'Banana'
			 	 },
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:10,
			 	 	carrier:helper.GLASS,
			 	 	image:'https://www.thefullpantry.com.au/wp-content/uploads/2017/10/puffed-brown-rice-organic-1.jpg',
			 	 	name:'Organic Puffed Rice'
			 	 }
			 	]
			 },
			 {
			 	amount:10,
			 	image:'https://www.yummymummykitchen.com/wp-content/uploads/2016/01/chia-pudding-ratio.jpg',
			 	foodSum:'Vanilla Chia pudding With 1 Cup Fresh Berries',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:10,
			 	 	carrier:helper.GLASS,
			 	 	image:'https://choosingchia.com/jessh-jessh/uploads/2020/04/classic-vanilla-chia-pudding-7-1.jpg',
			 	 	name:'Vanilla Chia'
			 	 }
			 	]
			 },			 
			 {
			 	amount:20,
			 	image:'https://www.jessicagavin.com/wp-content/uploads/2015/12/healthy-strawberry-smoothie-with-almond-milk-and-oats.jpg',
			 	foodSum:'Smoothie With 1 Cup Almond Milk',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:40,
			 	 	carrier:helper.GLASS,
			 	 	image:'https://detoxinista.com/wp-content/uploads/2010/11/how-to-make-almond-milk-500x375.jpg',
			 	 	name:'Smoothie'
			 	 }			 	 
			 	]
			 },
			 {
			 	amount:10,
			 	image:'https://www.cubesnjuliennes.com/wp-content/uploads/2019/11/Poha-1.jpg',
			 	foodSum:'1 Plate Red Rice Poha',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	image:'https://www.cubesnjuliennes.com/wp-content/uploads/2019/11/Poha-1.jpg',
			 	 	amount:50,
			 	 	carrier:helper.PLATE,			 	 	
			 	 	name:'Red Rice Poha'
			 	 }			 	 
			 	]
			 },			 
			 {
			 	amount:20,
			 	image:'https://www.shanazrafiq.com/wp-content/uploads/2016/03/2-DSC_0179.jpg',
			 	foodSum:'2 Alu Paratha',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:2,
			 	 	amount:50,
			 	 	carrier:helper.PLATE,
			 	 	image:'https://www.shanazrafiq.com/wp-content/uploads/2016/03/2-DSC_0179.jpg',
			 	 	name:'Alu Paratha'
			 	 }			 	 
			 	]
			 },			 	
			 {
			 	amount:20,
			 	image:'https://i1.wp.com/myvegetarianroots.com/wp-content/uploads/2020/08/DSC_0033.jpeg?fit=1920%2C1277&ssl=1',
			 	foodSum:'3 Fried Boiled Egg',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	amount:30,
			 	 	quantity:4,
			 	 	carrier:helper.PLATE,
			 	 	image:'https://i1.wp.com/myvegetarianroots.com/wp-content/uploads/2020/08/DSC_0033.jpeg?fit=1920%2C1277&ssl=1',
			 	 	name:'Fried Boiled Egg'
			 	 }			 	 
			 	]
			 },			 	
			 {
			 	amount:10,
			 	image:'https://www.sanjeevkapoor.com/UploadFiles/RecipeImages/Cauliflower-Manchurian.jpg',
			 	foodSum:'1 Plate Veg Manchurian',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	image:'https://www.sanjeevkapoor.com/UploadFiles/RecipeImages/Cauliflower-Manchurian.jpg',
			 	 	carrier:helper.PLATE,
			 	 	amount:50,
			 	 	name:'Veg Manchurian'
			 	 }			 	 
			 	]
			 }			
			]

			const dinnerOption = [
			 {
            	amount:10,
			 	image:'https://2.bp.blogspot.com/-cCZYo_TlMdk/Vp3XPbqfaSI/AAAAAAAADKU/Klj9ElXg_-4/s1600/2016-01-19_07.44.05.jpg',
			 	foodSum:'1 Banana, 1 Cup Organic Puffed Rice',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:5,
			 	 	carrier:helper.NONE,
			 	 	image:'https://api.time.com/wp-content/uploads/2019/11/gettyimages-459761948.jpg?quality=85&crop=0px%2C74px%2C1024px%2C536px&resize=1200%2C628&strip',
			 	 	name:'Banana'
			 	 },
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:10,
			 	 	carrier:helper.GLASS,
			 	 	image:'https://www.thefullpantry.com.au/wp-content/uploads/2017/10/puffed-brown-rice-organic-1.jpg',
			 	 	name:'Organic Puffed Rice'
			 	 }
			 	]
			 },
			 {
			 	amount:10,
			 	image:'https://www.yummymummykitchen.com/wp-content/uploads/2016/01/chia-pudding-ratio.jpg',
			 	foodSum:'Vanilla Chia pudding With 1 Cup Fresh Berries',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:10,
			 	 	carrier:helper.GLASS,
			 	 	image:'https://choosingchia.com/jessh-jessh/uploads/2020/04/classic-vanilla-chia-pudding-7-1.jpg',
			 	 	name:'Vanilla Chia'
			 	 }
			 	]
			 },			 
			 {
			 	amount:20,
			 	image:'https://www.jessicagavin.com/wp-content/uploads/2015/12/healthy-strawberry-smoothie-with-almond-milk-and-oats.jpg',
			 	foodSum:'Smoothie With 1 Cup Almond Milk',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	amount:40,
			 	 	carrier:helper.GLASS,
			 	 	image:'https://detoxinista.com/wp-content/uploads/2010/11/how-to-make-almond-milk-500x375.jpg',
			 	 	name:'Smoothie'
			 	 }			 	 
			 	]
			 },
			 {
			 	amount:10,
			 	image:'https://www.cubesnjuliennes.com/wp-content/uploads/2019/11/Poha-1.jpg',
			 	foodSum:'1 Plate Red Rice Poha',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	image:'https://www.cubesnjuliennes.com/wp-content/uploads/2019/11/Poha-1.jpg',
			 	 	amount:50,
			 	 	carrier:helper.PLATE,			 	 	
			 	 	name:'Red Rice Poha'
			 	 }			 	 
			 	]
			 },			 
			 {
			 	amount:20,
			 	image:'https://www.shanazrafiq.com/wp-content/uploads/2016/03/2-DSC_0179.jpg',
			 	foodSum:'2 Alu Paratha',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:2,
			 	 	amount:50,
			 	 	carrier:helper.PLATE,
			 	 	image:'https://www.shanazrafiq.com/wp-content/uploads/2016/03/2-DSC_0179.jpg',
			 	 	name:'Alu Paratha'
			 	 }			 	 
			 	]
			 },			 	
			 {
			 	amount:20,
			 	image:'https://i1.wp.com/myvegetarianroots.com/wp-content/uploads/2020/08/DSC_0033.jpeg?fit=1920%2C1277&ssl=1',
			 	foodSum:'3 Fried Boiled Egg',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	amount:30,
			 	 	quantity:4,
			 	 	carrier:helper.PLATE,
			 	 	image:'https://i1.wp.com/myvegetarianroots.com/wp-content/uploads/2020/08/DSC_0033.jpeg?fit=1920%2C1277&ssl=1',
			 	 	name:'Fried Boiled Egg'
			 	 }			 	 
			 	]
			 },			 	
			 {
			 	amount:10,
			 	image:'https://www.sanjeevkapoor.com/UploadFiles/RecipeImages/Cauliflower-Manchurian.jpg',
			 	foodSum:'1 Plate Veg Manchurian',
			 	foods:[
			 	 {
			 	 	id:1,
			 	 	veg:1,
			 	 	quantity:1,
			 	 	image:'https://www.sanjeevkapoor.com/UploadFiles/RecipeImages/Cauliflower-Manchurian.jpg',
			 	 	carrier:helper.PLATE,
			 	 	amount:50,
			 	 	name:'Veg Manchurian'
			 	 }			 	 
			 	]
			 }
			]