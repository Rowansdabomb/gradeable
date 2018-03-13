import React, {Component} from 'react';
import TestBuilder from '../components/testbuilder';
import HeaderRoute from '../components/headerroute';
import axios from 'axios';
import initState from '../other/initstate';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../redux/actions/actions';

import Loader from '../components/loader';
import newTestState from '../../redux/reducers/newteststate';

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
          console.log(JSON.parse(res.data.testState));
          this.props.actions.initteststate(JSON.parse(res.data.testState));
          this.setState({
            testState: true
          });
        })
    } 
    else{
      this.props.actions.initteststate(newTestState);
      this.setState({
        testState: true,
      })
    }
  }
  render() {
    if (this.state.testState) {
      return (
        <div>
          <HeaderRoute user={this.props.user}/>
          <TestBuilder
            preSave={this.preSave}
            postSave={this.postSave}
            testState={this.state.testState}
            testId={this.props.testId}/>
          
        </div>
      );
    } else {
      return (
        <Loader text={'Loading'} show={true}/>
      )
    }

  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}
export default connect(
  null,
  mapDispatchToProps
)(TestBuilderPage);