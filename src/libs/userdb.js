import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
let cb = new Datastore({
	storage:AsyncStorage,
	filename: 'usrdta',
	autoload: true
});
let user = null;
const UserDB = {
	init(callback = false) {
		cb = new Datastore({
			storage:AsyncStorage,
			filename: 'usrdta',
			autoload: true
		});	
		cb.findOne({_id:'si'}, (err, fs) => {			
			user = fs;
			if(callback)callback(fs);
		});
	},
	getTour(callback = false){		    
		callback(user?.fdtur != undefined ? true : false);
	},
	setTour(callback = false){		
		cb.findOne({_id:'si'}, (err, it) => {		    
			if(it != null || it != undefined){					
				cb.update({}, { $set: {fdtur:true} }, { multi: true }, (err, numReplaced) => {});
			}
			if(callback)callback();
		});			
	},
	setUser({user_id, name}, callback){
		let usr = {_id:'si',user_id, name, fdtype:-1};
		user = usr;
		// global.se = se;
		global.user_id = user_id;
		cb.findOne({_id:'si'}, (err, it) => {		    
			if(it == null || it == undefined){	
				cb.insert(usr, (e, n) => {});
			}else{
			    cb.remove({}, {multi: true}, (e, n) => cb.insert(usr, (e, n) => {}));				
			}
			if(callback)callback();
		});
	},
	setName(name, callback){
		let update = {name};
		user['name'] = name;
		cb.findOne({_id:'si'}, (err, it) => {		    
			if(it != null || it != undefined){					
				cb.update({}, { $set: update }, { multi: true }, (err, numReplaced) => {});
			}
			if(callback)callback();
		});
	},
	setFoodType(fdtype, callback){
		let update = {fdtype};
		user['fdtype'] = fdtype;		
		cb.findOne({_id:'si'}, (err, it) => {		    
			if(it != null || it != undefined){				
				cb.update({}, { $set: update }, { multi: true }, (err, numReplaced) => {});
			}
			if(callback)callback();
		});
	},
	getUser(){		
		return user;
	},
	flush(){
		AsyncStorage.removeItem('cwCookie')
		user = null;
		cb.remove({}, {multi: true}, (e, n) => {});		
	}
}

export default UserDB;