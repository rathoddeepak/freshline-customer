import React, { Component} from 'react';
import {
	View,
	Text,  
  FlatList,
  Dimensions,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import PhotoView from "components/gallery/";
import {
  Dazar,
  Image,
  NHeader,
} from 'components';
import helper from 'assets/helper';
import lang from 'assets/lang';
import request from 'libs/request';
const width = Dimensions.get('window').width;
const chipSize = width / 3;
export default class Photos extends Component {
	constructor(props) {
		super(props);
		this.state = {
      id:21,			
      crC:0,
      initial:0,
			photos:[],
      gnPhotos:[],
      visible:false,
      categories:[]      
		}
	}
  
  componentDidMount() {
    let id = this.props.route.params.id;    
    let categories = request.photoCats();
    this.setState({id,categories,crC:0}, this.loadPhotos);
  }

  loadPhotos = async () => {
    this.setState({loading: true, error:false, photos:[]});
    var res = await request.perform('vendor2', {
      se,
      user_id,
      req:'phts',
      id:this.state.id,
      cat_id:this.state.crC + 1  
    });
    if(res)this.setState({loading:false});
    if(typeof res === 'object' && res?.status == 200){
      this.gnPhotos(res.data);    
    }else {
      this.setState({error:true})
    };
  }

	handleDismiss = () => {
		this.setState({visible: false});
	}

  gnPhotos = (photos) => {
    let gnPhotos = [];
    const title = lang.z[cl][this.state.categories[this.state.crC]];    
    const summary = lang.z[cl].pdsc;
    photos.forEach((photo) => {
      gnPhotos.push({source: {uri:helper.site_url + photo.url},title,summary})
    })
    this.setState({gnPhotos}, () => {
      this.setState({photos})
    });
  }

  renderHeader = () => {
    const {
      loading,
      error,
      photos
    } = this.state;
    return (
       <Dazar
          loading={loading}
          error={error}          
          onRetry={this.loadPhotos}
          length={photos.length}
      />      
    )
  }
  catPress = (crC) => {
    this.setState({
      crC
    }, () => {
      this.loadPhotos()
    })
  }
  onItemPress(initial){
    this.setState({
      initial,
      visible:true
    })
  }
	render() {
	  const {
      crC,
      photos,
	  	visible,
      loading,
      initial,
      gnPhotos,
      categories
	  } = this.state;
	  return (
	  	<View style={helper.main2}>
        <NHeader title={lang.z[cl].pht} />
        <View style={[s.hdr, {opacity:loading ? 0.7 : 1}]} pointerEvents={loading ? 'none' : undefined}>
        <ScrollView horizontal>
         {categories.map((a, i) => {
          const backgroundColor = crC == i ? helper.primaryColor : 'transparent';          
          return (
            <Text style={[s.ct, {backgroundColor}]} onPress={() => this.catPress(i)}>{lang.z[cl][a]}</Text>
          )
         })}
         </ScrollView>
        </View>
        <FlatList
         data={photos}
         ListHeaderComponent={this.renderHeader}
         renderItem={this.renderItem}
         numColumns={3}
         refreshControl={<RefreshControl refreshing={false} onRefresh={this.loadPhotos} colors={[helper.primaryColor, "#000"]} />}
        />
		    <PhotoView
			   visible={visible}
			   data={gnPhotos}
			   hideStatusBar={false}
			   initial={initial}
			   hideShareButton
			   onDismiss={this.handleDismiss}
			  />
		</View>
	  )
	}
  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => this.onItemPress(index)}>
        <Image
            sty={s.item}
            imgSty={helper.max}
            borderRadius={0}
            hash={item.blurCode}
            source={{uri:helper.site_url + item.url}}
        />
      </TouchableOpacity>
    )
  }
}
const s = StyleSheet.create({
  hdr:{
    justifyContent:'center',
    marginBottom:20
  },
  ct:{
    fontSize:13,    
    fontWeight:'bold',
    paddingVertical:5,
    color:helper.white,
    paddingHorizontal:10,
    borderRadius:12,
    marginHorizontal:5     
  },
  item:{
    width:chipSize,
    height:chipSize
  }
})