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
import { addNotice, getAllNotices, deleteNotice } from '../data/notice';
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
import UpdateNotice from './UpdateNotice';
import app from '../firebaseConfig';
import CustomAlert from './CustomAlert';

let thin, wrapper, arrayNotices = [];
export default class Dashboard extends Component {

	constructor(props){
		super(props);
		this.heading = "";
		this.body = "";
		this.state = {
			addNoticeOpen: false,
			pictures: {},	
			heading: "",
			body: "",
			loading: true,
			snackBarOpen: false,
			snackBarText: "",
			notices: {},
			dialogNoticeOpen: false,
			dialogNoticeData: {
				data: {}, key: ""
			},
			customAlertOpen: false,
			updateOpen: false,
		};
	}

	handleClose(){
		this.setState({addNoticeOpen: false})
	}

	FABclick(){
		this.setState({
			addNoticeOpen: true
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

	getNotices(){
		getAllNotices().then((db) => {
			if(!db.val()){
				this.setState({
					snackBarText: "There are no notices in database to load.",
					snackBarOpen: true,
					loading: false,
					notices: db.val()
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
					notices: data
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
		this.getNotices();
	}

	noticeClickHandler(index){
		console.log(arrayNotices[index])
		this.setState({
			dialogNoticeData: arrayNotices[index],
			dialogNoticeOpen: true
		});
	}
	renderNotices(){
		let notices = this.state.notices;
		if(!notices){ return null; }
		Object.keys(notices).forEach((i, j) => {
			arrayNotices[j] = {
				data: notices[i],
				key: i
			};
		});

		let trs = [];
		arrayNotices.forEach((i, j) => {
			trs[j] = (
				<TableRow key={i.key}>
			        <TableRowColumn key={i.key}>{i.key}</TableRowColumn>
			        <TableRowColumn key={i.key}>{i.data.heading}</TableRowColumn>
			        <TableRowColumn key={i.key}>{i.data.body}</TableRowColumn>
			    </TableRow>
			    );
		});
		return (
			<Table onCellClick={(cl) => {this.noticeClickHandler(cl)}}>
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

	sendNotice(){

		var data = {
			heading: this.state.heading,
			body: this.state.body,
			photos: this.state.pictures
		}
		this.setState({loading: true});

		addNotice(data).then((success) => {
			this.setState({
				snackBarText: "Notice added to database :D",
				snackBarOpen: true
			});
			this.renderNotices();
			this.getNotices();
		}).catch((error) => {
			this.setState({
				snackBarText: "Error: Notice couldnot be added to database :(",
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
		        primary={true}
		        onTouchTap={this.handleClose.bind(this)} />,
		      <FlatButton
		        label="Submit"
		        primary={true}
		        disabled={val}
		        onTouchTap={this.sendNotice.bind(this)} />,
		];
		let noticeDialogActions = [
			<FlatButton
		        label="Cancel"
		        onTouchTap={() => {this.setState({dialogNoticeOpen: false})}} />,

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
					// send the update data set the state to 
					this.setState({
						updateOpen: true
					});
				}} />
		];
		
		let body = this.renderNotices();
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
						<h2 style={{padding: "10px 0", fontWeight: 300}}>Dashboard</h2>
						<h3 style={thin}>Welcome {app.auth().currentUser.email}</h3>

						<Divider />

						<h1 style={thin}> <span style={{marginRight: "20px"}}>Notices</span>
							<FloatingActionButton mini={true} onClick={this.FABclick.bind(this)}>
						      <ContentAdd />
						    </FloatingActionButton>
					    </h1>  

					    <Dialog
				          title="Add Notice"
				          actions={actions}
				          modal={true}
				          open={this.state.addNoticeOpen} 
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

				        {body}
				        
				        <Snackbar
				          open={this.state.snackBarOpen}
				          message={this.state.snackBarText}
				          autoHideDuration={4000}
				          onRequestClose={this.handleSnackbarClose.bind(this)}
				        />

				        <Dialog
				          title={this.state.dialogNoticeData.data.heading}
				          actions={noticeDialogActions}
				          open={this.state.dialogNoticeOpen} 
				          autoScrollBodyContent={true} >
				         	{this.state.dialogNoticeData.data.body}	 
				         </Dialog>

				         <UpdateNotice 
				         	open={this.state.updateOpen} 
				         	data={this.state.dialogNoticeData}
				         	cancelCallback={() => {this.setState({updateOpen: false})}}
				         	updateCallback={() => {
				         		this.setState({
				         			updateOpen: false,
				         			snackBarText: "Update Successfull :)",
				         			snackBarOpen: true,
				         			dialogNoticeOpen: false,
				         		});
				         		this.getNotices();
				         		this.renderNotices();
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
				         		deleteNotice(this.state.dialogNoticeData.key, this.state.notices);
				         		let data = this.state.notices;
				         		delete data[this.state.dialogNoticeData];
				         		this.setState({
				         			dialogNoticeOpen: false,
				         			customAlertOpen: false,
				         			snackBarText: "Notice deleted :D",
				         			snackBarOpen: true,
				         			notices: data
				         		});
				         		this.getNotices();
				         		this.renderNotices();
				         	}}
				         	noCallback={() => {console.log("no")}} />


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