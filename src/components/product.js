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
import QtyBtn from './qtyBtn';
const productSize = helper.width - 10;
const smallerSize = helper.width - 80;
const smallerHeight = smallerSize - 25;
const productHeight = smallerHeight;
const productImageSize = productSize - 1;
export default class Product extends Component {
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
			variants
		} = this.props.data;
		let product = {name,mrp,qty,cover_url,unit_text,odr_qty,id}
		this.setState({product,id,name,mrp,qty,cover_url,unit_text,odr_qty,isVariant:false,variants}, () => {
			this.qtyBtn.dispatch(odr_qty == undefined ? 0 : odr_qty, qty)
		})
	}

	newStateSet = () => {
		let product = this.state.product;
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
			isVariant,
			variants,
			product
		} = this.state;
		let image = helper.validUrl(cover_url);
		const {
			smallSize
		} = this.props;
		const notVariant = variants.length == 0;
		const realSize = smallSize ? smallerSize : productSize;
		const realHeight = smallSize ? smallerHeight : productHeight;
		const imageSize = realSize - 20;
		return (
			<TouchableOpacity style={[s.main, {width:realSize,height:realHeight}]} activeOpacity={1} onPress={this.props.onPress}>
			    <View style={{padding:10}}><Image
		 		 source={{uri:image}}
		 		 sty={{width:imageSize,height:140,elevation:15,backgroundColor:helper.white,}}
		 		 resizeMode="cover"
				 imgSty={{width:imageSize,height:140}}
				 borderRadius={10}
		 		/></View>
		 		<Text numberOfLines={1} style={s.name}>{name}</Text>
		 		{/*<TouchableOpacity activeOpacity={0.7} style={[s.qtyCont, {borderRadius:5}]} disabled={notVariant} onPress={this.showVariants}>
			 		<Text numberOfLines={2} style={s.unit}>{unit_text}</Text>
			 		<Icon name={lang.cvd} color={helper.primaryColor} size={13} />
			 	</TouchableOpacity>*/}
		 		
		 		<Text numberOfLines={2} style={[s.mrp, {fontSize:smallSize ? 14 : 17}]}>{lang.rp}{mrp}</Text>
		 		<QtyBtn 
		 		 isVariant={isVariant} 
		 		 productId={id}
		 		 smallSize={realSize}
		 		 ref={ref => this.qtyBtn = ref} 
		 		 newQty={(odr_qty) => this.handleUpdate(id, odr_qty)}
		 		 style={{marginRight:3}}
		 		/>
			 	
			 	{/*<View style={s.favCont}>
			 	 <Icon name={'fav'} color={helper.silver} />
			 	</View>
			 	{/*<VariantManager
			 	 ref={ref => this.variantManager = ref}
			 	 variants={variants}
			 	 parentProduct={product}
			 	 newState={this.newStateSet}
			 	 onChange={this.handleUpdate}
			 	/>*/}
			</TouchableOpacity>
		)
	}
}

class VariantManager extends Component {
	constructor(props){
		super(props)
		this.state = {
			variants:[],
			product:{},
			v:false
		}
		this.qtyBtn = []
	}
	show = () => {
		let {parentProduct,variants} = this.props;
		variants = [...[parentProduct], ...variants];
		this.setState({
			v:true,
			variants:[],
			product:parentProduct,
			selected:parentProduct.id
		}, () => {
			this.setState({variants}, () => {
				for(let variant of variants){
					this.qtyBtn[variant.id].dispatch(
						variant.odr_qty == undefined ? 0 : variant.odr_qty,
						variant.qty
					)	
				}
			})
		})
	}
	handleClose = () => {
		this.props.newState();
		setTimeout(() => {
			this.setState({
				variants:[],
				product:{},
				v:false
			})
		})
	}
	render(){
		const {
			variants,
			product,
			v
		} = this.state;
		const validUrl = helper.validUrl(product.cover_url);
		return (
			<Modal visible={v} onRequestClose={this.handleClose} transparent animationType="fade">
			 <View style={helper.model}>
			  <View style={s.vnt.main}>
			   <View style={{width:'100%',height:200,backgroundColor:helper.white,justifyContent:'center',alignItems:'center'}}>
				   <Image
				    source={{uri:validUrl}}
				    sty={s.vnt.img}
			 		resizeMode="contain"
					imgSty={s.vnt.img}
					borderRadius={0}
				   />
				   <Text numberOfLines={2} style={{fontSize:13,marginTop:5,width:'90%',textAlign:'center'}}>{product.name}</Text>
			   </View>
			   {variants.map(this.renderVariant)}
			  </View>
			 </View>
			</Modal>
		)
	}
	select = (item) => {
		this.setState({
			product:item,
			selected:item.id
		})
	}
	renderVariant = (item, index) => {
		const {selected} = this.state;
		const slt = item.id == selected;
		return (
			<TouchableOpacity style={s.vnt.row} onPress={() => this.select(item)}>
			 <View style={{flex:1}}>
				 <Text style={s.vnt.qty}>{item.unit_text}</Text>
				 <Text style={s.vnt.mrp}>{lang.rp}{item.mrp}</Text>
			 </View>
			 <View>
			    <QtyBtn 
		 		 parentId={item.parent_id}
		 		 productId={item.id}
		 		 newQty={(odr_qty) => this.props.onChange(item.id, odr_qty)}
		 		 ref={ref => this.qtyBtn[item.id] = ref}
		 		/>
			 </View>
			 {slt ? <View style={s.vnt.ind} /> : null}
			</TouchableOpacity>
		)
	}
}
const s = {
	vnt:{
		mrp:{
			fontSize:16,
			color:helper.primaryColor,
			fontWeight:'bold',
			width:'100%'
		},
		qty:{
			fontSize:14,
			color:helper.primaryColor,
			width:'100%'
		},
		main:{
			width:'90%',
			backgroundColor:helper.bgColor
		},
		row:{
			height:60,
			width:'100%',
			borderTopWidth:0.5,
			borderBottomWidth:0.5,
			borderColor:helper.borderColor,
			flexDirection:'row',
			alignItems:'center',
			paddingLeft:10,
			paddingRight:10,
			justifyContent:'space-between'
		},
		ind:{
			height:60,
			width:3,
			backgroundColor:helper.primaryColor,
			borderTopRightRadius:10,
			borderBottomRightRadius:10,
			position:'absolute'
		},
		img:{width:150,height:150}
	},
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
	main:{
		height:productHeight,
		borderRadius:10,
		backgroundColor:helper.white,
		elevation:24,
		marginLeft:5,
		marginBottom:15
	},
	img:{
		width:productImageSize,
		height:productImageSize
	},
	name:{
		marginLeft:10,
		fontSize:14,
		width:'80%',
		marginBottom:5,
		color:helper.grey2
	},
	unit:{
		fontSize:12,
		color:helper.primaryColor,
		textAlign:'center',
		width:80
	},
	mrp:{
		fontSize:17,
		color:helper.blk,
		fontWeight:'bold',
		marginLeft:10,
		flex:1
	},
	ftr:{
		flexDirection:'row',
		marginTop:5,
		alignItems:'center',
		justifyContent:'space-between'
	},
	qtyCont:{
		height:23,
		borderWidth:1,
		width:100,
		alignItems:'center',
		flexDirection:'row',
		marginLeft:4,
		borderColor:helper.primaryColor,
		justifyContent:'center'
	}
}

const tempVariants = [
 {
 	"cover_url": "http://localhost:1337/parse/files/myAppId/08cfc6ddaa639511aad39cd4fbdbd519_file.jpeg",
 	"id": "bEctDAkukq",
 	"mapping_id": "R7Qys28ii3",
 	"mrp": 100,
 	"name": "Pears Pure & Gentle Soap 3x125 g - Pack of 3",
 	"qty": 5, "unit_text": "3x50 g"
 },
 {
 	"cover_url": "http://localhost:1337/parse/files/myAppId/08cfc6ddaa639511aad39cd4fbdbd519_file.jpeg",
 	"id": "tOsDN7AwFZ",
 	"mapping_id": "R7Qys28ii3",
 	"mrp": 50,
 	"name": "Pears Pure & Gentle Soap 3x125 g - Pack of 3",
 	"qty": 5,
 	"unit_text": "3x90 g"
 }
]