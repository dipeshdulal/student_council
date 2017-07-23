import React, {Component} from 'react';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import cardImage from '../images/logo.jpg';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

let imageStyle = {
	height: "200px",
	objectFit: "cover" 
}

export default class Event extends Component {
	constructor(props){
		super(props);
		this.state = {
			open: false,
			dialogHeading: "",
			dialogBody: "",
			dialogImages: []
		}
	}


	readMore(){
		console.log("read more");
		let data = this.props.data;
		this.setState({
			open: true,
			dialogHeading: data.heading,
			dialogBody: data.body
		})
		let p = [];
		if(data.photos){
			let k = Object.keys(data.photos);
			k.forEach((i) => {
				p.push(
					<img src={data.photos[i]} alt={data.heading} key={i} />
				);
			});
			this.setState({
				dialogImages: p
			});
		}
	}

	render(){
		const actions = [
	      <FlatButton
	        label="Ok"
	        primary={true}
	        onTouchTap={this.handleClose.bind(this)}/>,
	    ];
		let img = <img src={cardImage} alt={this.props.data.heading} style={imageStyle}/>
		if(this.props.data.photos){
			let k = Object.keys(this.props.data.photos)[0];
			img = <img src={this.props.data.photos[k]} alt={this.props.data.heading} style={imageStyle}/>
		}
		return (
			<div style={{width: this.props.width, display: "inline-block"}} className="at-column at-column-modify af">
				<Paper zDepth={0} >	
				   <Card >
				    <CardMedia
				      overlay={<CardTitle title={this.props.data.heading} />}
					    >
				  	{img}
				    </CardMedia>
				    <CardText style={{lineHeight: "27px", textAlign: "justify", fontSize: "16px", color: "#666", fontStyle: "italic"}}>
				      {this.props.data.body.substr(0, 150)}
				    </CardText>
				    <FlatButton label="Read More" secondary={true} onClick={()=> {
				    	this.readMore();
				    }} style={{marginBottom: "20px"}}/>
				  </Card>
			  </Paper>
				<Dialog
					title={this.state.dialogHeading}
					actions={actions}
					modal={false}
					open={this.state.open}
					onRequestClose={this.handleClose.bind(this)}
					autoScrollBodyContent={true} >
					<p style={{lineHeight: "30px", marginBottom: "10px", whiteSpace: "pre-line"}}>{this.state.dialogBody}</p>
					{this.state.dialogImages}
				</Dialog>
		  </div>
		);	
	}

	handleClose(){
		this.setState({
			open: false
		});
	}
	
}



