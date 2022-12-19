import React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  BackHandler,
  Keyboard,  
  ToastAndroid,
  ScrollView,
  Picker,
  Image,
  Text,
  TouchableNativeFeedback
} from 'react-native';
import {
 TabView, 
 TabBar, 
 SceneMap,
 PagerPan
} from 'react-native-tab-view';
import {HeuButton,Filter,Icon} from 'components'
import helper from 'assets/helper';
import request from 'libs/request';
import MyCart from 'libs/mycart';
import ExploreTopbar from 'components/explore/exploreTopbar';
import PlateList from 'components/explore/foodList';
import Animated2 from 'react-native-reanimated';
import FoodList from 'components/explore/foodList';
import lang from 'assets/lang';
import VendorList from 'components/explore/vendorList';
const w10 = 10*(Dimensions.get('window').width)/100;
const FOOD = 0, VENDOR = 1, CAT = 2; 
export default class ExploreSearch extends React.Component {
  constructor(props){
    super(props)
    this.state={     
     index: 0,
     routes: [
      { key: '1', title: 'ALL FOOD'},            
      //{ key: '2', title: 'APPROVED'},
      { key: '2', title: 'RESTAURANTS'},
      //{ key: '4', title: 'PLATES'}
     ],          
     opacity:new Animated.Value(0),
     keys:[{key:'Search food, restaurants, plates'}],
     searching:false,
     search:false,
     value:'',
     notMounted:false,
     filterData:{type:0,cat:[],distance:'15.00'}
    },
    this.searchList = [];
  }
  
  componentDidMount () {    
    if(this.props.route?.params){
      let {name,id} = this.props.route.params;
      if(id == undefined){
        this.setState({value:name,type:0,id:0}, () => {
          this.searchList[1].searchKey(name);
        });
      }else{
        this.setState({value:name,type:2,id}, () => {
          this.searchList[1].searchKey(name, id, 2);
        });
      }      
    }else{
      this.searchList[1].searchKey('');
    }          
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);  
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);        
    this.focus = this.props.navigation.addListener('focus', () => {
      MyCart.init(null, null, this.handleCount);
      this.setState({notMounted:false})      
    });
    this.blur = this.props.navigation.addListener('blur', () => {
      MyCart.release();
      this.setState({notMounted:true})      
    });
  }

  componentWillUnmount () {    
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);           
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);    
    this.focus();
    this.blur();
  }

  handleBackButton = () => {
    if(this.state.notMounted)return false;
    const  {index, value} = this.state;
    if(index != 0){
      this._handleIndexChange(0)
      return true;
    }else if(value.length != 0){
      this.searchList[index+1].searchKey('');
      this.setState({value:''});     
      return true;
    } else {
      return false;  
    }
  }

  handleCount = ({id}) => {
    this.searchList[this.state.index + 1].flushCount(id)
  }

  _keyboardDidShow = () => {
    this.setState({search:true})
    Animated.timing(this.state.opacity, {
      toValue:1,
      duration:200,
      useNativeDriver:false
    }).start();
  }

  _keyboardDidHide = () => {  
    Animated.timing(this.state.opacity, {
      toValue:0,
      duration:200,
      useNativeDriver:false
    }).start(() => {this.setState({search:false})});
  }  
  async handleTextChange(key){
    this.setState({value:key,id:null,type:undefined})
    try {
      const data = {se,key,user_id,user_lat,user_long,req:'srh_kys'};      
      if(!request.isBlank(key)){        
        const res = await request.perform('vendor2', data);
        if(res && res?.status == 200){
          this.setState({keys:res.data}); 
        }    
      }else{
        this.searchList[this.state.index+1].searchKey('')
      }
    }catch(err){}
  };

  handlePressItem(value, id = null, type = undefined){
    if(type === 1){
      this.props.navigation.navigate('VendorView', {item:{id}})
      return
    }
    this.setState({value, search:false});
    Keyboard.dismiss();
    this.setState({
      id:id == undefined ? null : id,
      type
    })
    this.searchList[this.state.index+1].searchKey(value, id, type)
  };

 _handleIndexChange = index => {   
   this.setState({ index }, 
     () => this.searchList[this.state.index+1].searchKey(this.state.value, this.state.id, this.state.type)
   );
   if(index == 4)
     this.scroll.scrollToEnd()
   else
     this.scroll.scrollTo({x:w10*index, animated:true})    
 }

 delayIndexChange = index => {   
   this.setState({ index });
   this.scroll.scrollTo({x:w10*index, animated:true})    
   setTimeout(() => {
    this.searchList[this.state.index+1].searchKey(this.state.value, this.state.id, this.state.type)
   }, 1100);
 }

 navCart = () => {
  this.props.navigation.navigate('Cart');
 }

 _renderHeader = props => {  
  const inputRange = props.navigationState.routes.map((x, i) => i);
  return (
        <View style={{flexDirection: 'row',backgroundColor:'#000',height:55,elevation:10,width:'100%'}}>
          <ScrollView  ref={(scroll) => { this.scroll = scroll }} showsHorizontalScrollIndicator={false} horizontal>
          {
            props.navigationState.routes.map((route, i) => {     
            const opacity = Animated2.interpolate(props.position, {
              inputRange,
              outputRange: inputRange.map(
              inputIndex => (inputIndex === i ? 1 : 0)
            ),
            }
          );
          return (
                <View key={route.key} style={{justifyContent:'center',alignItems:'center',padding:10}}>
                  <HeuButton onPress={() => this.delayIndexChange(i)}>
                      <Text style={{fontSize:12,fontWeight:'bold',color:'#fff'}}>
                       {route.title}
                      </Text>
                      <Animated2.View style={{height:2,opacity,marginTop:5,backgroundColor:helper.primaryColor,width:'80%',alignSelf:'center'}} />
                  </HeuButton>
                </View> 
            ); 
          })}          
          </ScrollView>
        </View>
    );
  };

  handleFilter = () => {
    this.filter.show(this.state.filterData, filterData => {      
      if(filterData){
        this.searchList[1]?.filter(filterData)
        //this.searchList[2]?.filter(filterData)
        this.searchList[2]?.filter(filterData)
        setTimeout(() => {
          this.setState({filterData}, () => {
            this.searchList[this.state.index+1].searchKey(this.state.value, this.state.id, this.state.type, true);
          })          
        }, 400);
      }
    });
  }
  _renderScene = SceneMap({     
    '1':() => <FoodList filterData={this.state.filterData} {...this.props}  ref={(ref) => this.searchList[1] = ref} />,
    //'2':() => <FoodList filterData={this.state.filterData} approved {...this.props}  ref={(ref) => this.searchList[2] = ref} />,
    '2':() => <VendorList filterData={this.state.filterData} {...this.props} course={this.state.course} ref={(ref) => this.searchList[2] = ref} />,
    //'4':() => <PlateList {...this.props} ref={(ref) => this.searchList[4] = ref} />
  });
 
  render() {
    const {gender,value,image,status} = this.state;
    return (
      <View style={styles.holder}>      
      <ExploreTopbar
       onPressF={this.handleFilter}
       searching={this.state.searching}
       onSubmitEditing={() => this.handlePressItem(this.state.value)}
       onChangeText={(text) => this.handleTextChange(text)}
       value={this.state.value} />
      {this.state.search == true ? 
        <Animated.View style={{position:'absolute', width:'82%',padding:3, backgroundColor:helper.grey4, top:52, left:5,zIndex:3,elevation:3,borderRadius:4, opacity:this.state.opacity, maxHeight:320}}>
         <ScrollView keyboardShouldPersistTaps="always">
            {this.state.keys.map((data, index) =>  (                
              <TouchableNativeFeedback onPress={() => this.handlePressItem(data.key, data.id, data.type)}><View style={{flexDirection:'row',alignItems:'center'}}>
                {data.image != undefined ? <Image source={{uri:helper.site_url + data.image}} style={{width:45,height:45,margin:5,borderRadius:100}}/> : null}
                <Text key={index} style={{color:helper.silver,padding:10,fontWeight:'bold'}}>{data.key}</Text>
              </View></TouchableNativeFeedback>
            ))}          
          </ScrollView>
        </Animated.View> 
      : null}
        <TabView        
          lazy        
          navigationState={this.state}          
          renderScene={this._renderScene}        
          renderTabBar={this._renderHeader}
          onIndexChange={this._handleIndexChange}
        />
        <Filter maxDistance={15} ref={ref => this.filter = ref}/>
        <View style={styles.ftr}><HeuButton onPress={this.navCart} style={styles.crt}>
         <Icon name={lang.bskt} color={helper.white} size={30} />
        </HeuButton></View>
      </View> 
    );    
  }
}
const styles = StyleSheet.create({
  holder:{flex:1, backgroundColor:helper.grey6},
  title:{fontWeight:'bold', fontSize:18},
  ftr:{height:50,width:50,position:'absolute',bottom:20,right:30},
  crt:{justifyContent:'center',alignItems:'center',backgroundColor:helper.primaryColor,elevation:10,borderRadius:100,height:50,width:50}
})