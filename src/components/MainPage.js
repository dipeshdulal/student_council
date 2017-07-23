import React, { Component } from 'react';
import Feedback from './Feedback';
import { members } from '../data/members';
import { events } from '../data/events';
import RecentEvents from './RecentEvents';
import Members from './Members';
import Notices from './Notices';
import Uevents from './Uevents';
import MessageFromPresident from './PMessage';
export default class MainPage extends Component{

	render(){
		return (
			<div>
				<Uevents />
				<div style={{backgroundColor: "#05283d", marginBottom: "-60px", position: "relative"}}>
					<div className="wrapper">
		                <RecentEvents events={events}/>
		            </div>
	            </div>
	            <Notices />
	            <MessageFromPresident />
	            <Members members={members}/>
	            <Feedback />
            </div>
		);
	}

}

