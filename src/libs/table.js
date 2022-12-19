const table = {
	title(status, bid, id) {
		let p = 'Table No - ';
		switch(status){
			case 0:
			case 2:
			return p + id;
			case 1:
			return p + 'Waiting';
			case 3:
			case 4:
			return `Booking ID - ${bid}`;
			case 5:
			return `Booking Cancelled`;
		}
	},
	status(status, bid, id) {	
		switch(status){
			case 0:
			case 2:
			return {t:'CONFIRMED', c:'#00e676'};
			case 1:
			return {t:'CHECKING', c:'#ffea00'};
			case 3:
			case 4:
			return {t:'CANCELLED', c:'#ff1744'};
			case 5:			
			return {t:'PAYMENT NOT PROCESSED', c:'#ff1744'};
		}
	}
}

export default table;