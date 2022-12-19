import React, {Component} from 'react';
import {
	View,
	Text,
	Modal,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import Image from './image';
import Icon from './icon';
import helper from 'assets/helper';
import lang from 'assets/lang';
import VerQtyBtn from './verQtyBtn';
const productSize = parseInt(helper.width/2);
const smallerSize = productSize - 35;
const productHeight = productSize + 103;
const smallerHeight = smallerSize + 104;
const productImageSize = productSize - 1;
export default class CartItem extends Component {
	constructor(props){
		super(props)
		this.state = {
			variants:[]
		}
	}
	
	componentDidMount(){
		const {
			name,
			mrp,
			qty,
			cover_url,
			unit_text,
			odr_qty,
			id,
			variants,
			parent_id
		} = this.props.data;
		let product = {name,mrp,qty,cover_url,unit_text,odr_qty,id,parent_id}
		this.setState({parent_id,product,id,name,mrp,qty,cover_url,unit_text,odr_qty,isVariant:false,variants}, () => {
			if(this.qtyBtn != undefined)
				this.qtyBtn.dispatch(odr_qty == undefined ? 0 : odr_qty, qty)
		})
	}

	removeFromCart = () => {
		this.qtyBtn.removeWithAnim(true);
	}

	newStateSet = () => {
		let product = this.state.product;
		if(this.qtyBtn != undefined)
			this.qtyBtn.dispatch(product.odr_qty == undefined ? 0 : product.odr_qty, product.qty);
	}

	handleUpdate = (param_id, newQty) => {
		let {odr_qty, id, product, variants} = this.state;
		let isParent = param_id == id;
		if(isParent){
			odr_qty = newQty;
			product.odr_qty = newQty;
			setTimeout(() => {
				this.setState({odr_qty,product})
			})
		}else{
			let idx = variants.findIndex(itm => itm.id == param_id);
			if(idx != -1){
				variants[idx].odr_qty = newQty;
				this.setState({variants})
			}
		}
	}

	showVariants = () => {
		this.variantManager.show();
	}

	render () {
		const {
			name,
			cover_url,
			unit_text,
			mrp,
			id,
			parent_id,
			variants,
			product
		} = this.state;
		let image = helper.validUrl(cover_url);
		const {
			smallSize,
			addEnable
		} = this.props;
		const notVariant = variants?.length == 0;		
		return (
			<View style={s.main}>
			    <View style={s.img2}>
				    <Image
			 		 source={{uri:image}}
			 		 sty={s.img}
			 		 resizeMode="contain"
					 imgSty={s.img}
					 borderRadius={20}
			 		/>
			 		{/*{addEnable ? <TouchableOpacity activeOpacity={1} onPress={this.removeFromCart} style={s.btmChp}>
			 		 <Icon name="trash" color={helper.white} size={25} />
			 		</TouchableOpacity> : null}*/}
		 		</View>
		 		<View>
			 		<Text numberOfLines={3} style={s.name}>{name}</Text>
			 		<Text numberOfLines={2} style={s.mrp}><Text style={s.rupee}>{lang.rp}</Text> {mrp}</Text>
			 		{/*<Text numberOfLines={2} style={s.unit}>{unit_text}</Text>*/}				 	
		 		</View>
		 		{addEnable ? <View style={s.ftr}>			 		
			 		<VerQtyBtn 
			 		 parentId={parent_id}
			 		 productId={id}
			 		 //newQty={(odr_qty) => this.onChange(id, odr_qty)}
			 		 ref={ref => this.qtyBtn = ref}
			 		/>
			 	</View> : null}
			 	{/*<View style={s.favCont}>
			 	 <Icon name={'fav'} color={helper.silver} />
			 	</View>*/}
			</View>
		)
	}
}


CartItem.defaultProps = {
	addEnable:true
}

const s = {	
	btmChp:{position:'absolute',bottom:0,right:0,backgroundColor:helper.bgColor + "b4",height:40,width:40,justifyContent:'center',alignItems:'center'},
	favCont:{
		width:35,
		height:35,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:helper.white,
		elevation:24,
		borderWidth:1,
		borderColor:helper.silver,
		borderRadius:60,
		position:'absolute',
		top:3,
		right:3
	},
	rupee:{
		fontSize:15,
		color:helper.primaryColor
	},
	main:{
		width:'95%',
		alignSelf:'center',
		flexDirection:'row',
		marginBottom:10,
		borderRadius:10,
		backgroundColor:helper.white,
		elevation:24
	},
	img:{
		width:75,
		height:75,		
	},
	img2:{
		justifyContent:'center',
		alignItems:'center',
		width:90,
		height:90
	},
	name:{
		marginTop:6,
		marginLeft:4,
		marginBottom:4,
		fontSize:12,
		width:200,
		color:helper.black
	},
	unit:{
		fontSize:12,
		color:helper.secondaryColor,
		marginLeft:4,
		width:80
	},
	mrp:{
		fontSize:18,
		color:helper.blk,
		marginLeft:4,
	},
	ftr:{
		alignItems:'center',
		position:'absolute',
		right:10,
		bottom:10
	},
	qtyCont:{
		height:25,
		borderWidth:1,
		width:100,
		alignItems:'center',
		flexDirection:'row',
		marginLeft:4,
		borderColor:helper.borderColor,
		justifyContent:'center'
	}
}