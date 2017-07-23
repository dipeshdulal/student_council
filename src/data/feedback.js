// the api to get the feedbacks stored 
import firebase from '../firebaseConfig';

export const getFeedback = () => {
	return new Promise((resolve, reject)=>{

		let database = firebase.database();
		database.ref("feedbacks/").orderByChild("date").on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});

	});	
}

export const delFeedback = (id, feedback) => {
	delete feedback[id];
	firebase.database().ref('feedbacks/').set(feedback);
}

export const makeSeen = (id, feedback) => {
	// make the row seen
	let d = feedback[id];
	d.seen = true;
	feedback[id] = d;
	firebase.database().ref('feedbacks/').set(feedback);
}