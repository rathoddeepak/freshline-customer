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
  Text,
  Image,
  TouchableNativeFeedback
} from 'react-native';
import {
 TabView, 
 TabBar, 
 SceneMap,
 PagerPan
} from 'react-native-tab-view';
import {HeuButton,Filter} from 'components'
import helper from 'assets/helper';
import request from 'libs/request';
import ExploreTopbar from 'components/explore/exploreTopbar';
import Animated2 from 'react-native-reanimated';
import TableList from 'components/explore/tableList';
import lang from 'assets/lang';
const w10 = 10*(Dimensions.get('window').width)/100;
const FOOD = 0, VENDOR = 1, CAT = 2;
const sliderWidth = helper.width * 60 / 100;
const sliderItem = sliderWidth - 20;
export default class TableSearch extends React.Component {
  constructor(props){
    super(props)
    this.state={     
     keys:[{key:'Search restaurants for booking'}],
     searching:false,
     search:false,
     value:'',
     opacity:new Animated.Value(0),
     notMounted:false,
     filterData:{type:0,cat:[],distance:'15.00'}
    },
    this.searchList = [];
  }
  
  componentDidMount () {        
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);  
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);        
    this.focus = this.props.navigation.addListener('focus', () => {
      this.setState({notMounted:false})      
    });
    this.blur = this.props.navigation.addListener('blur', () => {
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
    if(this.state.value.length != 0){
      this.searchList.searchKey('');
      this.setState({value:''});     
      return true;
    } else {
      return false;  
    }
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
	    const data = {se,key,user_id,user_lat,user_long,table:1,req:'srhv_kys'};
	    if(!request.isBlank(key)){        
	      const res = await request.perform('vendor2', data);
	      if(res && res?.status == 200){
	        this.setState({keys:res.data}); 
	      }    
	    }else{
	      this.searchList.searchKey('')
	    }
	  }catch(err){}
  };

  handlePressItem(value, id = null, type = undefined){
    this.setState({value, search:false});
    Keyboard.dismiss();
    this.setState({
      id:id == undefined ? null : id,
      type
    })
    this.searchList.searchKey(value, id, type)
  };

 _renderHeader = () => {    
  return (
        <View style={{backgroundColor:'#000',height:55,width:'100%'}}>
              <View style={{justifyContent:'center',padding:10,width:90}}>
                <HeuButton>
                    <Text style={{fontSize:12,fontWeight:'bold',textAlign:'center',color:'#fff'}}>
                     {lang.z[cl].rst}
                    </Text>
                    <Animated2.View style={{height:2,marginTop:5,backgroundColor:helper.primaryColor,width:50,alignSelf:'center'}} />
                </HeuButton>
              </View>               
        </View>
    );
  };

  handleFilter = () => {
    this.filter.show(this.state.filterData, filterData => {      
      if(filterData){
        this.searchList?.filter(filterData)        
        setTimeout(() => {
          this.setState({filterData}, () => {
            this.searchList.searchKey(this.state.value, this.state.id, this.state.type, true);
          })          
        }, 400);
      }
    });
  }

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
        <Animated.View style={{position:'absolute',zIndex:100,width:'82%',padding:3, backgroundColor:helper.grey4, top:52, left:5,zIndex:3,elevation:3,borderRadius:4, opacity:this.state.opacity, maxHeight:320}}>
         <ScrollView keyboardShouldPersistTaps="always">
          <View>
            {this.state.keys.map((data, index) =>  (                
              <TouchableNativeFeedback onPress={() => this.handlePressItem(data.key, data.id, data.type)}><View style={{flexDirection:'row',alignItems:'center'}}>
                {data.image != undefined ? <Image source={{uri:helper.site_url + data.image}} style={{width:45,height:45,margin:5,borderRadius:100}}/> : null}
                <Text key={index} style={{color:helper.silver,padding:10,fontWeight:'bold'}}>{data.key}</Text>
              </View></TouchableNativeFeedback>
            ))}
          </View>
          </ScrollView>
        </Animated.View> 
      : null}
      {this._renderHeader()}
      <TableList filterData={this.state.filterData} {...this.props} ref={(ref) => this.searchList = ref} />
      <Filter maxDistance={15} ref={ref => this.filter = ref}/>
      </View> 
    );    
  }
}
const styles = StyleSheet.create({
  holder:{flex:1, backgroundColor:helper.grey6},
  title:{fontWeight:'bold', fontSize:18}
})