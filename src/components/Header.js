import React from 'react';
import AppBar from 'material-ui/AppBar';
import { blue500 } from 'material-ui/styles/colors'
import header_image from '../images/header.jpg'

import logo from '../images/logo.png';
let styles;

const Header = (props) => {
	const { jumbotron, parent, appBar, blackFilter, council, appBarAuth} = styles;
	let body = (
		<div style={parent}>
			<div style={blackFilter}></div>
			<div style={jumbotron}>

				<img src={logo} alt="Council Logo" className="header_image"/>

				<h3 style={council}>Advanced Student Council</h3>
			</div>
		</div>
	);
	if(!props.main_page){ body = null; }
	return (
		<div>
			<AppBar style={(!props.main_page) ? appBarAuth: appBar} onLeftIconButtonTouchTap={props.onMenuPress}/>
			{ body }
		</div>
	);
}
styles = {
	appBar: {
		marginBottom: "-120px",
    	background: "transparent"
	},
	appBarAuth: {
		backgroundColor: blue500,
	},
	jumbotron: {
		position: "relative",
		zIndex: "2",
		display: "inline-block",
		padding: "150px 0",
	},
	parent: {
		textAlign: "center",
		position: "relative",
		background: "url("+header_image+") fixed",
		backgroundSize: "cover"
	},
	blackFilter: {
		background: "rgba(0,0,0,0.6)",
		position: "absolute",
		width: "100%",
		height:"100%"
	},council: {
		padding: "10px",
		color: "white",
		fontSize: 40,
		fontWeight: "300"
	}
}

export default Header;