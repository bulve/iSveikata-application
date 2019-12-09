import React, { Component } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import 'react-dates/initialize';
//import 'react-dates/lib/css/_datepicker.css';

import RouteComponent from './Component/Navigation/RouterComponent';

import {connect} from 'react-redux';





class App extends Component {

  
  render() {
    return (
      <div>
        <RouteComponent />
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    user:state.user
  }
}


export default connect(mapStateToProps)(App);
