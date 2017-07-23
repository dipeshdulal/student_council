import React, {Component } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import firebase from '../firebaseConfig';
import Snackbar from 'material-ui/Snackbar';
import {adminUID} from '../adminUID';
let headingStyle, email, password;

export default class LoginPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			submitted: false,
			username: "",
			password: "",
			errorMessage: "",
			open: false
		}
	}

	componentWillUnmount(){
		this.props.componentUnmountedCallback();
	}

	handleRequestClose = () => {
		this.setState({
		  open: false,
		});
	};

	// loginLogic
	submitForm(){
		let detail = {
			email:	email.input.value,
			password: password.input.value
		}
		this.setState({submitted: true});

		// deauthenticate and then 
		firebase.auth().signOut().then(() => {
			firebase.auth().signInWithEmailAndPassword(detail.email, detail.password).catch((error) => {
				this.setState({
					errorMessage: "Authentication Error: " + error.message,
					open: true,
					submitted: false
				});	
			});
		});
		firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				if(user.uid === adminUID){
						this.setState({
							errorMessage: "Authentication Successfull :)",
							open: true,
							submitted: true
						});
						this.props.authenticatedCallback();
						return;
				}
				firebase.database().ref('users/').child(user.uid).once('value').then((val) => {
					if(val.val()){
						this.setState({
							errorMessage: "Authentication Successfull :)",
							open: true,
							submitted: true
						});
						this.props.authenticatedCallback();
					}else{
						this.setState({
							errorMessage: "Couldn't log you in :(",
							open: true,
							submitted: false
							
						});
						firebase.auth().signOut().then(() => {} ).catch(() => {});
					}
				}).catch(() => {
					this.setState({
						errorMessage: "Couldn't log you in :(",
						open: true,
						submitted: false
						
					})
				});
			}
		});

		// authentication successfull callback needs to be called.
	}

	render(){
		let body = (
			<div style={{display: "inline-block", padding: "50px 0"}}>
				<h1 style = {headingStyle}>Login</h1>
				<form>
					<TextField hintText="Email" type="email" ref={(user) => {email = user}}/> 
					<br />
					<TextField hintText="Password" type="password" ref={(pass) => { password = pass}}/>
					<br />
					<div style={{textAlign: "left", padding: "10px 0"}}>
						<RaisedButton label="Login" primary={true} onClick={this.submitForm.bind(this)} fullWidth={true}/>
					</div>
				</form>
			</div>
		);
		if(this.state.submitted){
			body = (
				<div style={{padding: "150px 0"}}>
					<CircularProgress />
				</div>
			);	
		}
		return (
			<div className="wrapper" style={{padding: "50px 0", textAlign: "center"}}>
				<Paper zDepth={3} style={{margin: "10px"}}>
					{body}			
				</Paper>
				<Snackbar
		          open={this.state.open}
		          message={this.state.errorMessage}
		          autoHideDuration={4000}
		          onRequestClose={this.handleRequestClose}
		        />
			</div>
		);
	}
}

headingStyle = {
	fontWeight: 300,
	padding: "20px 0",
	textAlign: "left"
}