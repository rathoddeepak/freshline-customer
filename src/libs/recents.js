import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
let recentDB = new Datastore({
	storage:AsyncStorage,
	filename: 'recents',
	autoload: true
});
let currentAddress = null;
const MAIN = 'main';
const recents = {
	addRecent(text, deleteLast){
		const id = parseInt(new Date().getTime() / 1000);
		recentDB.insert({id, text}, function (err, newDoc) {   // Callback is optional
		  if(deleteLast){
		  	recentDB.findOne({}).sort({ id: 1 }).exec((err, doc) => {
			  if(doc != undefined){
			  	recentDB.remove({id:doc.id}, {multi: true}, (e, n) => {});
			  }
			});
		  }
		});
	},
	removeRecent(id, callback = null){
		recentDB.remove({id}, {multi: true}, (e, n) => {
			if(callback != null)callback();
		});
	},
	getRecents(callback){
		recentDB.find({}).sort({id:-1}).exec((err, docs) => {
			if(err == undefined){
				callback(docs)
			}else{
				callback([])
			}
		});
	},	
	flush(){
		recentDB.remove({}, {multi: true}, (e, n) => {});
	}
}
export default recents;