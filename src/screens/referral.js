import React, { Component} from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  RefreshControl
} from 'react-native';
import {
  Icon,
  Text2,
  Dazar,
  CHeader,
  TextIcon,
  RefItems,
  HeuButton
} from 'components';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import helper from 'assets/helper';
import lang from 'assets/lang';
import Share from 'libs/Share/';
import ShareSheet from 'libs/Share/sharesheet';
import Clipboard from '@react-native-community/clipboard';
import BottomSheet from 'reanimated-bottom-sheet';
import request from 'libs/request';
export default class Referral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mv:0,mpv:0,me:0,
      keys:[],
      apps:[],      
      loading:true,
      error:false
    }
  }
  componentDidMount() {    
    this.getAppList();
    this.loadData();
  }
  loadData = async () => {     
    this.setState({loading:true,error:false})   
    var res = await request.perform('user', {
      req:'vst',
      user_id,
      se
    });
    if(res)this.setState({loading:false});
    if(typeof res === 'object' && res?.status == 200){
      const {mv,mpv,me} = res.data;      
      this.setState({mv,mpv,me});
    }else {
      this.setState({error:true});
    }
  }
  getAppList = async () => {    
    let apps = await Share.getFeaturedList(); 
    if(apps){     
      this.setState({ apps });
    }    
  }
  shareApp = (p) => {   
    let code = this.state.r_code;
    if(p.startsWith("com.whatsapp") || p.startsWith("com.facebook") || p.startsWith("com.instagram")){
      code = `*${code}*`;
    }
    let content = lang.z[cl].shcn;
    content = content.replace('link', helper.share_link);    
    Share.shareApp(p, content);
  }  
  showAll = () => {
    let shareContent = lang.z[cl].shcn;
    shareContent = shareContent.replace('link', helper.share_link);    
    this.shareSheet.open(shareContent);   
  }  
  render() {
    const {
      mv,mpv,me,
      loading,
      error,
      apps
    } = this.state;
    return (
      <View style={helper.hldr}>
        <CHeader text={'Scan & Earn'} />
        <ScrollView refreshControl={<RefreshControl
                colors={[helper.primaryColor, helper.blk]}
                refreshing={false}
                onRefresh={this.loadData} />
             }>       
        
        <Text style={{fontSize:15,fontWeight:'bold',color:helper.silver,marginBottom:10,marginLeft:15}}>{'1. Visit Nearby Hotels\n\n2. Order Via Scanning Clufter QR Code\n\n3.On Every Scan Earn Reward'}</Text>

        <View style={s.qc}>
         <View style={s.box}>
          <Text style={s.sc}>{mv}</Text>
          <Text style={s.tx}>My Visits</Text>
         </View>
         <View style={s.box}>
          <Text style={s.sc}>{mpv}</Text>
          <Text style={s.tx}>{'Money Per\nVisit'}</Text>
         </View>
         <View style={s.box}>
          <Text style={s.sc}>{lang.rp}{me}</Text>
          <Text style={s.tx}>Earning</Text>
         </View>
        </View>

        <View style={{flexDirection:'row',marginTop:50,marginBottom:30,alignItems:'center',justifyContent:'center'}}>
         <View style={{flex:1,height:2,backgroundColor:'white'}} />
          <Text style={{fontSize:15,fontWeight:'bold',color:helper.silver}}>  Tell Your Friends  </Text>
         <View style={{flex:1,height:2,backgroundColor:'white'}} />
        </View>
        <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
          {apps.map((app, i) => 
           <HeuButton onPress={() => this.shareApp(app.package)} key={i} style={{width:90,height:90,justifyContent:'center',alignItems:'center'}}>
            <Image style={{width:50,height:50,backgroundColor:'#fff',borderRadius:10,marginBottom:6}} source={{uri:helper.site_url + 'uploads/apps/'+app.icon+'.webp'}} />
            <Text numberOfLines={1} style={{fontSize:10,color:'white'}}>{app.name}</Text>
           </HeuButton>
          )}
          <HeuButton onPress={this.showAll} style={{width:90,height:90,justifyContent:'center',alignItems:'center'}}>
            <Icon name={lang.mr} size={40} style={{borderRadius:10,marginBottom:16}} />
            <Text numberOfLines={1} style={{fontSize:10,color:'white'}}>More</Text>
           </HeuButton>
        </View>
       </ScrollView>
       <ShareSheet ref={ref =>  this.shareSheet = ref} />
       {loading || error ? <View style={{width:'100%',height:'100%',position:'absolute',backgroundColor:'#000000b4'}}><Dazar
         loading={loading}
         error={error}
         emptyOther
         onRetry={this.loadData}
         length={1}        
       /></View> : null}
      </View>
    )
  }  
}

const s = StyleSheet.create({
  sc:{fontSize:18,fontWeight:'bold',color:helper.silver,textAlign:'center'},
  tx:{fontSize:14,fontWeight:'bold',color:helper.silver,textAlign:'center'},
  qc:{flexDirection:'row',justifyContent:'space-around',marginBottom:10},
  box:{width:96,height:96,backgroundColor:helper.grey6,borderRadius:10,justifyContent:'center',alignItems:'center'}
})