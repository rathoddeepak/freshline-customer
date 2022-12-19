import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');
const server_url = '5.181.217.24'
const helper = {

	parse_server_url:`http://${server_url}:1337/parse`,
	validUrl:(url) => {
		return url?.replace('localhost', server_url);
	},


	ClimaticStoppage:2,
	WorkforceStoppage:3,
	ServerMaintainance:4,

	CITY_NORMAL:1,
	CITY_CRITICAL:2,
	CITY_NOT_AWAKE:3,
	CITY_SLEEPED:4,	

	DISCOUNT_TYPE_AMOUNT:0,
	DISCOUNT_TYPE_PERCENT:1,
	RATE_ADDED_HOOK:'ratingAdded',
	DISCOUNT_HOCK:'applyDiscount',
	FB_CREATED:0,
	FB_SEEN:1,
	chatwoot_base:'https://app.chatwoot.com',
	chatwoot:'yS7XN7pJtiJzeXaycdE7FW1i',
	applink:'https://play.google.com/store/apps/details?id=com.freshline',
	ORDER_CREATED:0,
	ORDER_PLACED:1,
	ORDER_ACCEPTED:2,
	ORDER_READY:3,
	PICKUP_START:4,
	PICKUP_READY_START:5,
	REACHED_PICKUP:6,
	ORDER_PICKED:7,
	ORDER_DELIVERED:8,
	ORDER_CANCEL:9,
	
	slider_types:{
		product:0,
		category:1,
		sub_category:2,
		link:3
	},
	
	rrd:'#6B111B',
	//Colors
	
	grey:"#898989",
	grey1:'#707070',
	grey2:"#474747",
	blk:'#000000',
	brown:'#2e2727',
	greyw:'#7c7c7c',
	red:'#f85454',
	silver:'#C7C7C7',
	grey4:"#353535",
	grey5:'#3F3F3F',
	grey6:'#242424',
	blight:"#8f8f8f",


	primaryColor:'#4FC2F8',
	secondaryColor:'#D1F1FF',
	faintColor:'#f2f2f2',
	bgColor:"#ffffff",
	borderColor:'#d9d9d9',
	white:'#ffffff',

	colorFaint:'#D0AA455e',
	pColorDisable:'#7c662e',
	green:'#8fb300',
	red2:'#ef5350',
	red:'#c70a0a',
	app_ver:1,
	numList:['Add', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

	CAT_BASED:0,
	CAT_DISCOUNT:0,
	GLOBAL_DISCOUNT:1,

	CLF_DISCOUNT:2,
	CLF_DLV_DISCOUNT:3,

	NONE:0,
	PLATE:1,
	GLASS:2,
	BOWL:3,

	REFUND_CREATED:0,
	REFUND_PROCESSED:1,
	REFUND_SUCCESS:2,
	REFUND_FAILED:3,

	FOOD_NOT_PREPARED:0,
	FOOD_ACCEPT:1,
	FOOD_PREPARED:2,
	DELIVERY_FN_PREPARED:3,
	DELIVERY_F_PREPARED:4,
	HAS_PICKED_F:5,
	HAS_PICKED_C:6,
	HAS_CENTERED:7,
	HAS_DELIVERED:8,
	VDRFDCANCEL:9,

	FD_BOTH:0,
	FD_ONLYMNU:1,
	FD_ONLYDLV:2,
	FD_NONE:3,

	CANCELED:3,
	ORDERS:1,
	BOOKINGS:2,
	FOOD:3,
	code_sep:'CLF',
	hotelweb:'https://clufter.com/parnter/',
	share_link:'https://clufter.app.link/yHRtmn0Chcb',
	payConfig:{	    
	    //key:'rzp_test_UHQ3AYpUL3P5sM',
	    key:'rzp_test_8CYjaHQSsF7MBm',	    
	    webhookUrl:'https://clufter.com/app_api.php?type=razor_hook'
	},
	onesignal:'14124a7c-9378-42ed-91f4-cb2198669a6f',
	security:'&42jc4$',
	//Style
	model:{justifyContent:'center',alignItems:'center',height:'100%',width:'100%',backgroundColor:'#00000099'},
	model2:{height:'100%',width:'100%',backgroundColor:'#00000099'},
	hldr:{flex:1,backgroundColor:"#000"},
	main:{height:'97%',width:'100%'},
	max:{height:'100%',width:'100%'},
	row:{flexDirection:'row'},
	w30:{width:'30%'},
	w70:{width:'70%'},
	w60:{width:'60%'},
	w50:{width:'50%'},
	w40:{width:'40%'},
	w20:{width:'20%'},
	main2:{height:'100%',width:'100%',backgroundColor:'#000000'},
	main3:{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'},
	main4:{height:'100%',width:'100%',justifyContent:'center',backgroundColor:'#000000b4',alignItems:'center',position:'absolute',top:0,left:0},
	site_url:'https://deepakrathod.com/',
	//Shimmer 	
	skTT:{width:'60%',height:20, marginTop:7,marginBottom:7,marginLeft:5,borderRadius:0},
	//Dimensions
	height,
	width,
	
	BACK_ONLINE:0,

	parse_app_id:'myAppId',
	parse_js_key:'jsreact',
	parse_master_key:'myMasterKey',	
	cartErr:{
		NOT_AVL_CART:0,
		OUT_OF_STOCK:1,
		LMT_STOCK_ERR:3,
	},
	tbls:{
		SC:'sub_categories',
		AD:'address',
		UR:'users',
		TD:'trendings',
		TK:'Tasks',
		PK:'pickups',
		DL:'deliveries',
		AG:'agents',
		FB:'feedbacks',
		ORT:'orderRateTags',
		OR:'orderRatings',
	},
	yellow:'#fffd007',
	addressType:['Home', 'Work', 'Hostel'],
	homeBgColor:'#F9F9F9'	
}

export default helper;