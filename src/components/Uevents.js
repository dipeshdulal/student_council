// upcomming events display
import React, { Component } from 'react';
import { getAllEvents } from '../data/upcomming_evts';
import CircularProgress from 'material-ui/CircularProgress';
import {Timeline, TimelineEvent} from 'react-event-timeline';
import FlatButton from 'material-ui/FlatButton';

export default class Uevents extends Component{
	
	constructor(props){
		super(props);
		this.state = {
			loading: true,
			events: {},
			no: false,
		}
	}

	componentDidMount(){
		getAllEvents().then(a => {
			let v = a.val();
			if(!v){
				this.setState({no: true})
			}else{
				this.setState({
					loading: false,
					events: a.val()
				});	
			}
		}).catch(e => {
			console.log(e)
		})
	}

	renderTimeline(){
		let val = [];
		if(this.state.events){
			Object.keys(this.state.events).forEach( i =>{
				let currDate = new Date(Date.now());
				let hap_date = new Date(this.state.events[i].happen_date);
				if(currDate - hap_date < 0){
					console.log(this.state.events[i]);
					val.push(<TimelineEvent 
								title={<FlatButton label={this.state.events[i].name} onClick={()=>{window.location.href=this.state.events[i].link}}/>}
								createdAt={hap_date.toLocaleDateString()}/>)
				}
			});
		}
		return (
			<Timeline>
				{val}
			</Timeline>	
		);
	}

	render(){
		let body = this.renderTimeline();
		if(this.state.loading){
			body = (
				<div style={{padding: "20px", textAlign: "center"}}>
				 <CircularProgress />
				</div>
			);	
		}
		if(this.state.no){
			body = (
				<div style={{padding: "20px", textAlign: "center"}}>
				 <p>There are no upcomming events.</p>
				</div>
			);
		}
		return <div className="wrapper" style={{padding: "20px 15px"}}>

			<h1 style={{fontWeight: 300, padding: "30px 0"}}>Upcomming Events</h1>
			{body}


		</div>;
	}


}