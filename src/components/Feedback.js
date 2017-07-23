// creating feedback form
import React, { Component } from 'react';
import app from '../firebaseConfig';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Notifications, { notify } from 'react-notify-toast';

let styles; 

export default class Feedback extends Component{
	
	constructor(props){
		super(props);
		this.state = {
			nameErrorText : "",
			feedbackErrorText: ""
		}
	}

	componentDidMount(){
	}

	buttonPress(){
		const errorText = "This field is required."
		const feedback = {
			name: this.name.input.value.trim(),
			feedback: this.feedback.input.refs.input.value.trim()
		};
		if(feedback.name === ""){
			this.setState((prevState) => {
				prevState.nameErrorText = errorText
				return prevState;
			});
		}else{
			this.setState((prevState) => {
				prevState.nameErrorText = ""
				return prevState;
			});
		}
		if(feedback.feedback === ""){
			this.setState((prevState) => {
				prevState.feedbackErrorText = errorText
				return prevState;
			})
		}else{
			this.setState((prevState) => {
				prevState.feedbackErrorText = ""
				return prevState;
			})
		}

		if( (feedback.name !== "") && (feedback.feedback !== "") ){
			let database = app.database();
			let key = database.ref().push().key;
			let data = {
					feedback: feedback.feedback,
					name: feedback.name,
					seen: false,
					date: -Date.now()
				};
			database.ref('feedbacks/' + key + '/').update(data).then(()=> {
				notify.show("Thank you for the feedback. Feedback Submitted :D", "success");
				this.name.input.value = "";
				this.feedback.input.refs.input.value = "";
			}).catch(()=> {
				notify.show("Your feedback couldnot be submitted right now :(", "error");
			});
			
		}
	}

	render(){
		const { wrapperStyle, headingStyle } = styles;
		return (
			<div className="wrapper" style={wrapperStyle}>
				<Notifications />
				<h1 style={headingStyle}>Feedback</h1>
				<h3 style={headingStyle}>Your feedbacks are important to us. Always keep it comming.</h3>
				<div style={{paddingLeft: "20px"}}>
					<TextField  
						floatingLabelText="Your Name" 
						fullWidth={true} 
						ref={(input) => {this.name = input;}} 
						errorText={this.state.nameErrorText}/>
					<br />
					<TextField 
						floatingLabelText="Feedback" 
						fullWidth={true} 
						multiLine={true} 
						rows={4} 
						ref={(input) => {this.feedback = input;}} 
						errorText={this.state.feedbackErrorText}/>
					<RaisedButton label="Send It" backgroundColor="#14ba72" primary={true} style={{marginTop: "10px"}} onClick={this.buttonPress.bind(this)}/>
				</div>
			</div>

		);
	}
}

styles = {
	wrapperStyle: {
		padding: "100px 0"
	},
	headingStyle: {
		fontWeight: 300,
		padding: "10px"
	}
} 