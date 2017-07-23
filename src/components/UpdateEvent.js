// update notice implementation
import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import UploadPreview from 'material-ui-upload/UploadPreview';
import CustomAlert from './CustomAlert';
import { updateEvent } from '../data/events_f';

export default class UpdateEvent extends Component{

	constructor(props){
		super(props);
		this.state = {
			open: false,
			alertOpen: false,
			heading: "",
			body: "",
			pictures: {},
			key: "",
			disabled: false
		};
	}

	componentWillReceiveProps(props){
		let data = props.data.data;
		this.setState({
			open: props.open,
			heading: data.heading,
			body: data.body,
			pictures: data.photos,
			key: props.data.key,
			disabled: false
		});
	}

	picturesChange(pic){
		this.setState({pictures: pic})
	}

	updateEvent(){

		let data = {
			heading: this.state.heading,
			body: this.state.body,
			photos: this.state.pictures
		}
		if(!this.state.pictures){
			delete data["photos"];
		}
		this.setState({
			open: false,
			disabled: true
		});
		updateEvent(this.props.data.key, data).then((success) => {
			this.props.updateCallback();			
		}).catch(() => {
			this.props.updateFailCallback();
		});
		this.props.loadCallback(true);
	}

	render(){
		let actions = [
			<FlatButton
		        label="Cancel"
		        onTouchTap={() => {
		        	this.props.cancelCallback()
		        }} />,

			<FlatButton
				label="Update"
				secondary={true}
				onTouchTap={() => {
					console.log("Update This");
					this.setState({
						alertOpen: true
					});
				}}
				disabled={this.state.disabled} />,
			];

		return (
			<div>

				<Dialog
		        	title="Update Notice"
		        	actions={actions}
		        	modal = {true}
		        	open={this.state.open}
		        	autoScrollBodyContent={true} >
		        	 <TextField 
		         	 	hintText="Heading" 
		         	 	value={this.state.heading} 
		         	 	fullWidth={true} 
		         	 	onChange={(evt, newVal)=>{this.setState({heading: newVal})}}/>
		         	 <TextField 
		         	 	hintText="Body" 
		         	 	fullWidth={true} 
		         	 	multiLine={true} 
		         	 	rows={4}
		         	 	value={this.state.body}
		         	 	onChange={(evt, newVal) => {this.setState({body: newVal})}}/>
		         	 <UploadPreview 
		         	 	title="Notice Photos" 
		         	 	label="Add"
		         	 	initialItems={this.state.pictures}
		         	 	onChange={this.picturesChange.bind(this)}/>
		        </Dialog>
		        <CustomAlert 
		         	title="Do you want to update?" 
		         	open={this.state.alertOpen}
		         	yesCallback={() => {
		         		this.updateEvent();
		         		this.setState({alertOpen: false});
		         		// update the notice and return update
		         		
		         	}}
		         	noCallback={() => {
		         		console.log("no")
		         		this.setState({alertOpen: false});
		         	}} />
			</div>
		);

	}
}