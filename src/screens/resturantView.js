import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image
} from 'react-native';
import {
	FloorSelectionView,
	ReadMore,
	Icon,
	HeuButton
} from 'components';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import helper from 'assets/helper';
import lang from 'assets/lang';
export default class ResturantView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:'',
			about:'',
			cover:'',
			floor:-1
		}
	}
	componentDidMount () {
		const {
			id,
			name,
			about,
			cover,
			cover_hash
		} = this.props.route.params.item;
		this.setState({
			id,
			name,
			about,
			cover,
			cover_hash
		})
	}
	handleSelected = (floor, f_id) => {
		if(floor == -1)this.flrBtn?.zoomOut();
		else if(this.state.floor == -1)this.flrBtn?.zoomIn();
		this.setState({floor, f_id});		
	}
	handleDone = () => {
		let id = this.state.f_id;
		if(id != undefined)
		this.props.navigation.navigate('TableSelectionView', {
			id:id
		});
	}
	render() {
		const {
			cover,
			name,
			about
		} = this.state;
		return (
			<View style={helper.hldr}>
			 <View style={s.cnt}>
			  <Image style={s.cimg} source={{uri:cover}}/>
			  <LinearGradient colors={['#000', 'transparent', 'transparent', '#000']} style={s.clg}>
			  </LinearGradient>			 
			 </View>
			 <View style={{backgroundColor:'black',marginBottom:4}}>
				 <Text numberOfLines={1} style={s.tt}>{name}</Text>
				 <ReadMore 
				  numLines={3} 
				  style={s.dsc} 
				  text={about}
				 />
			     <Text style={[s.tt, {color:helper.primaryColor}]}>Select Floor</Text>
			 </View>
			 <FloorSelectionView 
			  onFloorSelected={this.handleSelected}
			  v_id={this.state.id}
			 />
			 <Animatable.View style={s.smt} ref={ref => this.flrBtn = ref} animation="zoomOut">
				<HeuButton onPress={this.handleDone} >
				<View style={s.smtc}>
				  <Icon name={lang.chk} color="white" size={25} />			  
				</View>
				</HeuButton>
			 </Animatable.View>

			</View>
		)
	}
}
const s = StyleSheet.create({
	cnt:{width:'100%'},
	cimg:{height:250, width:'100%'},
	clg:{position:'absolute',height:'100%',width:'100%'},	
	tt:{fontSize:14,color:helper.silver,fontWeight:'bold',margin:5},
	dsc:{fontSize:12,color:helper.silver,marginLeft:5,marginBottom:4,marginTop:2,width:'90%',maxHeight:50},
	smt:{position:'absolute',bottom:8,right:8},
	smtc:{backgroundColor:helper.primaryColor,elevation:10,height:50,width:50,justifyContent:'center',alignItems:'center',borderRadius:100}
})