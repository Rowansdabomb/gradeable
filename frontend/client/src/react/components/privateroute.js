import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import Loader from './loader';

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
        this.setState({isAuthenticated: res.data.isAuthenticated, getComplete: true});
      });
  }
  render() {
    const {component: Component, path} = this.props;
    if (this.state.getComplete) {
      return (
        <Route
          // exact
          path={path}
          render={props => (this.state.isAuthenticated
          ? <Component {...this.props}/>
          : <Redirect to='/'/>)}/>
      )
    } else {
      return (
        <Loader fullScreen={true}/>
      )
    }

  }
}

export default PrivateRoute;