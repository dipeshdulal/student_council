// implementation of upcomming Notes

import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { addNote, getAllNotes, updateNote, deleteNote } from '../data/note';
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

export default class Notes extends Component{

	constructor(props){
		super(props);
		this.state = {
			name: "",
			happen_date: {},
			link: "",
			open: false,
			loading: true,
			Notes: {},
			snackbarOpen: false,
			snackMessage: "",
			ukey: "",
			update: false,
			CustomAlertOpen: false,
		}
		this.arrayNotes = [];
	}

	componentDidMount(){
		this.getAllNotes();
	}

	getAllNotes = () => {
		this.setState({loading: true});
		getAllNotes().then(a => {
			let v = a.val();
			this.setState({loading: false})
			if(v){
				this.setState({
					Notes: v
				});
			}
		}).catch(e => console.log(e));
	}

	addUpcomming(){
		var data = {
			name: this.state.name,
			link: this.state.link
		}
		this.setState({
			open: false,
			loading: true,
		})
		addNote(data).then(a => {
			this.setState({
				snackMessage: "Upcomming Note Added :)",
				snackbarOpen: true
			});
			this.getAllNotes();
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

	handleChange(Note, date){
		this.setState({
			happen_date: date
		});
	}

	NoteClickHandler(cl){
		let data = this.arrayNotes[cl];
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
		let Notes = this.state.Notes;
		if(!Notes){ return null; }
		this.arrayNotes = [];
		Object.keys(Notes).forEach((i, j) => {
			this.arrayNotes[j] = {
				data: Notes[i],
				key: i
			};
		});

		let trs = [];
		this.arrayNotes.forEach((i, j) => {
			trs[j] = (
				<TableRow key={i.key}>
			        <TableRowColumn key={i.key}>{i.key}</TableRowColumn>
			        <TableRowColumn key={i.key}>{i.data.name}</TableRowColumn>
			        <TableRowColumn key={i.key}><a href={i.data.link}>{i.data.link}</a></TableRowColumn>
			    </TableRow>
			    );
		});
		return (
			<Table onCellClick={(cl) => {this.NoteClickHandler(cl)}}>
		    <TableHeader adjustForCheckbox={false}>
		      <TableRow >
		        <TableHeaderColumn>ID</TableHeaderColumn>
		        <TableHeaderColumn>Note Name</TableHeaderColumn>
		        <TableHeaderColumn>Link</TableHeaderColumn>
		      </TableRow>
		    </TableHeader>
		    <TableBody showRowHover={true} displayRowCheckbox={false}>
		 		{trs}     
		    </TableBody>
		  </Table>
		);
	}

	updateNote(key){
		var data = {
			name: this.state.name,
			link: this.state.link
		}
		this.setState({
			loading: true,
			open: false,
		});
		updateNote(key, data).then(a => {
			this.setState({
				snackMessage: "Upcomming Note Updated :)",
				snackbarOpen: true
			});
			this.getAllNotes();
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
					this.updateNote(this.state.ukey)
				}}/>
			]
		}
		return (
			<div className="wrapper" style={{padding: "30px 0"}}>	
				<Paper zDepth={1} style={{padding: "25px 30px"}}>
					<h1 style={thin}>
						<span style={{marginRight: "20px"}}>Notes</span>
						<FloatingActionButton mini={true} onClick={this.FABclick.bind(this)}>
					      <ContentAdd />
					    </FloatingActionButton>
					</h1>
					{body}

				</Paper>
				<Dialog 
					title="Add Upcomming Notes"
					actions={actions}
					modal={true}
					open={this.state.open}>
						<TextField hintText="Note Name" fullWidth={true} 
							onChange={(evt, val) => {
								this.setState({
									name: val
								});
							}} value={this.state.name}/> <br />
						<TextField hintText="Note Link eg: http://www.facebook.com/ACEM" fullWidth={true} 
							onChange={(evt, val) => {
								this.setState({
									link: val
								});
							}} value={this.state.link} /> <br />
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
				         		deleteNote(this.state.ukey, this.state.Notes).then(() => {
				         			let data = this.state.Notes;
					         		delete data[this.state.dialogNoteData];
					         		this.setState({
					         			open: false,
					         			CustomAlertOpen: false,
					         			snackBarText: "Note deleted :D",
					         			snackBarOpen: true,
					         			loading: true
					         		});
					         		this.getAllNotes();
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