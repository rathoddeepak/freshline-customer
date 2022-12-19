import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Image
} from 'react-native';
import helper from 'assets/helper';
import lang from 'assets/lang';
const loc = 'assets/icons/'
export default class Icon extends Component {
	render() {
		const {name,size,color,style,resizeMode} = this.props;
		switch (name){
			case lang.home:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'home.png')} tintColor={color} />);
			case 'close':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'close.png')} tintColor={color} />);
			case 'wallet':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'wallet.png')} tintColor={color} />);
			case 'upright':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'upright.png')} tintColor={color} />);
			case 'star3':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'star3.png')} tintColor={color} />);
			case 'discount':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'discount.png')} tintColor={color} />);
			case 'fav':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'fav.png')} tintColor={color} />);
			case lang.hm2:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'hm2.png')} tintColor={color} />);
			case lang.bl:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'bill.png')} tintColor={color} />);
			case lang.mc:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'mic.png')} tintColor={color} />);
			case lang.srch:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'search.png')} tintColor={color} />);
			case lang.cod:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'cod.png')} tintColor={color} />);
			case lang.onl:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'online.png')} tintColor={color} />);
			case 'wp':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'whatsapp.png')} tintColor={color} />);
			case 'door':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'door.png')} tintColor={color} />);
			case 'tg':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'telegram.png')} tintColor={color} />);
			case 'fb':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'feedback.png')} tintColor={color} />);
			case lang.rup:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'rp.png')} tintColor={color} />);
			case lang.vst:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'visit.png')} tintColor={color} />);
			case lang.qr:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'qr.png')} tintColor={color} />);
			case lang.phn:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'phone.png')} tintColor={color} />);
			case lang.ply:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'play.png')} tintColor={color} />);
			case lang.mr:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'more.png')} tintColor={color} />);
			case lang.pls:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'plus.png')} tintColor={color} />);
			case lang.mns:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'minus.png')} tintColor={color} />);
			case lang.bskt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'basket.png')} tintColor={color} />);
			case lang.table:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'table.png')} tintColor={color} />);
			case lang.plate:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'plate.png')} tintColor={color} />);
			case lang.gps:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'gps.png')} tintColor={color} />);
			case lang.meal:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'meal.png')} tintColor={color} />);			
			case lang.nav:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'navigate.png')} tintColor={color} />);
			case lang.tm:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'time.png')} tintColor={color} />);
			case lang.shr:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'share.png')} tintColor={color} />);			
			case lang.shr2:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'share2.png')} tintColor={color} />);
			case lang.fon:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'flaon.png')} tintColor={color} />);
			case lang.fof:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'flaof.png')} tintColor={color} />);					
			case lang.wb:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'web.png')} tintColor={color} />);
	        case lang.rfd:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'refund.png')} tintColor={color} />);
			case lang.lng:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'lang.png')} tintColor={color} />);
			case lang.st2:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'star2.png')} tintColor={color} />);
			case lang.hlctr:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'help.png')} tintColor={color} />);
			case lang.rpt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'report.png')} tintColor={color} />);
			case lang.abt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'about.png')} tintColor={color} />);
			case lang.lw:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'law.png')} tintColor={color} />);
			case lang.cd:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'code.png')} tintColor={color} />);
			case lang.opl:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'opl.png')} tintColor={color} />);
			case lang.mny:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'money.png')} tintColor={color} />);
			case lang.rcnt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'recent.png')} tintColor={color} />);
			case lang.trh:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'trash.png')} tintColor={color} />);
			case lang.user:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'user.png')} tintColor={color} />);
			case lang.bell:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'bell.png')} tintColor={color} />);
			case lang.pin:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'pin.png')} tintColor={color} />);
			case lang.vrfd:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'verified.png')} tintColor={color} />);
			case lang.str:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'star.png')} tintColor={color} />);
			case lang.chk:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'check.png')} tintColor={color} />);
			case lang.arwbck:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'left_arrow.png')} tintColor={color} />);
			case lang.arwfrw:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'right_arrow.png')} tintColor={color} />);
			case lang.rty:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'retry.png')} tintColor={color} />);
			case lang.fltr:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'filter.png')} tintColor={color} />);
			case 'onlpay':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'onlpay.png')} tintColor={color} />);			
			case lang.cvrgt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'cvright.png')} tintColor={color} />);
			case lang.cvlft:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'cvleft.png')} tintColor={color} />);
			case lang.ms:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'mess.png')} tintColor={color} />);
			case lang.cvd:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'chv_dwn.png')} tintColor={color} />);
			case lang.gft:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'gft.png')} tintColor={color} />);
			case lang.lgt:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'logout.png')} tintColor={color} />);
			case lang.adrs:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'address.png')} tintColor={color} />);
			case lang.pry:			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'pray.png')} tintColor={color} />);
			case lang.bdg:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'building.png')} tintColor={color} />);
			case lang.mctr:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'centerpin.png')} tintColor={color} />);
			case 'bill2':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'bill2.png')} tintColor={color} />);
			case 'food':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'food.png')} tintColor={color} />);
			case 'riderBike':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'riderBike.png')} tintColor={color} />);
			case 'checkbox':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'checkbox.png')} tintColor={color} />);

			case 'scup':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'scup.png')} tintColor={color} />);
			case 'fdtype':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'fdtype.png')} tintColor={color} />);
			case 'filter2':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'filter2.png')} tintColor={color} />);
			case 'veg':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'veg.png')} tintColor={color} />);
			case 'cart':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'cart.png')} tintColor={color} />);
			case 'trend':
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'trend.png')} tintColor={color} />);
			default:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'home.png')} tintColor={color} />);
		}
	}
}

Icon.defaultProps = {
	name:'home',
	size:22,
	color:helper.white,
	style:{},
	resizeMode:'center'
}
Icon.propTypes = {
	name:PropTypes.string,
	size:PropTypes.number,
	color:PropTypes.string,
	style:PropTypes.object,
	resizeMode:PropTypes.string,
}