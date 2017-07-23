// implementation of upcomming events

import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { addEvent, getAllEvents, updateEvent, deleteEvent } from '../data/upcomming_evts';
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
import CustomAlert from './CustomAlert';

let thin = {
	fontWeight: 300,
	padding: "20px 0"
};

export default class UpcommingEvts extends Component{

	constructor(props){
		super(props);
		this.state = {
			name: "",
			happen_date: {},
			link: "",
			open: false,
			loading: true,
			events: {},
			snackbarOpen: false,
			snackMessage: "",
			ukey: "",
			update: false,
			CustomAlertOpen: false,
		}
		this.arrayevents = [];
	}

	componentDidMount(){
		this.getAllEvents();
	}

	getAllEvents = () => {
		this.setState({loading: true});
		getAllEvents().then(a => {
			let v = a.val();
			this.setState({loading: false})
			if(v){
				this.setState({
					events: v
				});
			}
		}).catch(e => console.log(e));
	}

	addUpcomming(){
		var data = {
			name: this.state.name,
			happen_date: this.state.happen_date,
			link: this.state.link
		}
		this.setState({
			open: false,
			loading: true,
		})
		addEvent(data).then(a => {
			this.setState({
				snackMessage: "Upcomming Event Added :)",
				snackbarOpen: true
			});
			this.getAllEvents();
		}).catch(e => {
			this.setState({
				snackMessage: "Error: "+ e.message,
				snackbarOpen: true
			})
		});
	}

	FABclick(){
		this.setState({
			name: "",
			happen_date: {},
			link: "",
			update: false,
			open: true,
			ukey: ""
		});
		console.log("Here");
	}

	handleChange(event, date){
		this.setState({
			happen_date: date
		});
	}

	EventClickHandler(cl){
		let data = this.arrayevents[cl];
		this.setState({
			name: data.data.name,
			happen_date: new Date(data.data.happen_date),
			link: data.data.link,
			update: true,
			open: true,
			ukey: data.key
		});
		console.log(data);
	}

	renderTable(){
		let events = this.state.events;
		if(!events){ return null; }
		this.arrayevents = [];
		Object.keys(events).forEach((i, j) => {
			this.arrayevents[j] = {
				data: events[i],
				key: i
			};
		});

		let trs = [];
		this.arrayevents.forEach((i, j) => {
			let hd = new Date(i.data.happen_date);
			trs[j] = (
				<TableRow key={i.key}>
			        <TableRowColumn key={i.key}>{i.key}</TableRowColumn>
			        <TableRowColumn key={i.key}>{i.data.name}</TableRowColumn>
			        <TableRowColumn key={i.key}><a href={i.data.link}>{i.data.link}</a></TableRowColumn>
			        <TableRowColumn key={i.key}>{hd.toDateString()}</TableRowColumn>
			    </TableRow>
			    );
		});
		return (
			<Table onCellClick={(cl) => {this.EventClickHandler(cl)}}>
		    <TableHeader adjustForCheckbox={false}>
		      <TableRow >
		        <TableHeaderColumn>ID</TableHeaderColumn>
		        <TableHeaderColumn>Event Name</TableHeaderColumn>
		        <TableHeaderColumn>Link</TableHeaderColumn>
		        <TableHeaderColumn>Date</TableHeaderColumn>
		      </TableRow>
		    </TableHeader>
		    <TableBody showRowHover={true} displayRowCheckbox={false}>
		 		{trs}     
		    </TableBody>
		  </Table>
		);
	}

	updateEvent(key){
		var data = {
			name: this.state.name,
			happen_date: this.state.happen_date,
			link: this.state.link
		}
		this.setState({
			loading: true,
			open: false,
		});
		updateEvent(key, data).then(a => {
			this.setState({
				snackMessage: "Upcomming Event Updated :)",
				snackbarOpen: true
			});
			this.getAllEvents();
		}).catch(e => {
			this.setState({
				snackMessage: "Error: "+ e.message,
				snackbarOpen: true
			})
		});
	}

	render(){
		let body;
		if(this.state.loading){
			body = (
				<div style={{padding: "20px", textAlign: "center"}}>
				 <CircularProgress />
				</div>
			);
		}else{
			body=this.renderTable();
		}
		let actions = [
			<FlatButton label="Cancel" onClick={()=>this.setState({open: false})} />,
			<FlatButton label="Add" primary={true} onClick={this.addUpcomming.bind(this)}/>
		];
		if(this.state.update){
			actions = [
				<FlatButton label="Delete" secondary={true} onClick={() => {
					// create alert and then if yes then delete
					this.setState({CustomAlertOpen: true})
				}}/>,
				<FlatButton label="Cancel" onClick={()=>this.setState({open: false, update: false})} />,
				<FlatButton label="Update" primary={true} onClick={()=>{
					this.updateEvent(this.state.ukey)
				}}/>
			]
		}
		return (
			<div className="wrapper" style={{padding: "30px 0"}}>	
				<Paper zDepth={1} style={{padding: "25px 30px"}}>
					<h1 style={thin}>
						<span style={{marginRight: "20px"}}>Upcomming Events</span>
						<FloatingActionButton mini={true} onClick={this.FABclick.bind(this)}>
					      <ContentAdd />
					    </FloatingActionButton>
					</h1>
					{body}

				</Paper>
				<Dialog 
					title="Add Upcomming Events"
					actions={actions}
					modal={true}
					open={this.state.open}>
						<TextField hintText="Event Name" fullWidth={true} 
							onChange={(evt, val) => {
								this.setState({
									name: val
								});
							}} value={this.state.name}/> <br />
						<TextField hintText="Event Link eg: http://www.facebook.com/ACEM" fullWidth={true} 
							onChange={(evt, val) => {
								this.setState({
									link: val
								});
							}} value={this.state.link} /> <br />
						<DatePicker hintText="Event Date" mode="landscape" 
							onChange={ this.handleChange.bind(this) }
							value={this.state.happen_date} fullWidth={true} />
				</Dialog>	
				<Snackbar 
					open={this.state.snackbarOpen}
					message={this.state.snackMessage}
					autoHideDuration={4000}
					onRequestClose={this.snackbarClose}/>

				<CustomAlert 
				         	title="Do you want to delete ?" 
				         	open={this.state.CustomAlertOpen}
				         	yesCallback={() => {
				         		deleteEvent(this.state.ukey, this.state.events).then(() => {
				         			let data = this.state.events;
					         		delete data[this.state.dialogEventData];
					         		this.setState({
					         			open: false,
					         			CustomAlertOpen: false,
					         			snackBarText: "Event deleted :D",
					         			snackBarOpen: true,
					         			loading: true
					         		});
					         		this.getAllEvents();
				         		});
				         		this.setState({
				         			loading: true
				         		})
				         	}}
				         	noCallback={() => {
				         		this.setState({
				         			CustomAlertOpen: false
				         		})
				         	}} />
			</div>
		);
	}
	snackbarClose = ()=>{
		this.setState({snackbarOpen: false})
	}
}