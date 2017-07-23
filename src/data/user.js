// call to user related tasks from the api
import app1 from '../firebaseConfig.js';
import app from '../firebaseConfig';

export const createUser = (data) => {
	let database = app.database();
	return new Promise((resolve, reject) => {
		app1.auth().createUserWithEmailAndPassword(data.email, data.password).then((d) => {
			delete data["password"]; // not storing passwords in database
			database.ref('users/'+d.uid+'/').update(data).then(()=>{
				app1.auth().signOut()
				resolve("User created successfully :D");
			}).catch((error)=>{
				reject(error);
			});
		}).catch((error) => {
			reject(error);
		});
	});
	
}

export const getUsers = () => {
	return new Promise((resolve, reject) => {

		let database = app.database();
		database.ref("users/").on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});

	});	
}

export const deleteUser = (key, data) => {
	return new Promise((resolve, reject) => {
		delete data[key];
		app.database().ref("users/").set(data);
		resolve("Deleted user with uid: " + key);
	});
}