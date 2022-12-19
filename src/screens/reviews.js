import React, {Component} from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,	
	RefreshControl,
	TouchableOpacity
} from 'react-native';
import {	
	Dazar,
	NHeader,
	Reviewer,
	ReviewCard,	
	ReviewAdder,
	LoadingModal
} from 'components';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
export default class Reviews extends Component {
	constructor(props){
		super(props);
		this.state = {					
			reviews:[],
			review:{},
			loading:true,			
			error:false,
			endR:false,
			busy:false
		}
	}
	componentDidMount(){
		let {issuer_id,issuer} = this.props.route.params;		
		this.setState({
			issuer,
			issuer_id
		}, this.loadReviews)		
	}	
	loadReviews = async () => {
		if(this.state.endR)return;
		const offset = this.state.reviews.length;		
		if(offset == 0)this.setState({loading:true,error:false});
		var res = await request.perform('reviews', {
			issuer_id:this.state.issuer_id,			
			issuer:this.state.issuer,
			req:'get_rev2',
			limit:5,
			user_id,
			offset
		});
		if(res && offset == 0)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200){
			let endR = res.data.length < 5;
			let reviews = offset == 0 ? res.data.reviews : [...this.state.reviews, ...res.data];
			if(offset == 0){
				this.reviewAnim.startAnimation(res.data.cal.values, {
					average:res.data.cal.average,
					people:res.data.cal.people
				});
			}
			this.setState({endR, reviews});
		}else if(offset == 0){
			this.setState({error:false});
		}
	}
	deleteReview = async (id, index) => {
	    this.setState({busy:true});
		var res = await request.perform('reviews', {
			id,
			req:'del_review',
			issuer:this.state.issuer,
			vendor_id:this.state.issuer_id,
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
	reload = () => {
		this.setState({endR:false,reviews:[]}, this.loadReviews);
	}
	renderHeader = () => {
		const {
			error,			
			review,			
			loading,
			reviews				
		} = this.state;
		const visible = loading == false && error == false;
		return (
			<View>
			    <Reviewer ref={ref => (this.reviewAnim) = ref} />
			    <Dazar
			      loading={loading}
			      error={error}
			      emptyOther     
			      onRetry={this.loadReviews}
			      length={reviews.length}			      
			    />				
			</View>
		)
	}
	render() {
		const {
			reviews,
			busy
		} = this.state;
		return (
			<View style={helper.main2}>
			  <NHeader title={lang.z[cl].rv} />	  
			  <FlatList
			  	 data={reviews}
			  	 ListHeaderComponent={this.renderHeader}
			  	 onEndReached={this.loadReviews}
			  	 keyExtractor={(item) => item.id.toString()}
			  	 refreshControl={<RefreshControl refreshing={false} onRefresh={this.reload} colors={[helper.primaryColor, "#000"]} />}
			  	 onEndReachedThreshold={0.01}
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
		       issuer={this.state.issuer}
		       issuer_id={this.state.issuer_id}
		       onAdd={this.reviewAdded}
		      />
		      <LoadingModal visible={busy} />
			</View>
		)
	}	
}

const s = StyleSheet.create({				
	tas:{width:'100%',height:50,justifyContent:'center',alignItems:'center'},				
	ttd:{fontSize:18,color:helper.primaryColor,fontWeight:'bold'}	
})