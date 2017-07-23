// admin Feedback implementation of the app
import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';

import { getFeedback, delFeedback, makeSeen } from '../data/feedback';
let wrapper;
let dataInArray = [];

export default class AdminFeedback extends Component {

	constructor(props){
		super(props);
		this.state = {
			cl: "",
			loadingData : true,
			feedback: [],
			openDialog: false,
			feedbackName: "",
			feecbackBody: "",
			feedbackID: "",
			delOpen: false,
			snackBarOpen: false,
			snackBarText: ""
		}
	}

	handleSnackbarClose(){
		this.setState({
			snackBarOpen: false
		});
	}

	componentDidMount(){
		getFeedback().then((db) => {
			if(!db.val()){
				this.setState({
					snackBarText: "There are no feedbacks in database to load.",
					snackBarOpen: true,
					loadingData: false,
					feedback: db.val()
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
					loadingData: false,
					feedback: data
				});
			}
		})
	}

	rowClick(cl){
		console.log(dataInArray[cl]);

		this.setState({
			cl,
			feedbackName: dataInArray[cl].name,
			feedbackBody: dataInArray[cl].feedback,
			openDialog: true
		});
		// make data seen
		let k = Object.keys(this.state.feedback)[cl]
		makeSeen(k, this.state.feedback);
	}

	loadTable(){
		let trs = [], j = 0;
		console.log(this.state.feedback);
		for(let feeds in this.state.feedback){
			let i =this.state.feedback[feeds]
			let s = (i.seen) ? {} : {backgroundColor: "#fcffdd"}
			let tr = (
				<TableRow style={s} key={feeds} onClick={(as) => {console.log(as);}}>
			        <TableRowColumn key={feeds}>{feeds}</TableRowColumn>
			        <TableRowColumn key={feeds}>{i.name}</TableRowColumn>
			        <TableRowColumn key={feeds}>{i.feedback}</TableRowColumn>
			    </TableRow>
			);
			dataInArray[j] = i
			trs[j++] = (
				tr
			);
		}
		
		return (
			<Table onCellClick={(cl)=> {this.rowClick(cl)}}>
		    <TableHeader adjustForCheckbox={false}>
		      <TableRow >
		        <TableHeaderColumn>ID</TableHeaderColumn>
		        <TableHeaderColumn>Name</TableHeaderColumn>
		        <TableHeaderColumn>Status</TableHeaderColumn>
		      </TableRow>
		    </TableHeader>
		    <TableBody showRowHover={true} displayRowCheckbox={false}>
		 		{trs}     
		    </TableBody>
		  </Table>
		);
	}

	handleClose(){
		this.setState({
			openDialog: false
		});
	}
	deleteFeedback(){
		// delete the feedback in the list
		let cl = this.state.cl;
		let k = Object.keys(this.state.feedback)[cl]
		delFeedback(k, this.state.feedback);
		this.setState({
			delOpen: false,
			openDialog: false
		});
	}

	handleDelClose(){
		this.setState({
			delOpen: false
		})
	}
	render(){
		const actions = [
	      <FlatButton
	        label="Cancel"
	        primary={true}
	        onTouchTap={this.handleClose.bind(this)} />,
	      <FlatButton
	        label="Delete"
	        secondary={true}
	        onTouchTap={() => {this.setState({delOpen: true})}} />,
	    ];
	    const delActions = [
	    	<FlatButton
	        label="No"
	        primary={true}
	        onTouchTap={this.handleDelClose.bind(this)} />,
	      <FlatButton
	        label="Delete"
	        secondary={true}
	        onTouchTap={this.deleteFeedback.bind(this)} />,
	    ]
		let body;
		if(this.state.loadingData){
			body = (
				<div style={{display: "inline-block", padding: "50px 0"}}>
					<CircularProgress />
				</div>
			);
		}else{
			body = this.loadTable();
		}
		return (
				<div className="wrapper" style={wrapper}>
					<Paper zDepth={1} style={{padding: "25px 30px"}}>
						<h1 style={{padding: "30px 0", fontWeight: 300}}>Feedbacks</h1>
						<div style={{textAlign: "center"}}>
						{body}
						</div>
						<Dialog
							title={this.state.feedbackName}
							modal={false}
							actions={actions}
							open={this.state.openDialog}
							onRequestClose={this.handleClose.bind(this)} >
								{this.state.feedbackBody}
						</Dialog>
						

						<Dialog
							actions={delActions}
							modal={false}
							open={this.state.delOpen}
							onRequestClose={this.handleDelClose.bind(this)} >
							Do you really want to delete ?
						</Dialog>
						 <Snackbar
				          open={this.state.snackBarOpen}
				          message={this.state.snackBarText}
				          autoHideDuration={4000}
				          onRequestClose={this.handleSnackbarClose.bind(this)}
				        />
					</Paper>
				</div>
		);
	}
}

wrapper = {
	padding: "30px 0"
}