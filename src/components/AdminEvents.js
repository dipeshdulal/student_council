// Dashboard implementation of the app
import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import UploadPreview from 'material-ui-upload/UploadPreview';
import { addEvent, getAllEvents, deleteEvent } from '../data/events_f';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import UpdateEvent from './UpdateEvent';
import CustomAlert from './CustomAlert';

let thin, wrapper;
export default class AdminEvents extends Component {

	constructor(props){
		super(props);
		this.heading = "";
		this.body = "";
		this.arrayevents = [];
		this.state = {
			addEventOpen: false,
			pictures: {},	
			heading: "",
			body: "",
			loading: true,
			snackBarOpen: false,
			snackBarText: "",
			events: {},
			dialogEventOpen: false,
			dialogEventData: {
				data: {}, key: ""
			},
			customAlertOpen: false,
			updateOpen: false,
		};
	}

	handleClose(){
		this.setState({addEventOpen: false})
	}

	FABclick(){
		this.setState({
			addEventOpen: true
		});
	}

	picturesChange(pic){
		this.setState({pictures: pic})
	}
 
	validator(){
		let head_len = this.state.heading.length;
		if((head_len > 10)){
			return false;
		}else{
			return true;
		}
	}

	getevents(){
		getAllEvents().then((db) => {
			if(!db.val()){
				this.setState({
					snackBarText: "There are no events in database to load.",
					snackBarOpen: true,
					loading: false,
					events: db.val()
				});
			}else{
				let data = {};
				let keys = Object.keys(db.val());
				let i = 0;
				db.forEach((v) => {
					let val = v.val();
					data[keys[i++]] = val;
				})
				this.setState({
					loading: false,
					events: data
				});
			}
		});
		this.setState({
			heading: "",
			body: "",
			pictures: {}
		});
	}

	componentDidMount(){
		this.getevents();
	}

	EventClickHandler(index){
		console.log(this.arrayevents[index]);
		this.setState({
			dialogEventData: this.arrayevents[index],
			dialogEventOpen: true
		});
	}
	renderevents(){
		let events = this.state.events;
		if(!events){ return null; }
		Object.keys(events).forEach((i, j) => {
			this.arrayevents[j] = {
				data: events[i],
				key: i
			};
		});

		let trs = [];
		this.arrayevents.forEach((i, j) => {
			trs[j] = (
				<TableRow key={i.key}>
			        <TableRowColumn key={i.key}>{i.key}</TableRowColumn>
			        <TableRowColumn key={i.key}>{i.data.heading}</TableRowColumn>
			        <TableRowColumn key={i.key}>{i.data.body}</TableRowColumn>
			    </TableRow>
			    );
		});
		return (
			<Table onCellClick={(cl) => {this.EventClickHandler(cl)}}>
		    <TableHeader adjustForCheckbox={false}>
		      <TableRow >
		        <TableHeaderColumn>ID</TableHeaderColumn>
		        <TableHeaderColumn>Heading</TableHeaderColumn>
		        <TableHeaderColumn>Body</TableHeaderColumn>
		      </TableRow>
		    </TableHeader>
		    <TableBody showRowHover={true} displayRowCheckbox={false}>
		 		{trs}     
		    </TableBody>
		  </Table>
		);
	}

	sendEvent(){

		var data = {
			heading: this.state.heading,
			body: this.state.body,
			photos: this.state.pictures
		}
		this.setState({loading: true});

		addEvent(data).then((success) => {
			this.setState({
				snackBarText: "Event added to database :D",
				snackBarOpen: true
			});
			this.getevents();
			this.renderevents();
		}).catch((error) => {
			this.setState({
				snackBarText: "Error: Event couldnot be added to database :(",
				snackBarOpen: true 
			});
		});
		this.handleClose();			
	}

	handleSnackbarClose(){
		this.setState({
			snackBarOpen: false
		});
	}


	render(){
		var val = this.validator();
		let actions = [
			 <FlatButton
		        label="Cancel"
		        secondary={true}
		        onTouchTap={this.handleClose.bind(this)} />,
		      <FlatButton
		        label="Submit"
		        disabled={val}
		        primary={true}
		        onTouchTap={this.sendEvent.bind(this)} />,
		];
		let EventDialogActions = [
			<FlatButton
		        label="Cancel"
		        onTouchTap={() => {this.setState({dialogEventOpen: false})}} />,

			<FlatButton
				label="Delete"
				secondary={true}
				onTouchTap={() => {
					console.log("tapped");
					this.setState({customAlertOpen: true})
				}} />,

			<FlatButton 
				label="Update"
				primary={true}
				onTouchTap={() => {
					console.log("Update this");
					// send the update data set the state to 
					this.setState({
						updateOpen: true
					});
				}} />
		];
		
		let body = this.renderevents();
		if(this.state.loading){
			body = (
				<div style={{padding: "20px", textAlign: "center"}}>
				 <CircularProgress />
				</div>
			);	
		}

		return (
				<div className="wrapper" style={wrapper}>
					<Paper zDepth={1} style={{padding: "25px 30px"}}>

						<h1 style={thin}> <span style={{marginRight: "20px"}}>Events</span>
							<FloatingActionButton mini={true} onClick={this.FABclick.bind(this)}>
						      <ContentAdd />
						    </FloatingActionButton>
					    </h1>  
						
						<Divider />

					    <Dialog
				          title="Add Event"
				          actions={actions}
				          modal={true}
				          open={this.state.addEventOpen} 
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
				         	 	title="Event Photos" 
				         	 	label="Add"
				         	 	initialItems={this.state.pictures}
				         	 	onChange={this.picturesChange.bind(this)}/>
				        </Dialog>

				        {body}
				        
				        <Snackbar
				          open={this.state.snackBarOpen}
				          message={this.state.snackBarText}
				          autoHideDuration={4000}
				          onRequestClose={this.handleSnackbarClose.bind(this)}
				        />

				        <Dialog
				          title={this.state.dialogEventData.data.heading}
				          actions={EventDialogActions}
				          open={this.state.dialogEventOpen} 
				          autoScrollBodyContent={true} >
				         	{this.state.dialogEventData.data.body}	 
				         </Dialog>

				         <UpdateEvent 
				         	open={this.state.updateOpen} 
				         	data={this.state.dialogEventData}
				         	cancelCallback={() => {this.setState({updateOpen: false})}}
				         	updateCallback={() => {
				         		this.setState({
				         			updateOpen: false,
				         			snackBarText: "Update Successfull :)",
				         			snackBarOpen: true,
				         			dialogEventOpen: false,
				         		});
				         		this.getevents();
				         		this.renderevents();
				         	}}
				         	loadCallback={(loading) => {
				         		this.setState({loading: loading});
				         	}}
				         	updateFailCallback={() => {
				         		this.setState({
				         			snackBarText: "Update cannot be done! :(",
				         			snackBarOpen: true
				         		})
				         	}}/>


				         <CustomAlert 
				         	title="Do you want to delete ?" 
				         	open={this.state.customAlertOpen}
				         	yesCallback={() => {
				         		deleteEvent(this.state.dialogEventData.key, this.state.events).then(() => {
				         			let data = this.state.events;
					         		delete data[this.state.dialogEventData];
					         		this.setState({
					         			dialogEventOpen: false,
					         			customAlertOpen: false,
					         			snackBarText: "Event deleted :D",
					         			snackBarOpen: true,
					         			events: data
					         		});
					         		this.getevents();	
				         		});
				         		this.setState({
				         			loading: true
				         		})
				         	}}
				         	noCallback={() => {
				         		this.setState({
				         			customAlertOpen: false
				         		})
				         	}} />


					</Paper>
				</div>
		);
	}
}

thin = {
	fontWeight: 300,
	padding: "20px 0"
}

wrapper = {
	padding: "30px 0"
}