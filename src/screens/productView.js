import React, { Component } from 'react';
import {
	View,
	Text,	
	FlatList,
	Animated,
	TouchableOpacity,
	RefreshControl,
	ToastAndroid,
	ScrollView
} from 'react-native';
import request from 'libs/request';
import helper from 'assets/helper';
import {
	Image,
	Icon,
	Dazar
} from 'components';
import lang from 'assets/lang';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Address from 'libs/address';
import Parse from 'parse/react-native';
import QtyBtn from 'components/qtyBtn';
import Carousel from 'react-native-snap-carousel';
import CartBar from 'components/cartBar';
import PhotoView from "components/gallery/";
const itemWidth = helper.width;
export default class ProductView extends Component {
	constructor(props){
		super(props)
		this.state = {
			viewerData:[],
			initial:0,
			visible:false,
			product:{},
			variants:[],
			contextX:new Animated.Value(0),
			inputRange:[0,0],
			outputRange:[0,0],
			indicatorWidth:0,
			busy:false,
			error:false
		}
	}
	componentDidMount(){
		const {product_id, name} = this.props.route.params;
		// const product_id = 'WJby5cVISp';
		// const name = 'Pears Pure & Gentle Soap 3x125 g - Pack of 3';
		this.setState({product_id,product:{name}}, this.productData)
	}
	productData = () => {
		const address = Address.getCurrentAddress();
		const product_id = this.state.product_id;
		this.setState({busy:true,error:false});
		Parse.Cloud.run('productData', {product_id, user_id, address}).then(({status, data}) => {
			if(status == 200){
				this.buildOptions(data);
			}else{
				this.setState({busy:false,error:true});
			}
		}).catch(err => {
			this.setState({busy:false,error:true});
		})
	}
	buildOptions = ({product, cart}) => {
		let mainObjectCopy = {...product, ...{variants:[]}};
		let variants = [];
		variants.push(mainObjectCopy)
		for(let variant of product.variants){
			variants.push(variant);
		}
		delete product['variants'];
		this.setState({variants,product,selected:variants[0].id}, () => {
			this.cartBar.dispatch(cart);
			this.calculateRange();
		})
	}
	calculateRange = () => {
		const {images, qty, odr_qty} = this.state.product;
		const itemsLength = images.length;
		const indicatorWidth = itemWidth / itemsLength;
		let inputRange = [];
		let outputRange = [];
		if(itemsLength > 1){
			for(let i = 0; i < itemsLength; i++){
				inputRange.push(i * itemWidth)
				outputRange.push(i * indicatorWidth)
			}
		}else{
			inputRange = outputRange = [0, 0]
		}
		let viewerData = [];
		for(let uri of images){
			uri = helper.validUrl(uri);
			viewerData.push({
				source:{uri}
			})
		}
		// this.qtyBtn.dispatch(odr_qty == undefined ? 0 : odr_qty, qty);
		this.setState({contextX:new Animated.Value(0),busy:false,error:false,viewerData,indicatorWidth,inputRange,outputRange}, () => {
			if(itemsLength > 0){
				this.slider.snapToItem(0, false, false);
			}
		});
	}
	handleSnapScroll = ({nativeEvent}) => {		
		this.state.contextX.setValue(nativeEvent.contentOffset.x);
	}
	handleDismiss = () => this.setState({visible:false});
	sliderNav = (index) => {
		this.setState({
			visible:true,
			initial:index
		})
	}
	onQtyChange = (newQty) => {
		const {selected, variants} = this.state;
		let idx = variants.findIndex(itm => itm.id == selected);
		if(idx != -1){
			variants[idx].odr_qty = newQty;
		}
		this.setState({variants})
	}
	onChangeOption = (item) => {
		this.setState({product:item,selected:item.id}, () => {
			this.calculateRange();
		})
	}
	render(){
		const {
			product,
			inputRange,
			outputRange,
			indicatorWidth,
			variants,
			visible,
			viewerData,
			initial,
			error,
			busy
		} = this.state;
		const translateX = this.state.contextX.interpolate({
			inputRange,
			outputRange
		});
		return ( 
			<View style={s.main}>
			 <View style={s.header.main}>
			    <View style={s.header.icon}>
				 <Icon name={lang.cvlft} size={20} color={helper.white} />
				</View>
				<Text numberOfLines={1} style={s.header.text}>{product.name}</Text>
			 </View>
			 <Dazar
			  loading={busy}
			  error={error}
			  length={1}
			  onRetry={this.productData}
			 />
			 <ScrollView>
			 <View style={{height:itemWidth,width:itemWidth}}>
				 <Carousel
				  ref={(c) =>  this.slider = c}
				  data={product.images}
				  renderItem={this.renderImages}
				  sliderWidth={helper.width}
				  itemWidth={helper.width}
				  layout={'stack'}
				  onScroll={this.handleSnapScroll}
				 />
			 </View>
			 <View style={s.indCnt}>
			  <Animated.View style={{height:7,backgroundColor:helper.primaryColor,width:indicatorWidth,transform:[
			  	 {translateX}
			  	]}} />
			 </View>
			 <Text numberOfLines={3} style={s.title}>{product.name}</Text>
			 <Text numberOfLines={1} style={s.unitTxt}>{product.unit_text}</Text>
			 <Text numberOfLines={1} style={s.mrpTxt}>{lang.rp}{product.mrp}</Text>
			 <View style={s.optBar}>
			    <View style={s.optCnt}>
			     {variants.map(this.renderOption)}
			    </View>
			    {/*<QtyBtn 
		 		 parentId={product.parent_id}
		 		 productId={product.id}
		 		 style={{marginTop:5}}
		 		 newQty={(odr_qty) => this.onQtyChange(odr_qty)}
		 		 ref={ref => this.qtyBtn = ref}
		 		/>*/}
			 </View>

			 {this.renderText('Description', 'desc')}
			 {this.renderText('Key Features', 'key_features')}
			 {this.renderText('Ingrediants', 'ingrediants')}
			 <View style={{height:20}} />
			 </ScrollView>
			 <CartBar ref={ref => this.cartBar = ref} />
			 <PhotoView
			   visible={visible}
			   data={viewerData}
			   hideStatusBar={false}
			   initial={initial}
			   hideShareButton
			   onDismiss={this.handleDismiss}
			 />
			</View>
		)
	}

	renderText = (title, key) => {
		const data = this.state.product[key];
		if(data == undefined)return (<View />);

		return (
			<>
			 <Text style={s.dataTitle}>{title}</Text>
			 <Text style={s.dataTxt}>{data}{'\n'}</Text>
			</>
		)

	}
	renderOption = (item, index) => {
		const selected = this.state.selected;
		const slt = selected == item.id;
		const color = slt ? helper.primaryColor : helper.grey;
		return (
			<TouchableOpacity key={item.id} activeOpacity={0.8} style={[s.opt, {borderColor:color}]} onPress={() => this.onChangeOption(item)}>
		      <Text numberOfLines={1} style={[s.optTxt, {color}]}>{item.unit_text} | {lang.rp}{item.mrp}</Text>			   
		    </TouchableOpacity>
		)
	}

	renderImages = ({item, index}) => {	   	
		const url = helper.validUrl(item)
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.sliderNav(index)} style={helper.max}>
                <Image
		 		 source={{uri:url}}			 		 
		 		 hash={item.hash}
		 		 sty={helper.max}
		 		 resizeMode="cover"
				 imgSty={helper.max}		 
				 borderRadius={0}
		 		/>
                {/*<LinearGradient colors={['transparent',helper.blk+'b4']} style={styles.fHolder}>
                 <Text numberOfLines={1} style={styles.tt}>#{index + 1} {item.title}</Text>
                 <Text numberOfLines={1} style={styles.desc}>{item.desc}</Text>
                </LinearGradient>*/}
            </TouchableOpacity> 
        );
    }
}

const s = {
	dataTitle:{
		fontSize:15,
		color:helper.primaryColor,
		marginBottom:10,
		marginLeft:10
	},
	dataTxt:{
		fontSize:13,
		color:helper.grey,
		marginLeft:10,
		width:'100%'
	},
	opt:{minWidth:100,borderWidth:1,minHeight:30,justifyContent:'center',alignItems:'center',marginRight:9,marginBottom:9},
	optTxt:{fontSize:13,width:'100%',textAlign:'center'},
	optCnt:{
		flexDirection:'row',
		flex:1,
		alignItems:'center',
		flexWrap:'wrap'
	},
	optBar:{
		padding:5,
		marginTop:10,
		marginBottom:10,
		borderTopWidth:1,
		borderBottomWidth:1,
		borderColor:helper.borderColor,
		width:'100%',
		flexDirection:'row',
		justifyContent:'space-between'
	},
	mrpTxt:{
		fontSize:17,
		color:helper.primaryColor,
		width:'95%',
		marginLeft:10,
		marginTop:2
	},
	unitTxt:{
		fontSize:14,
		color:helper.grey,
		width:'95%',
		marginLeft:10,
		marginTop:2
	},
	title:{
		fontSize:17,
		color:helper.primaryColor,
		width:'95%',
		marginLeft:10,
		marginTop:10
	},
	indCnt:{
		width:itemWidth,
		height:7,
		backgroundColor:helper.borderColor
	},
	main:{
		height:'100%',
		width:'100%',
		backgroundColor:helper.homeBgColor
	},
	header:{
		main:{
			height:50,
			width:'100%',
			backgroundColor:helper.primaryColor,
			flexDirection:'row'
		},
		icon:{
			height:50,
			width:40,
			justifyContent:'center',
			alignItems:'center'
		},
		text:{
			fontSize:18,
			color:helper.white,
			flex:1,
			lineHeight:50
		}
	},

}