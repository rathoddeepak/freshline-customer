import React, {Component} from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ScrollView,	
	Dimensions,
	Platform,
	Linking,
	TouchableOpacity
} from 'react-native';
import {
	Icon,
	Image,
	Dazar,
	NHeader,
	Reviewer,
	ReviewCard,
	ButtonIcon,
	ReviewAdder,
	LoadingModal
} from 'components';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';			    	
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
const width = Dimensions.get('window').width;
const imgS = width * 25 / 100;
export default class MainResView extends Component {
	constructor(props){
		super(props);
		this.state = {
			vendor:{},
			photos:[],
			reviews:[],
			review:{},
			loading:true,
			vendor_id:-1,
			vendor_name:'',
			busy:false,
			error:false
		}
	}
	componentDidMount(){
		let {id,name} = this.props.route.params;
		this.setState({
			vendor_id:id,
			vendor_name:name
		}, this.loadData);		
	}
	navigate = () => {
		const {long, lat} = this.state.vendor;
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const latLng = `${lat},${long}`;
		const label = 'Custom Label';
		const url = Platform.select({
		  ios: `${scheme}${label}@${latLng}`,
		  android: `${scheme}${latLng}(${label})`
		});
		Linking.openURL(url); 
	}
	website = async () => {
		const {name,id} = this.state.vendor;
		const url = `${helper.hotelweb}${name}/${id}`;
		try {	      
	      await InAppBrowser.open(url, {
	      	toolbarColor:helper.primaryColor,
			secondaryToolbarColor:helper.blk
	      })
	    } catch (error) {
	      
	    }
	}
	shareApp = () => {

	}
	tableBooking = () => {
		this.props.navigation.navigate('TableMaker', this.state.vendor);
	}
	loadData = async () => {
		this.setState({loading:true,error:false});
		var res = await request.perform('vendor2', {
			req:'vr_meta2',			
			id:this.state.vendor_id,
			issuer:1,
			user_lat,
			user_long,
			user_id
		});		
		if(res)this.setState({loading:false});		
		if(typeof res === 'object' && res?.status == 200){
			this.setState({
				photos:res.data.photos,
				vendor:res.data.vendor							
			}, () => {				
				this.reviewAnim.startAnimation(res.data.review.values, {
					average:res.data.review.average,
					people:res.data.review.people
				});
				this.loadReviews();
			});
		} else {
			this.setState({error:true})
		}
	}
	loadReviews = async () => {
		if(this.state.endR)return;
		const offset = this.state.reviews.length;
		var res = await request.perform('reviews', {id:this.state.vendor_id,req:'get_reviews',issuer:1,limit:5,user_id,offset});
		if(typeof res === 'object' && res?.status == 200){
			let endR = res.data.length < 5;
			let reviews = offset == 0 ? res.data : [...this.state.reviews, ...res.data];			
			this.setState({endR, reviews});
		}
	}
	deleteReview = async (id, index) => {		
	    this.setState({busy:true});
		var res = await request.perform('reviews', {
			id,
			req:'del_review',
			issuer:1,
			vendor_id:this.state.vendor.id,
			user_id
		});
		if(res)this.setState({busy:false});
		if(typeof res === 'object' && res?.status == 200){
			let reviews = this.state.reviews;
			reviews.splice(index, 1);
			this.setState({reviews});
			this.reviewAnim.startAnimation(res.data.meta.values, {
				average:res.data.meta.average,
				people:res.data.meta.people
			});
		}
	}
	
	reviewAdded = ({data, meta}) => {	       
	    let reviews = this.state.reviews;
	    reviews.unshift(data);
	    this.reviewAnim.startAnimation(meta.values, {
			average:meta.average,
			people:meta.people
		});
		this.setState({reviews})
	}
	
	onAddReq = () => {
		this.reviewAdder.show({});
	}

	all = () => {
		this.props.navigation.navigate('Photos', {
			id:this.state.vendor_id
		})
	}

	renderHeader = () => {
		const {
			error,
			photos,
			review,
			vendor,					
			loading,
			reviews		
		} = this.state;
		return error ?			  
				  <Dazar
			       loading={false}
			       error={true}
			       onRetry={this.loadData}
			      />
		      : loading ? this.renderLayout()
			  : <>			  	
				  <View> 
					  <Image
				        sty={s.cvr}
					    imgSty={helper.max}			    
					    hash={vendor.cover_hash}
					    source={{uri:helper.site_url + vendor.cover}}
				      />
				      <LinearGradient colors={['#000','transparent','transparent','#000']} style={s.hdr} />
			      </View>

			      <View style={helper.row}>
			       <View style={s.cq}>
			          <Image
				        sty={s.lg}
					    imgSty={helper.max}
					    borderRadius={10}
					    resizeMode="cover"
					    hash={vendor.logo_hash}
					    source={{uri:helper.site_url + vendor.logo}}
				      />
			       </View>
			       <View style={helper.w70}>
			        <Text style={s.cf}>{vendor.name}</Text>
			        <Text numberOfLines={4} style={s.cd}>{vendor.about}</Text>
			       </View>
			      </View>

			      <View style={s.ac}>
			       <View style={helper.w40}>
			          <View style={s.itm}>
					   <Icon name={lang.adrs} color={helper.grey} size={25} />
					   <Text numberOfLines={2} style={[s.cd,{marginRight:10}]}>{vendor.address}</Text>
					  </View>
			          <View style={s.itm}>
					   <Icon name={lang.phn} color={helper.grey} size={25} />
					   <Text numberOfLines={1} style={s.cd}>{vendor.manager_number}</Text>
					  </View>		          
			       </View>
			       <View style={s.vf}>		        
			        <ButtonIcon text={lang.z[cl].ws} onPress={this.website} bgColor={helper.grey} icon={lang.wb} br={5} style={{marginTop:5,marginRight:10}}/>
			        <ButtonIcon text={lang.z[cl].nav} onPress={this.navigate} bgColor={helper.grey} icon={lang.nav} br={5} style={{marginTop:5,marginRight:10}}/>
			        {vendor.table_booking == 1 ? <ButtonIcon onPress={this.tableBooking} text={lang.z[cl].bk} bgColor={helper.grey} icon={lang.table} br={5} style={{marginTop:5,marginRight:10}}/> : null}
			        <ButtonIcon text={lang.z[cl].shr} onPress={this.shareApp} bgColor={helper.grey} icon={lang.shr} br={5} style={{marginTop:5,marginRight:10}}/>
			       </View>
			      </View>

			      <Text style={s.te}>{lang.z[cl].pts}</Text>
			      <View style={s.rt}>
			      {photos.length == 0 ?
			      	<View style={s.vfa}>
			      	 <Text style={s.fdr}>{lang.z[cl].emdc}</Text>
			      	</View>
			      : photos.map((item, index) => {
			      	const all = photos.length == (index + 1);
			      	return (
				      	<TouchableOpacity activeOpacity={0.7} onPress={this.all} style={s.ag}>
				      	  <Image
					        sty={s.wf}
						    imgSty={helper.max}
						    borderRadius={10}				    
						    hash={item.blurCode}
						    source={{uri:helper.site_url + item.url}}
					      />
					      {all ?
					      	<View style={[{position:'absolute',borderRadius:10,justifyContent:'center',alignItems:'center'}, helper.model2]}>
					      	 <Text style={{fontSize:14,color:helper.silver,fontWeight:'bold'}}>{lang.z[cl].sl}</Text>
					      	</View>
					      : null}
				      	</TouchableOpacity>
			      	)
			      })}
			      </View>

			      <Text style={s.te}>{lang.z[cl].rv}</Text>			      
			      <Reviewer ref={ref => (this.reviewAnim) = ref} />
		    </>
		
	}
	render() {
		const {
		    vendor_name,	
			reviews,
			busy
		} = this.state;
		return (
			<View style={helper.main2}>
			  <NHeader title={vendor_name} />	  
			  <FlatList
			  	 data={reviews}
			  	 ListHeaderComponent={this.renderHeader}
			  	 onEndReached={this.loadReviews}
			  	 onEndReachedThreshold={0.01}
			  	 keyExtractor={item => item.id.toString()}
			  	 renderItem={({item, index}) => 
			  	    <ReviewCard
				       data={item}
				       onDelete={() => this.deleteReview(item.id, index)}
			        />
			     }
			  />		      
		      <TouchableOpacity onPress={this.onAddReq} activeOpacity={0.7} style={s.tas}>
		       <Text style={s.ttd}>{lang.z[cl].adr}</Text>
		      </TouchableOpacity>		      
		      <ReviewAdder
		       ref={ref => this.reviewAdder = ref}
		       issuer={1}
		       issuer_id={this.state.vendor.id}
		       onAdd={this.reviewAdded}/>
		      <LoadingModal visible={busy} />
			</View>
		)
	}
	renderLayout = () => {
		return (
			<>
			<SkeletonContent
					containerStyle={{width:'100%',justifyContent:'center',flexDirection:'row',flexWrap:'wrap'}}
					isLoading={true}
					boneColor={helper.grey4}
					highlightColor={helper.grey2}
					layout={[
						{width:'90%',height:150, marginVertical: 10,borderRadius:7},
						{width:100,height:100, marginVertical: 10,borderRadius:7},
						{width:'60%',marginVertical: 10,borderRadius:7,marginHorizontal:5,
						 children:[
							 s.arr,s.arr,s.arr,
							 {width:'100%',marginVertical: 5,borderRadius:4,marginHorizontal:5,flexDirection:'row',
							  children:[s.brr,s.brr,s.brr]
							 },
						 ]
					   },						
					]}
				/>
				<SkeletonContent
					containerStyle={{width:'90%',alignSelf:'center',marginVertical:10,flexDirection:'row'}}
					isLoading={true}
					boneColor={helper.grey4}
					highlightColor={helper.grey2}
					layout={[s.gew,s.gew,s.gew,s.gew]}
				/>
				<SkeletonContent
					containerStyle={{width:'90%',alignSelf:'center',marginVertical:10,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around'}}
					isLoading={true}
					boneColor={helper.grey4}
					highlightColor={helper.grey2}
					layout={[{...s.yw,height:20},{...s.yw,height:60},{...s.yw,height:100},{...s.yw,height:140},{...s.yw,height:180},
						{width:"30%",height:'100%',children:[
							{width:"70%",height:60,marginTop:5,alignSelf:'center',top:40,borderRadius:7},
							{width:"100%",height:10,marginTop:5,top:50,borderRadius:7},
						]}											
					]}
				/>
				</>
		)
	}
}

const s = StyleSheet.create({
	hdr:{width:'100%',position:'absolute',height:'100%'},
	inc:{position:'absolute',top:5,left:8},
	cvr:{height:170,width:"100%",backgroundColor:helper.grey},
	lg:{height:90,width:90,backgroundColor:'#fff',elevation:10},
	cq:{marginHorizontal:5},
	gew:{width:70,height:70,marginRight:8,borderRadius:7},
	yw:{width:15,marginRight:8,borderRadius:7},
	tas:{width:'100%',height:50,justifyContent:'center',alignItems:'center'},
	rt:{marginBottom:5,flexDirection:'row'},
	cf:{fontSize:15,fontWeight:'bold',color:helper.primaryColor,marginLeft:5,marginBottom:4},
	cd:{fontSize:13,marginLeft:5,color:helper.grey},
	brr:{width:"31%",height:30,marginRight:5},
	ac:{flexDirection:'row',marginVertical:10},
	arr:{width:'100%',height:10, marginVertical: 5,borderRadius:4,marginHorizontal:5},
	itm:{flexDirection:'row',marginTop:6,marginBottom:6},
	itx:{marginLeft:10,fontSize:16,color:helper.silver},
	vf:{flexDirection:'row',width:'60%',flexWrap:'wrap'},
	ttd:{fontSize:18,color:helper.primaryColor,fontWeight:'bold'},
	ag:{width:imgS,height:imgS,justifyContent:'center',alignItems:'center'},
	wf:{width:'90%',height:'90%'},
	vfa:{height:80,width:'100%',justifyContent:'center',alignItems:'center'},
	fdr:{fontSize:15,fontWeight:'bold',color:helper.silver},
	te:{fontSize:18,fontWeight:'bold',marginLeft:5,marginBottom:6,color:helper.primaryColor}
})