import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
let cb = new Datastore({
	storage:AsyncStorage,
	filename: 'cart',
	autoload: true
});
let cartData = [];
let cartIds = [];
let cartCount = 0;
let total = 0;
let hotelChange = null;
let resetCount = null;
const MyCart = {
	release(){
		resetCount = null;
		hotelChange = null;
	},
	unmount(){
		cartData = [];
		cartIds = [];
		cartCount = 0;
		total = 0;
		hotelChange = null;
		resetCount = null;
	},
	init(callback = null, hc = null, lc = null) {
		cb = new Datastore({
			storage:AsyncStorage,
			filename: 'cart',
			autoload: true
		});
		cartIds = [];
		cartCount = 0;
		total = 0;
		cartData = [];
		cb.find({}).exec((err, fs) => {
			fs.forEach((item) => {
				cartData.push(item);
				cartCount += item.cartCount;				
				if(item.added != undefined && item.added?.length > 0){
					total += (item.price * item.cartCount);
				}else{
					total += item.total;
				}				
				cartIds.push(item.id);
			});
			if(callback != null)callback(fs);
		});
		hotelChange = hc;
		resetCount = lc;
	},	
	total(){
		return total;
	},
	getItem(id){
		let i = cartIds.indexOf(id);		
		if(i == -1)return false;
		return cartData[i];
	},
	getItemCount(id){		
		let i = cartIds.indexOf(id);		
		if(i == -1)return false;
		return cartData[i].cartCount;
	},
	cartCount(){
		return cartCount;
	},
	add(item){	    
		if(cartData.length > 0 && item.vendor_id != cartData[0].vendor_id){
			item['cartCount'] = 1;
			Alert.alert(
			    "Change Restaurant",
			    "To Add Food of New Hotel You Have To Remove Food of Previous Hotel",
			    [
			      {
			        text: "CANCEL",
			        onPress: () => {
			        	if(resetCount != null)resetCount(item);
			        },
			        style: "cancel",
			      },
			      {
			        text: "OK",
			        onPress: () => {
			        	item['cartCount'] = 1;			
						cb.remove({}, {multi: true}, (e, n) => {							
							cb.insert(item, (e, n) => {								
								cartIds = [item.id]						
								cartData = [item];
								cartCount = 1;
								total = item.price;
							});
						});
						if(hotelChange != null)hotelChange(item.price);
			        }			        
			      },
			    ],
			    {
			      cancelable: false			      
			    }
			);
			return;
		}
		cartCount++;
		total += item.price;
		let i = cartIds.indexOf(item.id);
		if(i == -1){
			cartIds.push(item.id);			
			item['cartCount'] = 1;
			cartData.push(item);
		}else{			
			item['cartCount'] = cartData[i].cartCount + 1;
			cartData[i] = item;
		}
		cb.findOne({id:item.id}).exec((err, it) => {			
			if(it == null || it == undefined){				
				cb.insert(item, (e, n) => {});
			}else{				
				let nItem = {cartCount:it.cartCount + 1};				
				it['cartCount'] = it.cartCount + 1;				
				cb.update({ id: it.id }, { $set: nItem }, { multi: false }, (e, n) => {});
			}
		});
	},
	shouldNotReset(item, callback){
		if(cartData.length > 0 && item.vendor_id != cartData[0].vendor_id){			
			Alert.alert(
			    "Change Restaurant",
			    "To Add Food of New Hotel You Have To Remove Food of Previous Hotel",
			    [
			      {
			        text: "CANCEL",
			        onPress: () => {
			        	callback(false);
			        },
			        style: "cancel",
			      },
			      {
			        text: "OK",
			        onPress: () => {			        	
			        	if(hotelChange != null)hotelChange(0);
			        	this.flush();
						callback(true);
			        }			        
			      },
			    ],
			    {
			      cancelable: false			      
			    }
			);
		}else{
			callback(true);
		}
	},
	itemReset(item, callback){
		Alert.alert("Addons Out of Stock", "Previously Added Customization Are Not Available Now You Need Add Item Again",
		    [
		      {
		        text: "CANCEL",
		        onPress: () => {
		        	callback(false);
		        },
		        style: "cancel",
		      },
		      {
		        text: "OK",
		        onPress: () => {			        	
		        	this.removeItem(item);
					callback(true);
		        }
		      },
		    ],
		    {
		      cancelable: false			      
		    }
		);
	},
	actViaAddon(item, totalCount, amount){
		if(cartData.length > 0 && item.vendor_id != cartData[0].vendor_id){
			item['cartCount'] = 1;
			Alert.alert(
			    "Change Restaurant",
			    "To Add Food of New Hotel You Have To Remove Food of Previous Hotel",
			    [
			      {
			        text: "CANCEL",
			        onPress: () => {
			        	if(resetCount != null)resetCount(item);
			        },
			        style: "cancel",
			      },
			      {
			        text: "OK",
			        onPress: () => {
			        	item['cartCount'] = 1;			
						cb.remove({}, {multi: true}, (e, n) => {							
							cb.insert(item, (e, n) => {								
								cartIds = [item.id]						
								cartData = [item];
								cartCount = 1;
								total = item.price;
							});
						});
						if(hotelChange != null)hotelChange(item.price);
			        }			        
			      },
			    ],
			    {
			      cancelable: false			      
			    }
			);
			return;
		}				
		let i = cartIds.indexOf(item.id);
		if(i == -1){
			cartIds.push(item.id);
			item['cartCount'] = totalCount;
			item['total'] = amount;
			total += amount;
			cartCount += totalCount;
			cartData.push(item);
		}else{
			item['cartCount'] = totalCount;
			item['total'] = amount;			
			item['added'] = item.added;
			cartData[i] = item;
		}
		cb.findOne({id:item.id}).exec((err, it) => {			
			if(it == null || it == undefined){			    
				cb.insert(item, (e, n) => {});
			}else{
				if(totalCount == 0){
					cartCount -= it.cartCount;
					total -= it.total;
					cb.remove({ id: it.id }, {multi: true}, (e, n) => {});
					return;
				}
				let nItem = {cartCount:totalCount,added:item.added,total:amount};
				it['cartCount'] = totalCount;
				if(it['cartCount'] != totalCount){
					if(it['cartCount'] > totalCount){
						cartCount -= (it['cartCount'] - totalCount);						
					}else{						
						cartCount += (totalCount - it['cartCount']);
					}
				}
				if(it['total'] != amount){
					if(it['total'] > amount){
						total -= (it['total'] - amount);						
					}else{						
						total += (amount - it['total']);
					}
				}				
				cb.update({ id: it.id }, { $set: nItem }, { multi: false }, (e, n) => {});
			}
		});
	},
	remove(item, itemRemove = 0){
		let i = cartIds.indexOf(item.id);		
		total -= item.price;
		if(cartCount > 0)cartCount--;
		cb.findOne({id:item.id}).exec((err, it) => {			
			if(it != null || it != undefined){		
				const cc = itemRemove == 1 ? 0 : it.cartCount - 1;
			    if(cc > 0){
			       cb.update({ id: it.id }, { $set:{cartCount:cc}}, { multi: true }, (e, n) => {});
			    }else{
			    	if(i != -1){
						cartIds.splice(i, 1);
						cartData.splice(i, 1);
					}
			        cb.remove({ id: it.id }, {multi: true}, (e, n) => {});
			    }				
			}
		});		
	},
	removeItem(item, callback){
		let i = cartIds.indexOf(item.id);		
		cb.findOne({id:item.id}).exec((err, it) => {			
			if(it != null || it != undefined){		
				if(cartCount > 0)cartCount -= it.cartCount;
				if(item?.addon == undefined){
					total -= (it.price * it.cartCount);
				}else{
					total -= item.total;
				}
		    	if(i != -1){
					cartIds.splice(i, 1);
					cartData.splice(i, 1);
				}
		        cb.remove({ id: it.id }, {multi: true}, (e, n) => {
		        	if(callback != null)callback()
		        });			    
			}
		});		
	},	
	removeVendor(vendor_id, callback){		
		cb.remove({vendor_id}, {multi: true}, (e, n) => {
			callback();
		});
	},
	flush(){
		cartIds = [];
		cartData = [];
		cartCount = 0;
		total = 0;
		cb.remove({}, {multi: true}, (e, n) => {});		
	}
}

export default MyCart;