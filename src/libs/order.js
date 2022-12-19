import helper from 'assets/helper';

const odr = {
	getAnim(anim) {	
		switch(anim){
			case 'dl':
				return {file:require('assets/anims/delivered.json'),size:140};
			case 'ck':
				return {file:require('assets/anims/cooking.json'),size:100};
			case 'pp':
				return {file:require('assets/anims/confirm.json'),size:100};
			case 'ow':
				return {file:require('assets/anims/delivery.json'),size:100};
			case 'wt':
				return {file:require('assets/anims/waiting.json'),size:120};
			case 'cn':
				return {file:require('assets/anims/sad.json'),size:100};
			default:			
				return {file:require('assets/anims/waiting.json'),size:120};
		}
	},
	getStatus(anim, name = '') {
		switch(anim){
			case 'dl':
				return 'Delivered';
			case 'ck':
				return 'Preparing!';
			case 'pp':
				return 'Order Ready!';
			case 'ow':
				return name + ' Is On The Way';
			case 'wt':
				return 'Working on pickups';
			case 'cn':
				return 'We Apologize For That';
			case 'lk':
				return 'Assigning Hero..';
		}
	},
	getAgentStatus(agent_status) {
		switch(agent_status){
			case helper.ORDER_CREATED:
			return {text:'Created', color:helper.secondaryColor}
			case helper.ORDER_PLACED:
			return {text:'Waiting For Confirmation', color:helper.secondaryColor}
			case helper.ORDER_ACCEPTED:
			return {text:'Accepted', color:helper.primaryColor}
			case helper.ORDER_READY:
			return {text:'Ready To Pickup!', color:helper.primaryColor}
			case helper.PICKUP_START:
			case helper.PICKUP_READY_START:
			return {text:'Hero on Way To Pickup', color:helper.primaryColor}
			case helper.REACHED_PICKUP:
			return {text:'On Pickup Location', color:helper.primaryColor}
			case helper.ORDER_PICKED:
			return {text:'Order Picked', color:helper.green}
			case helper.ORDER_DELIVERED:
			return {text:'Order Delivered', color:helper.green}
			case helper.ORDER_CANCEL:
			return {text:'Order Cancelled!', color:helper.red}
			default:
			return '';
		}
	}
}

export default odr;