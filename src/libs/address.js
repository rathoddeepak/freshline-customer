import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
let addresses = new Datastore({
	storage:AsyncStorage,
	filename: 'freshlline_adresses',
	autoload: true
});
let currentAddress = null;
const MAIN = 'freshlline_adresses';
const address = {
	setCurrentAddress(address){
		currentAddress = address;
	},
	getCurrentAddress(){
		return currentAddress;
	},
	getAddress(callback){
		addresses.findOne({_id:MAIN}, (e, d) => {			
			callback(d != null ? d : false);
		})
	},
	setAddress(data){
		global.user_lat = data.lat;
        global.user_long = data.lng;
        global.address_id = data.id;  
		addresses.findOne({_id:MAIN}, (e, d) => {    
			if(d != null){
				addresses.update({ _id: MAIN }, { $set: data }, { multi: true }, (e, n) => {});
			}else{
				data['_id'] = MAIN;
				addresses.insert(data, (e, n) => {});
			}
		})
	},
	flush(){
		addresses.remove({}, {multi: true}, (e, n) => {});
	}
}
export default address;