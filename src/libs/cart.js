let listener = null;
const Cart = {
	addCartListener:(ls) => {
		listener = ls;
	},
	removeCartListener:() => {
		listener = null;
	},
	changed: (cartData) => {
		if(listener == null)return;
		listener(cartData);
	}
}

export default Cart;