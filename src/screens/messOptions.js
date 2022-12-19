import React, { Component } from 'react';
import {
	View,
	Text,
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
	VegNonVeg,
	Image,
	MessTBView
} from 'components';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
const days = ['M\nO\nN','T\nU\nE', 'W\nE\nD', 'T\nU\nE', 'F\nR\nI', 'S\nA\nT'];
export default class MessOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sltOpt:1,
			options:[
			 {
			 	id:1
			 },
			 {
			 	id:2
			 },
			 {
			 	id:3
			 }
			],
			breakfast:[
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
			],
			lunch:[
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
			],
			dinner:[
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
		}
		this.review = [];
	}
	componentDidMount() {
		let food_type = 3;
		//let food_type = this.props.route.params.food_type;
		this.setState({			
			food_type			
		});		
	}
	handleVgNg = () => {
		this.vgng.show(this.state.food_type);
	}
	handleChng = (food_type) => {
		this.setState({ food_type })
	}
	selectOption = () => {

	}
	handleCardPress = (item, time) => {
		this.msOpts.show({
		 time,		 
		 foods:item.foods
		});
	}
	render() {
 		const {breakfast,lunch,dinner,options,sltOpt} = this.state;
		return (
			<View style={helper.hldr}>
			 <CHeader 
			  text={`${lang.z[cl].ms} | ${lang.z[cl].sltpln}`}
			  renderLeft={this.renderLeft}
			  onLeftPress={this.handleVgNg}
			 />		 			 
			 <View style={{flexDirection:'row'}}>
			   {options.map((option, index) => 
			   	  <Button 
			       text={`${lang.z[cl].opt} ${option.id}`}
			       size={13}
			       br={30}
			       bgColor={sltOpt == option.id ? helper.primaryColor : 'transparent'}
			       style={{marginHorizontal:7,marginBottom:10}}
			       onPress={this.selectOption}
			       hr={10}		      
			      />
			   )}
			  </View>
			 <ScrollView>
			  
			  <TimeTable
			   breakfast={breakfast}
			   lunch={lunch}
			   dinner={lunch}
			   cardPress={this.handleCardPress}
			  />
		     </ScrollView>
		     
		     <View style={s.ftr}>
		          <Button 
			       text={`${lang.z[cl].slt} ${lang.z[cl].opt}  ${this.state.sltOpt}`}
			       size={13}
			       br={30}			       			       
			       onPress={this.selectOption}
			       hr={10}		      
			      />
		     </View>
		     <MessTBView ref={ref => this.msOpts = ref} />
		     <VegNonVeg ref={ref => this.vgng = ref} onSelect={this.handleChng} />	    
			</View>
		)
	}

	renderLeft = () => {
		const name = request.vegName(this.state.food_type, cl);
		return (	
		     <View style={{flexDirection:'row',alignItems:'center'}}>		
			 <Text style={s.sst}>{name}</Text>
			 <View style={s.rrc}>
				 <Icon color={helper.primaryColor} name={lang.cvd} size={19} />
			 </View>			
			 </View>
		)
	}
}
class TimeTable extends Component {
	render() {
		const {
			breakfast,
			dinner,
			lunch
		} = this.props;
		return (
			<View style={{flexDirection: 'row',width:'98%',alignSelf:'center',borderRadius:10,overflow:'hidden'}}>

			 <View style={{width:65}}>
			  <View style={{backgroundColor:'#5C5353',height:75,alignItems:'center',justifyContent:'center',elevation:24}}>
			   <Text style={{fontSize:16,fontWeight:'bold',color:helper.white,transform:[
			    {rotate:'-39deg'}
			   ]}}>{`DAYS`}</Text>
			  </View>
			  {days.map((day) => 
			  	  <View style={{backgroundColor:'#5C5353',height:75,alignItems:'center',justifyContent:'center',elevation:24}}>
				   <Text style={{fontSize:16,textAlign:'center',fontWeight:'bold',color:helper.white}}>{day}</Text>
				  </View>
			  )}
			  <View style={{backgroundColor:'#5C5353',height:75,alignItems:'center',justifyContent:'center',elevation:24}}>
				   <Text style={{fontSize:16,textAlign:'center',fontWeight:'bold',color:helper.white}}>{'S\nU\nN'}</Text>
			  </View>
			 </View>

			 <View style={{width:'82%'}}>
			   <ScrollView horizontal>
			      <View>
				      <View style={{backgroundColor:'#636363',width:180,height:75,alignItems:'center',justifyContent:'center'}}>
					   <Text style={{fontSize:16,textAlign:'center',fontWeight:'bold',color:helper.white}}>BREAKFAST</Text>
					  </View>

					  {breakfast.map((food, index) => 
					  	<FoodCard
					  	 item={food}
					  	 index={index}
					  	 onPress={() => this.props.cardPress(food, 0)}
					  	/>
					  )}
				  </View>

				  <View>
					  <View style={{backgroundColor:'#636363',width:180,height:75,alignItems:'center',justifyContent:'center'}}>
					   <Text style={{fontSize:16,textAlign:'center',fontWeight:'bold',color:helper.white}}>LUNCH</Text>
					  </View>

					  {lunch.map((food, index) => 
					  	<FoodCard
					  	 item={food}
					  	 index={index}
					  	 onPress={() => this.props.cardPress(food, 1)}
					  	/>
					  )}
				  </View>

				  <View>
					  <View style={{backgroundColor:'#636363',width:180,height:75,alignItems:'center',justifyContent:'center'}}>
					   <Text style={{fontSize:16,textAlign:'center',fontWeight:'bold',color:helper.white}}>DINNER</Text>
					  </View>
					  {dinner.map((food, index) => 
					  	<FoodCard
					  	 item={food}
					  	 index={index}
					  	 onPress={() => this.props.cardPress(food, 2)}
					  	/>
					  )}
				  </View>
			   </ScrollView>

			 </View>

			</View>
		)
	}
}
class FoodCard extends Component {
	render() {
		const {
			foodSum,
			image,
			hash
		} = this.props.item;		
		return (
		  <TouchableNativeFeedback onPress={this.props.onPress} style={{backgroundColor:helper.grey4,flexDirection:'row',width:180,height:75,alignItems:'center',justifyContent:'center'}}>
		   <View style={{height:75,width:55,justifyContent:'center',alignItems:'center'}}>
		     <Image
		        sty={{height:45,width:45,backgroundColor:helper.grey}}
			    imgSty={helper.max}
			    borderRadius={6}
			    hash={'LEHV6nWB2yk8pyo0adR*.7kCMdnj'}
			    source={{uri:image}}
		     />
		   </View>
		   <View style={{height:75,width:105,justifyContent:'center'}}>
		     <Text numberOfLines={3} style={s.pcd}>{foodSum}</Text>
		   </View>
		  </TouchableNativeFeedback>
		)
	}
}
const s = StyleSheet.create({
	rrc:{height:22,justifyContent:'center',paddingLeft:5,marginTop:5},
	fft:{fontSize:17,marginTop:5,fontWeight:'bold',color:helper.white},
	ffd:{fontSize:14,marginVertical:5,color:helper.blight},
	sst:{fontSize:20,fontWeight:'bold',marginVertical:5,marginLeft:9,color:helper.primaryColor},
	ssd:{fontSize:14,marginBottom:5,marginLeft:9,color:helper.blight},
	ftr:{alignItems:'center',justifyContent:'center',height:35,borderTopWidth:1,borderColor:helper.grey4,width:'100%'},
	pcc:{flexDirection:'row', marginHorizontal:10},
	ppt:{fontSize:16,fontWeight:'bold',color:helper.white,textAlign:'center',width:'90%',marginBottom:10},
	pc1:{height:280,width:160,elevation:10,borderRadius:10,zIndex:1000,justifyContent:'center',alignItems:'center'},
	pc2:{height:280,marginLeft:-7,justifyContent:'center',alignItems:'center'},
	pcd:{fontSize:13,color:helper.silver,width:'98%',lineHeight:16},
	pct:{fontSize:15,fontWeight:'bold',color:helper.white,width:'98%',marginTop:5,marginBottom:3},
	pcrd:{backgroundColor:helper.grey2,borderRadius:10,elevation:10,height:120,width:180,paddingLeft:13,marginVertical:8},
})