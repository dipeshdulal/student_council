// upcomming_events implementation

import firebase from '../firebaseConfig';

export const addEvent = (data) => {
	data.date = -Date.now();
 	let database = firebase.database();
	let key = database.ref().push().key;
	if(!(data.happen_date instanceof Date)){
		data.happen_date = (new Date( Date.now() )).toISOString();
	}else{
		data.happen_date = data.happen_date.toISOString();
	}
	
	return database.ref("u_events/"+key+"/").update(data);
}

export const getAllEvents = (data) => {
	return new Promise((resolve, reject)=>{

		let database = firebase.database();
		database.ref("u_events/").orderByChild("date").on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});

	});	
}

export const getThreeEvents = () => {
	return new Promise((resolve, reject)=>{
		let database = firebase.database();
		database.ref("u_events/").orderByChild("date").limitToFirst(3).on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});
	});
}

export const deleteEvent = (index, data) => {
	delete data[index];
	return firebase.database().ref('u_events/').set(data);
}


export const updateEvent = (index, data) => {
	 return update_noc(index, data);
}

const update_noc = (index, data) => {
	data.date = -Date.now();
	data.happen_date = data.happen_date.toISOString();
	return firebase.database().ref("u_events/").child(index).set(data);
}

