import React from 'react';
//import { blue500 } from 'material-ui/stlye/colors';

let footerStyles;
const Footer = (props) => {
	return (
		<div style={footerStyles}>
			<div className="wrapper">
				{/* put the button of the thing over here */}
				<p>Contact: </p>
				<div style={{textAlign: "center"}}>
					<p style={{display: "inline-block", padding: "20px"}}>studentcouncil@acem.edu.np</p>
					<p style={{display: "inline-block", padding: "20px"}}>Gaurab Thapa ( 9860206790 )</p>
					<p style={{display: "inline-block", padding: "20px"}}>Mukesh Sah ( 9844297168 )</p>
					<p style={{display: "inline-block", padding: "20px"}}>Kumar Shrestha ( 9846367767 )</p>
				</div>
				<p style={{padding: "50px 0"}}>Copyright &copy; 2017 Advanced Student Council</p>
			</div>
		</div>
	);
}



footerStyles = {
	padding: "60px 0",
	background: "#cf0000",
	textAlign: "center",
	color: "white",
	fontWeight: 300
}

export default Footer;