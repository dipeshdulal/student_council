// notice implementation
import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import bgrImg from '../images/bgr.jpg';
import { getThreeNotices, loadMore } from '../data/notice';
import CircularProgress from 'material-ui/CircularProgress';
import img from '../images/logo.jpg';
import Dialog from 'material-ui/Dialog';
let noticeWrapper, eventHeader, imageStyle, pStyle, headingStyle, bgrStyle;
export default class Notices extends Component{

	componentDidMount(){
		
		getThreeNotices().then((d)=>{
			this.setState({
				notices: d.val(),
				loading: false,
				
			});
			if(!d.val()){
				this.setState({
					noNotice: "There are no notices to show :("
				});
			}
		}).catch((err)=>{
			this.setState({
				noNotice: "There are no notices to show :("
			})
		});

	}

	renderNotices(){
		let keys = Object.keys(this.state.notices);
		let ret = [];
		let i = 0;
		let notices = this.state.notices;
		keys.forEach((val) => {
			let d = notices[val];
			let im = img;
			if(d.photos){
				let pk = Object.keys(d.photos)[0];
				im = d.photos[pk];
			}
			ret[i++] = (
				<Paper zDepth={3} key={val} style={{width: "300px", display: "inline-block", margin: "10px"}}>
	        		<div>
	        			<img style={imageStyle} src={im} alt={d.heading}/>
	        			<h3 style={headingStyle}>{d.heading}</h3>
	        			<p style={pStyle}>
	        				{d.body.substring(0, 150)}
	        			</p>
	        			<FlatButton label="Read More" primary={true} style={{marginBottom: "20px"}} onClick={()=>{
	        				this.readMorePress(val);
	        			}}/>
	        		</div>	
	        	</Paper>
			);
		});
		return ret;
	}

	readMorePress(val){
		let notice = this.state.notices[val];
		let images, i = 0;

		if(notice.photos){
			images = [];
			Object.keys(notice.photos).forEach((val) => {
				images[i++] = (
					<img src={notice.photos[val]} alt={notice.heading} key={val} style={{margin: "20px 0"}}/>
				);
			});
		}
		this.setState({
			dialogBody: notice.body,
			dialogHeading: notice.heading,
			dialogImages: images,
			open: true
		});
		
	}

	constructor(props){
		super(props);
		this.state = {
			noNotice : false,
			loading: true,
			notices: {},
			open: false,
			dialogHeading: "",
			dialogImages: [],
			dialogBody: "",
			val: 3,
			loadMoreLoading: false
		}
	}

	loadMore(){
		let val = this.state.val;
		val += 3;
		this.setState({
			val: val
		})
		this.setState({
			loadMoreLoading: true
		})
		loadMore(val).then((d)=>{
			this.setState({
				notices: d.val(),
				loadMoreLoading: false,
			});
			if(!d.val()){
				this.setState({
					noNotice: "There are no notices to show."
				});
			}
		}).catch((err)=>{
			console.log(err);
		});
	}

	render(){
		let body, loadMoreLoading;
		if(this.state.noNotice){
			body = (
				<h3 style={{fontWeight: 300, color: "white"}}>{this.state.noNotice}</h3>
			);
		}else if(this.state.loading){
			body = (
				<div style={{padding: "30px 0"}}>
					<CircularProgress color="white"/>
				</div>
			);
		}else{
			body = this.renderNotices();
	        // btn = <FlatButton label="Load More" secondary={true} style={{color: "white"}} onClick={this.loadMore.bind(this)}/>
		}
		// if(this.state.loadMoreLoading){
		// 	loadMoreLoading = (
		// 		<div style={{padding: "30px 0"}}>
		// 			<CircularProgress color="white"/>
		// 	    </div>);
		// }
		const actions = [
	      <FlatButton
	        label="Ok"
	        primary={true}
	        onTouchTap={this.handleClose.bind(this)}
	      />,
	    ];
		return (
			<div style={bgrStyle}>
				<Paper style={noticeWrapper} className="wrapper" zDepth={4}>
	            	<h1 style={eventHeader}>Notices</h1>
	            	{body}
	            	<br />
	            	{loadMoreLoading}
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

noticeWrapper = {
	backgroundColor: "#ba1d1d",
	padding: "50px 0",
	textAlign: "center",
	marginBottom: "-79px",
    zIndex: 3,
    position: "relative"
}
bgrStyle= {
	background: "url("+bgrImg+") fixed",
	backgroundSize: "cover"
}
eventHeader = {
	color: "white",
	fontWeight: 300,
	padding: "30px"
}

pStyle = {
	padding: "10px 20px",
	lineHeight: "30px",
	textAlign: "justify"
}

imageStyle = {
	height: "150px",
	objectFit: "cover"
}

headingStyle = {
	fontWeight: 300,
	padding: "20px",
	fontSize: "20px",
	textAlign: "left"
} 