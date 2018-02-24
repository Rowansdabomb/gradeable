import React, {Component} from 'react';
import TestBuilder from '../components/testbuilder';
import HeaderRoute from '../components/headerroute';
import axios from 'axios';
import initState from '../other/initstate';

import Loader from '../components/loader';
// import {headerHeight} from '../other/constants';

class TestBuilderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testState: null,
      saving: false,
    };
  }

  componentDidMount() {
    this.getTestState();
    console.log('testbuilderpage updated!');
  }
  preSave = () => {
    this.setState({
      saving: true
    })
  }
  postSave = () => {
    this.setState({
      saving: false
    })
  }
  getTestState = () => {
    if (!this.props.new) {
      axios
        .post('/api/teststate', {
        testId: String(this.props.testId)
      })
        .then(res => {
          this.setState({
            testState: JSON.parse(res.data.testState)
          });
        })
    } else{
      this.setState({
        testState: initState,
      })
    }
  }
  render() {
    if (this.state.testState) {
      return (
        <div>
          <HeaderRoute user={this.props.user}/>
          <TestBuilder
            // new={this.props.new}
            preSave={this.preSave}
            postSave={this.postSave}
            testState={this.state.testState}
            testId={this.props.testId}/>
          {this.state.saving && <Loader text={'saving'} show={true}/>}
        </div>
      );
    } else {
      return (
        <Loader text={'Loading'} show={true}/>
      )
    }

  }
}

export default TestBuilderPage;