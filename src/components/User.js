// implementation of user addition and deletion
import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { createUser, getUsers, deleteUser } from '../data/user';
import CircularProgress from 'material-ui/CircularProgress';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import InfoIcon from 'material-ui/svg-icons/action/info';
import Avatar from 'material-ui/Avatar';
import app from '../firebaseConfig';
import CustomAlert from './CustomAlert';

let wrapper, thin;

let textarea = document.createElement("textarea");

export default class User extends Component{

	FABclick(){
		this.setState({
			userOpen: true
		});
	}

	constructor(props){
		super(props);
		this.state = {
			snackBarOpen: false,
			snackBarText: "",
			email: "",
			password: "",
			conf_password: "",
			userOpen: false,
			loading: true,
			name: "",
			users: {}, 
			customAlertOpen: false,
			userKey: "",
			resetOpen: false
		}
	}

	handleUserDialog(){
		this.setState({
			userOpen: false,
		});
	}

	createUser(){
		var data = {
			email: this.state.email,
			password: this.state.password,
			name: this.state.name
		}
		if(this.state.name.trim() === ""){
			this.setState({
				snackBarText: "Name shouldn't be empty. :(",
				snackBarOpen: true
			});
			return;
		}
		if(this.state.password === this.state.conf_password){
			// means validated then send for the thing
			this.setState({
				loading: true
			});
			createUser(data).then(() => {
				this.setState({
					snackBarText: "User " + data.email + " created. :D",
					snackBarOpen: true,
				});
				this.loadUsers();
			}).catch((error) => {
				this.setState({
					snackBarText: error.message,
					snackBarOpen: true
				});
			});
		}else{
			this.setState({
				snackBarText: "Password and Confirm Password doesnot match. :(",
				snackBarOpen: true
			});
		}
	}

	componentDidMount(){
		this.loadUsers();
	}

	loadUsers(){
		getUsers().then((d)=>{
			this.setState({
				users: d.val(),
				loading: false
			});
			if(!this.state.users){
				this.setState({
					snackBarText: "No users to display :/",
					snackBarOpen: true
				});
			}
		}).catch((e)=>{
			this.setState({
				snackBarText: e.message,
				snackBarOpen: true
			});
		});
	}

	openDialog(cl){
		let key = Object.keys(this.state.users)[cl];
		this.setState({
			customAlertOpen: true,
			userKey: key
		});
	}

	copyUID(cl){
		let key = Object.keys(this.state.users)[cl];
		textarea.innerHTML = key;
		document.body.appendChild(textarea);
		textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
		textarea.select();
		try{
			document.execCommand('copy');
			this.setState({
				snackBarText: "UID copied to clipboard",
				snackBarOpen: true,
				resetUID: key
			});
		}catch(err){
			console.log(err);
		}
	}

	renderUsers(){
		let trs = [], j = 0;
		if(this.state.users){
			let keys = Object.keys(this.state.users);
			keys.forEach((i) => {
				let d = this.state.users[i];
				trs[j++] = (
					<TableRow key={i}>
				        <TableRowColumn key={i}>{i}</TableRowColumn>
				        <TableRowColumn key={i}>{d.name}</TableRowColumn>
				        <TableRowColumn key={i}>{d.email}</TableRowColumn>
				    </TableRow>
				);
			});
		}

		return (
			<Table onCellClick={(cl, d, e)=>{
				if(d > 0){
					this.openDialog(cl);
				} else if(d === 0){
					this.copyUID(cl);
				}
			}}>
				<TableHeader adjustForCheckbox={false}>
					<TableRow >
						<TableHeaderColumn>UID</TableHeaderColumn>
						<TableHeaderColumn>Name</TableHeaderColumn>
						<TableHeaderColumn>Email</TableHeaderColumn>
						<TableHeaderColumn></TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody showRowHover={true} displayRowCheckbox={false}>
					{trs}     
				</TableBody>
			</Table>
		);	
		
	}

	sendResetEmail(){
		let uid = this.state.resetUID;
		let b = uid in this.state.users;
		if(b){
			// then reset
			let email = this.state.users[uid].email;
			app.auth().sendPasswordResetEmail(email).then(() => {
				this.setState({
					snackBarText: "Password reset email has been sent to " + email + " :D",
					snackBarOpen: true
				});
			}).catch((error) => {
				this.setState({
					snackBarText: "Couldnot send :/ -> "+error.message,
					snackBarOpen: true
				});
			});
		}else{
			this.setState({
				snackBarText: "Enter valid UID :(",
				snackBarOpen: true
			});
		}
	}

	render(){
		let body = null;
		let actions = [
			<FlatButton
				label="Create"
				primary={true}
				onTouchTap={() => {
					this.handleUserDialog();
					this.createUser();
				}} />,
			<FlatButton
				label="Cancel"
				secondary={true}
				onTouchTap={() => {
					this.handleUserDialog();
				}}/>

		];
		let resetActions = [
			<FlatButton
				label="Reset"
				primary={true}
				onTouchTap={()=>{
					this.sendResetEmail();
					this.setState({
						resetOpen: false
					});
				}} />,
			<FlatButton
				label="Cancel"
				secondary={true}
				onTouchTap={()=>{
					this.setState({
						resetOpen: false
					});
				}} />,
		];
		if(this.state.loading){
			body = (
				<div style={{padding: "30px 0"}}>
					<CircularProgress />
				</div>
			);
		}else{
			body = this.renderUsers();
		}
		return (
			<div className="wrapper" style={wrapper}>
				<Paper zDepth={1} style={{padding: "25px 30px"}}>
					<h1 style={thin}> <span style={{marginRight: "20px"}}>Users</span>
						<FloatingActionButton mini={true} onClick={this.FABclick.bind(this)}>
					      <ContentAdd />
					    </FloatingActionButton> 
					    <RaisedButton label="Reset Password" style={{marginLeft: "20px"}} 
					    	onClick={() => {
					    		this.setState({
					    			resetOpen: true
					    		});
					    	}}/>
				    </h1>  
				    <Chip>
				      <Avatar color="#444" icon={<InfoIcon />} />
			          Be sure to delete user from firebase console after deleting from here. 
			          Otherwise new users with same email id cant be created.
			        </Chip>
			        
					<div style={{textAlign: "center"}}>
					{body}
					</div>
					<Chip backgroundColor="#f29f9f">
				      <Avatar color="#d61b1b" icon={<InfoIcon />} backgroundColor="#fc5d5d"/>
			          After user has been created. You will be logged out so that batch user cant be created.
			        </Chip>
					<Dialog
						title="Add User"
						actions={actions}
						modal={true}
						open={this.state.userOpen} 
						autoScrollBodyContent={true} >
							 <TextField 
							 	hintText="Name" 
							 	value={this.state.name} 
							 	fullWidth={true} 
							 	onChange={(evt, newVal)=>{this.setState({ name: newVal} )}}/>
							
							 <TextField 
							 	hintText="Email" 
							 	value={this.state.email} 
							 	fullWidth={true} 
							 	type="email"
							 	onChange={(evt, newVal)=>{this.setState({ email: newVal} )}}/>
							 <TextField 
							 	hintText="Password" 
							 	fullWidth={true} 
							 	value={this.state.password}
							 	type="password"
							 	onChange={(evt, newVal) => {this.setState({ password: newVal} )}}/>
							 <TextField 
							 	hintText="Confirm Password" 
							 	fullWidth={true} 
							 	value={this.state.conf_password}
							 	type="password"
							 	onChange={(evt, newVal) => {this.setState({ conf_password: newVal} )}}/>
					</Dialog>
					<Dialog 
						title="Reset password"
						actions={resetActions}
						modal={false}
						open={this.state.resetOpen}>
						<TextField 
							hintText="UID of user to reset password."
							value={this.state.resetUID}
							onChange={(evt, newVal) => {this.setState({resetUID: newVal})}}
							/>
					</Dialog>
					<CustomAlert 
			         	title="Do you want to delete this user ?" 
			         	open={this.state.customAlertOpen}
			         	yesCallback={() => {
			         		deleteUser(this.state.userKey, this.state.users).then((yes)=>{
			         			this.setState({
			         				snackBarText: yes,
			         				snackBarOpen: true
			         			});
			         		}).catch((e) => {
			         			this.setState({
			         				snackBarText: e.message,
			         				snackBarOpen: true
			         			});
			         		});
			         	}}

			         	noCallback={() => {
			         		this.setState({
				         		customAlertOpen: false
				         	});
			         	}} />
					
					<Snackbar
			          open={this.state.snackBarOpen}
			          message={this.state.snackBarText}
			          autoHideDuration={4000}
			          onRequestClose={this.handleSnackbarClose.bind(this)} />
				</Paper>
			</div>
		);
	}

	handleSnackbarClose(){
		this.setState({
			snackBarOpen: false
		});
	}
}

thin = {
	fontWeight: 300,
	padding: "20px 0"
}

wrapper = {
	padding: "30px 0"
}