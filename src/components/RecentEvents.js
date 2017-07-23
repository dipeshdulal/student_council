import React, { Component }from 'react';
import Event from './Event';
import { getThreeEvents } from '../data/events_f';
import CircularProgress from 'material-ui/CircularProgress';

let styles, events;


export default class RecentEvents extends Component{
	constructor(props){
		super(props);
		this.state = {
			loading: true,
			empty: true, 
			events: {}
		}
	}
	
	componentDidMount(){
		this.getEvents();
	}

	getEvents(){
		getThreeEvents().then((d) => {
			events = d.val();
			if(events){
				this.setState({
					loading: false,
					empty: false,
					events
				});
			}else{
				this.setState({
					empty: true,
					loading: false
				});
			}
		}).catch((e) => {
			console.log(e);
		});
	}

	renderEvents(){
		let ret = [];
		if(this.state.events){
			let keys = Object.keys(events), i = 0;
			keys.forEach((a) => {
				ret[i++] = (
					<Event event={a} width={styles.eventStyle.width} key={a} data={this.state.events[a]}/>
				);
			})
		}
		return ret;
	}

	render(){
		const { container, heading } = styles;
		let evts = (
			<div>
				<CircularProgress/>
			</div>
		);
		if(!this.state.loading){
			if(this.state.empty){
				evts = <h3 style={{fontWeight: 300, color: "white"}}>There are no events in database. :D</h3>
			}else{
				evts = this.renderEvents();
			}
		}
		// events.forEach((i, j) => {
		// 	evts.push(<Event event={i} width={eventStyle.width} key={j} data=""/>)
		// });	
		return (
			<div style={{padding: "50px 0 100px 0", position: "relative"}}>
				<h2 style={heading}>Recent Events</h2>
				<div style={container} className="events">
					{evts}
				</div>
			</div>
		);	
	}
	
}

styles = {
	eventStyle: {
		width: "300px"
	},
	container: {
		textAlign: "center",
	    display: "flex",
	    justifyContent: "space-around",
	},
	heading: {
		color: "white",
		textAlign: "center",
		fontWeight: 300,
		fontSize: 30,
		padding: "60px 25px"
	}
}

