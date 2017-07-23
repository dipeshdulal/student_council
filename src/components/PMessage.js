// message from president component
import React from 'react';
import Paper from 'material-ui/Paper';
import bgr from '../images/member/president.jpg';

let back_style, presidentImage;

const MessageFromPresident = () => {
	return (
		<div style={back_style}>
			<h1 className="wrapper" style={{fontWeight: 300, textAlign: "center", padding: "50px 0"}}>Message From President</h1>
			<div className="wrapper screen_fix" style={{display: "flex", justifyContent: "space-around"}}>
				<div style={{width: "350px", fontWeight: 300}} className="abc">
					<h3 style={{fontWeight: 300, lineHeight: "30px", textAlign: "justify"}}>
						Thanks to those who voted for me, ones who believed in me and
						had faith in me. I will never let you guys down. And those who 
						didn't vote for me, I will work harder everyday and touch your heart.
					</h3>
					<h3 style={{fontWeight: 300, lineHeight: "30px"}}>
						Help me, guide me to make ACEM better than ever before
					</h3>
					<h3 style={{fontWeight: 300, lineHeight: "30px"}}>
						Thank You
					</h3>
				</div>
				<Paper zDepth={3} style={presidentImage} className="abc">
					<img src={bgr} alt="president" style={presidentImage}/>
				</Paper>
			</div>
		</div>
	);
}

back_style = {
	padding: "100px 0",
	position: "relative",
	background: "white"
}

presidentImage = {
	width: "300px",
	height: "300px",
	objectFit: "cover",
	overflow: "hidden",
	borderRadius: "50%"
}

export default MessageFromPresident;