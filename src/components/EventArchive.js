// implements event archive

import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import { getAllEvents } from '../data/events_f';
import CircularProgress from 'material-ui/CircularProgress';
import { MuiDataTable } from 'mui-data-table';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

let thin;

export default class EventArchive extends Component{
	
	clicked(i, j){
		console.log(this.arrayevents[j]);
		let body = [<p>{this.arrayevents[j].body}</p>];
		if(this.arrayevents[j].photos){
			Object.keys(this.arrayevents[j].photos).forEach(k => {
				body.push(<img src={this.arrayevents[j].photos[k]} alt=""/>);
			});	
		}
		
		this.setState({
			open: true,
			heading: this.arrayevents[j].heading,
			body: body
		})
	}

	constructor(props){
		super(props);
		this.state = {
			events: {},
			loading: true,
			open: false,
			heading: "",
			body: ""
		}
		this.arrayevents = []
	}

	componentDidMount(){
		getAllEvents().then(a=>this.setState({ events: a.val(), loading: false }))
	}

	renderevents(){
		let table_cols = [{property: "heading", title: "Heading"}, {property: "body", title: "Body"}, {property: "viewmore"}]; 
		let table_data = [];
		this.arrayevents = [];
		if(!this.state.events){ return null; }
		Object.keys(this.state.events).forEach((i, j) => {
			table_data[j] = {
				heading: this.state.events[i].heading,
				body: this.state.events[i].body,
				viewmore: <FlatButton label="Read More" primary={true} onClick={() => this.clicked(i, j)}/>
			}
			this.arrayevents[j] = this.state.events[i];
		});
		const config = {
			paginated: true,
			search: 'heading',
			data: table_data,
			columns: table_cols,
			selectable: false,
			showCheckBoxes: false,
		}
		return <MuiDataTable config={config} /> 

	}

	render(){
		let body;
		let actions=[<FlatButton label="Ok" secondary={true} onTouchTap={()=> this.handleClose()} />];
		if(this.state.loading){
			body = (
				<div style={{padding: "20px", textAlign: "center"}}>
				 <CircularProgress />
				</div>
			);	
		}else{
			body = this.renderevents();
		}
		return (
			<div className="wrapper" style={{padding: "30px 0"}}>	
				<Paper zDepth={1} style={{padding: "25px 30px"}}>
					<h1 style={thin}>
						<span style={{marginRight: "20px"}}>Event Archive</span>
					</h1>
					{body}
				</Paper>
				<Dialog
					title={this.state.heading}
					actions={actions}
					modal={false}
					open={this.state.open}
					autoScrollBodyContent={true}
					onRequestClose={this.handleClose.bind(this)}>
					{this.state.body}
				</Dialog>
			</div>
		);
	}

	handleClose(){
		this.setState({open: false})
	}

}

thin = {
	fontWeight: 300,
	padding: "20px 0"
}