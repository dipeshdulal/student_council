// alert component implementation
import React, {Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class CustomAlert extends Component{

	constructor(props){
		super(props);
		this.state = {
			open: this.props.open
		};
	}

	handleOpen(){
		this.setState({
			open: true
		});
	}

	handleClose(){
		this.setState({
			open: false
		});
	}

	componentWillReceiveProps(props){
		this.setState({
			open: props.open
		})
	}

	render(){
		let actions = [
			 <FlatButton
		        label="No"
		        primary={true}
		        onTouchTap={() => { 
		        	this.handleClose();
		        	this.props.noCallback(); 
		        }} />,
		      <FlatButton
		        label="Yes"
		        secondary={true}
		        onTouchTap={() => {
		        	this.handleClose();
		        	this.props.yesCallback();
		        }} />,
		];
		return (
			<Dialog
				title={this.props.title}
				actions={actions}
				open={this.state.open} 
				modal={false}
				autoScrollBodyContent={true}
				onRequestClose={this.handleClose.bind(this)} >
					{this.props.body}	 
				</Dialog>
		);
	}
}