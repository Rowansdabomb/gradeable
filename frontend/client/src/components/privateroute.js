import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import axios from 'axios';

class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      getComplete: false
    };
  }
  componentDidMount() {
    axios
      .get('/api/authenticate')
      .then(res => {
        // console.log('user authenticated: ' + res.data.isAuthenticated);
        this.setState({isAuthenticated: res.data.isAuthenticated, getComplete: true});
      });
    // console.log(this.props);
  }
  render() {
    const {component: Component, path} = this.props;
    // console.log('state of authenticated: ' + this.state.isAuthenticated);
    if (this.state.getComplete) {
      return (
        <Route
          exact
          path={path}
          render={props => (this.state.isAuthenticated
          ? <Component {...this.props}/>
          : <Redirect to='/'/>)}/>
      )
    } else {
      return (
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>
      )
    }

  }
}

export default PrivateRoute;