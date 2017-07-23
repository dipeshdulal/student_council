// notice add and remove implementation here
// update implementation are to be added later

import firebase from '../firebaseConfig';

export const addNotice = (data) => {
	data.date = -Date.now();
 	let database = firebase.database();
	let key = database.ref().push().key;
	var uploadRef = firebase.storage("gs://student-council-5ed06.appspot.com").ref();
	let done = -1;
	if(Object.keys(data.photos).length <= 0){
		return database.ref('notices/' + key + '/').update(data);	
	}
	return	new Promise((resolve, reject) => {
		
			Object.keys(data.photos).forEach((i, j) => {
				fetch(data.photos[i]).then((res)=> res.blob()).then(blob => {
					let type = blob.type.split("/")[1];
					uploadRef.child(key+i+"."+type).put(blob).then(() => {
						uploadRef.child(key+i+"."+type).getDownloadURL().then(a => {
							data.photos[i] = a;	
							let len = Object.keys(data.photos).length - 1;
							console.log(done, len);							
							if(len === ++done){ 
								console.log("yes")
								database.ref('notices/' + key + '/').update(data).then(x => resolve(x)).catch(y => reject(y));
							}
						}).catch( e => reject(e));
					}).catch( e => reject(e) );
				}).catch( e => reject(e) );
			});

		});
	
}

export const getAllNotices = (data) => {
	return new Promise((resolve, reject)=>{

		let database = firebase.database();
		database.ref("notices/").orderByChild("date").on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});

	});	
}

export const getThreeNotices = () => {
	return new Promise((resolve, reject)=>{
		let database = firebase.database();
		database.ref("notices/").orderByChild("date").limitToFirst(3).on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});
	});
}

export const loadMore = (limit) => {
	return new Promise((resolve, reject)=>{
		let database = firebase.database();
		database.ref("notices/").orderByChild("date").limitToFirst(limit).on("value", (snapshot)=>{
			resolve(snapshot);
		}, (error) => {
			reject(error);
		});
	});
}

export const deleteNotice = (index, data) => {
	delete data[index];
	firebase.database().ref('notices/').set(data);
}

let nobase64 = {}, base64 = {};

export const updateNotice = (index, data) => {
	nobase64 = {};
	base64 = {};
	console.log(index);
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
	return firebase.database().ref("notices/").child(index).set(data);
}


const update_with_base64 = (index, data) => {
	let database = firebase.database();
	var uploadRef = firebase.storage("gs://student-council-5ed06.appspot.com").ref();
	let update_done = -1;

	return new Promise((resolve, reject) => {
		
		Object.keys(base64).eachSeries((i, j) => {
			fetch(base64[i]).then((res)=> res.blob()).then(blob => {
				console.log("blob made");
				let type = blob.type.split("/")[1];
				uploadRef.child(index+i+"."+type).put(blob).then(() => {
					console.log("file uploaded")
					uploadRef.child(index+i+"."+type).getDownloadURL().then(a => {
						data.photos[i] = a;
						let len = Object.keys(base64).length - 1;
						console.log(update_done, len);
						update_done++							
						if(len === update_done){
							database.ref('notices/').child(index).set(data).then(x => resolve(x)).catch(y => reject(y));
						}	
					}).catch( e => reject(e));
				}).catch( e => reject(e) );
			}).catch( e => reject(e) );
		});
	});
}