// notice add and remove implementation here
// update implementation are to be added later

import firebase from '../firebaseConfig';

export const addEvent = (data) => {
	data.date = -Date.now();
 	let database = firebase.database();
	let key = database.ref().push().key;
	var uploadRef = firebase.storage("gs://student-council-5ed06.appspot.com").ref();
	
	if(Object.keys(data.photos).length <= 0){
		return database.ref("events/"+key+"/").update(data);
	}	

	let done = -1;
	return new Promise((resolve, reject) => {
		
		Object.keys(data.photos).forEach((i, j) => {
			fetch(data.photos[i]).then((res)=> res.blob()).then(blob => {
				let type = blob.type.split("/")[1];
				console.log("conversion to blob success");
				uploadRef.child(key+i+"."+type).put(blob).then(() => {
					console.log("file upload success.");
					uploadRef.child(key+i+"."+type).getDownloadURL().then(a => {
						data.photos[i] = a;	
						let len = Object.keys(data.photos).length - 1;							
						if(len === ++done){ 
							console.log("yes")
							database.ref('events/' + key + '/').update(data).then(x => resolve(x)).catch(y => reject(y));
						}
					}).catch( e => reject(e));
				}).catch( e => reject(e) );
			}).catch( e => reject(e) );
		});
	})	
}

export const getAllEvents = (data) => {
	return new Promise((resolve, reject)=>{

		let database = firebase.database();
		database.ref("events/").orderByChild("date").on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});

	});	
}

export const getThreeEvents = () => {
	return new Promise((resolve, reject)=>{
		let database = firebase.database();
		database.ref("events/").orderByChild("date").limitToFirst(3).on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});
	});
}

export const deleteEvent = (index, data) => {
	delete data[index];
	return firebase.database().ref('events/').set(data);
}

let nobase64 = {}, base64 = {};

export const updateEvent = (index, data) => {
	nobase64 = {};
	base64 = {};
	if(data.photos){
		Object.keys(data.photos).forEach((i) => {
			if(data.photos[i].search("base64") < 0){
				nobase64[i] = data.photos[i]
			}else{
				base64[i] = data.photos[i];
			}
		});
	}else{
		return update_noc(index, data);
	}

	if(Object.keys(nobase64).length === Object.keys(data.photos).length){
		return update_noc(index, data);
	}else{
		// this means photos has changed and we need to update both base64 and non base 64 images
		for(let i in data.photos){
			if(data.photos[i].search("base64") > 0){
				return update_with_base64(index, data)
			}
		}
		// this means there is no base 64
		return update_noc(index, data);
	}
}

const update_noc = (index, data) => {
	console.log(index, firebase.database().ref("events/").child(index));
	return firebase.database().ref("events/").child(index).set(data);
}

const update_with_base64 = (index, data) => {
	let database = firebase.database();
	var uploadRef = firebase.storage("gs://student-council-5ed06.appspot.com").ref();

	return new Promise((resolve, reject) => {
		
		Object.keys(base64).forEach((i, j) => {
			fetch(base64[i]).then((res)=> res.blob()).then(blob => {
				console.log("blob made");
				let type = blob.type.split("/")[1];
				uploadRef.child(index+i+"."+type).put(blob).then(() => {
					console.log("file uploaded")
					uploadRef.child(index+i+"."+type).getDownloadURL().then(a => {
						data.photos[i] = a;
						let len = Object.keys(base64).length - 1;
						console.log(j);							
						if(len === j){
							database.ref('events/').child(index).set(data).then(x => resolve(x)).catch(y => reject(y));
						}	
					}).catch( e => reject(e));
				}).catch( e => reject(e) );
			}).catch( e => reject(e) );
		});
	});
}

