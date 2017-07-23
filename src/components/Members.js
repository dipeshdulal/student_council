import React from 'react';
import Member from './Member';
import memberBackground from '../images/members.jpg';
import Paper from 'material-ui/Paper';

let styles;

const Members = (props) => {
	const { members } = props;
	const { councilMembers, blackFilter } = styles;
	let member = [];
	members.forEach((i, j) => {
		member.push(<Member member={i} key={j}/>)
	});	
	return (
		<Paper zDepth={4} >
			<div style={councilMembers}>
				<div style={blackFilter} />
				<div className="wrapper" style={{paddingTop: "30px"}}>
					<div className="container">
					  <div className="at-section">
					    <div className="at-section__title">The Team</div>
					  </div>
					  <div className="at-grid" data-column="3">
					  {member}
	                  </div>
					</div>
				</div>
			</div>
		</Paper>
	);
}

styles = {
	
	councilMembers: {
		position: "relative",
		background: "url("+ memberBackground +") fixed",
		backgroundSize: "cover"
	},
	blackFilter: {
		background: "rgba(0,0,0,0.6)",
		position: "absolute",
		width: "100%",
		height:"100%"
	},
}

export default Members;