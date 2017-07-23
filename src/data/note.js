// upcomming_events implementation

import firebase from '../firebaseConfig';

export const addNote = (data) => {
	data.date = -Date.now();
 	let database = firebase.database();
	let key = database.ref().push().key;
	return database.ref("notes/"+key+"/").update(data);
}

export const getAllNotes = (data) => {
	return new Promise((resolve, reject)=>{

		let database = firebase.database();
		database.ref("notes/").orderByChild("date").on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});

	});	
}
export const deleteNote = (index, data) => {
	delete data[index];
	return firebase.database().ref('notes/').set(data);
}


export const updateNote = (index, data) => {
	 return update_noc(index, data);
}

const update_noc = (index, data) => {
	data.date = -Date.now();
	return firebase.database().ref("notes/").child(index).set(data);
}

