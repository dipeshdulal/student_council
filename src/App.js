import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './components/Header';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Footer from './components/Footer';
import logo from './images/logo.jpg';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import Notifications from 'react-notify-toast';
import Dashboard from './components/Dashboard';
import AdminFeedback from './components/AdminFeedback';
import AdminEvents from './components/AdminEvents';
import User from './components/User';
import app from './firebaseConfig';
import {adminUID, noteAdderUID} from './adminUID';
import EventArchive from './components/EventArchive';
import NoticeArchive from './components/NoticeArchive';
import UpcommingEvts from './components/UpcommingEvts';
import Notes from './components/Notes';
import NoteArchive from './components/NoteArchive';
let logoStyle;

// add event archives and notice archives. Paginated list of data.

class App extends Component {

  authenticated(){
    if(app.auth().currentUser){
        this.setState({
          isAuthenticated: true
        });
        if(!this.state.loginUnmount){
          this.navigateTo("dashboard");
        }  
    }
  }

  constructor(props){
    super(props);
    
    this.navigator = {
      "main_page" : <MainPage />,
      "login_page" : <LoginPage authenticatedCallback={this.authenticated.bind(this)} 
                                componentUnmountedCallback={()=>{this.setState({loginUnmount: true}) }}/>,
      "dashboard": <Dashboard />,
      "feedback": <AdminFeedback />,
      "user": <User />,
      "admin_events": <AdminEvents />,
      "event_archive": <EventArchive />,
      "notice_archive": <NoticeArchive />,
      "admin_uevents": <UpcommingEvts />,
      "notes": <Notes />,
      "note_archive": <NoteArchive />
    };

    this.state = {
      open: false,
      isAuthenticated: false,
      navigation: [{screen: "main_page"}]
    }
  }

  navigateTo(screen){
    var navigation = this.state.navigation;
    navigation.push( {screen} );
    this.setState((prevState) => {
      prevState.navigation = navigation;
      return prevState;
    });
  }

  logout(){
    app.auth().signOut().then(() => {
      this.navigateTo("main_page");
    }).catch((error) => {
      console.log("Couldn't logout");
    });
  }

  getComponentFromNavigation(){
    var navigation = this.state.navigation;
    let screen = navigation[navigation.length - 1].screen;
    return this.navigator[screen];
  }

  isMainPage(){
    var navigation = this.state.navigation;
    return (navigation[navigation.length - 1].screen === "main_page");
  }

  render() {
    let user = app.auth().currentUser;
    let item = (user) ? "Dashboard" : "Login";
    let items = [];
    if(user){
      items = [
        <MenuItem onClick={() => { this.navigateTo("admin_events"); this.setState({open: false}); }} key="events"> Events </MenuItem>,
        <MenuItem onClick={() => { this.navigateTo("feedback"); this.setState({open: false}); }} key="feedback"> Feedbacks </MenuItem>,
        <MenuItem onClick={() => { this.navigateTo("admin_uevents"); this.setState({open: false})}} key="admin_uevents">Upcomming Events </MenuItem>,
        <MenuItem onClick={()=>{ this.logout(); this.setState({open: false}) }} key="logout">Log Out</MenuItem>
      
      ];
      if(user.uid === noteAdderUID){
        items.push( <MenuItem onClick={() => {this.navigateTo("notes"); this.setState({open: false})}} key="notes">Add Notes </MenuItem>);
      }
      if(user.uid === adminUID){
        items.push( <MenuItem onClick={() => {this.navigateTo("user"); this.setState({open: false})}} key="user"> Users </MenuItem> );
      }

    }
    let heading = null;
    if(user){
      heading = <h3 style={{padding: "10px", fontWeight: 300, fontSize: "15px"}}>{user.email}</h3>;
    }
    return (
      <div className="App">
         <MuiThemeProvider>
            <div>
              <Notifications />
              <Drawer 
                open={this.state.open} 
                docked={false}
                onRequestChange={(open) => this.setState({open})}
                >
                <img src={logo} alt="Advanced Student Council" style={logoStyle}/> 
                {heading}
                <MenuItem onClick={() => {
                  this.navigateTo("main_page");
                  this.setState({open: false});
                }}>Home</MenuItem>
                <MenuItem onClick={ () => {
                  this.navigateTo("event_archive");
                  this.setState({open: false});
                }}>Events Archive</MenuItem>
                <MenuItem onClick={()=>{
                  this.navigateTo("notice_archive");
                  this.setState({open: false});
                }}>Notice Archive</MenuItem>
                <MenuItem onClick={() => { 
                  this.navigateTo("note_archive"); 
                  this.setState({open: false})}} 
                  key="note_archive"
                >Note Archive</MenuItem>

                <MenuItem onClick={()=>{ 
                  if(app.auth().currentUser){
                    this.navigateTo("dashboard");
                    this.setState({open: false});
                    return;
                  }
                  this.navigateTo("login_page");
                  this.setState({open: false});
                }}>{item}</MenuItem>
                {items}

              </Drawer>
              <Header onMenuPress={() => this.setState({open: true})} main_page={this.isMainPage()}/>
              {this.getComponentFromNavigation()}
              <Footer />
            </div>
         </MuiThemeProvider>       
      </div>
    );
  }
}

logoStyle = {
  width: "100%",
  marginTop: "10px",
  marginBottom: "10px" 
}

export default App;
