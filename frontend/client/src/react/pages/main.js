import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom'
import SignInPage from './signinpage';
import Grade from './grade';
import AnalyzePage from './analyzepage';
import Analyze from './analyze';
import Home from './home';
import TestBuilderPage from './testbuilderpage';
import PrivateRoute from '../components/privateroute';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/actions';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      testIds: [],
      testTitles: [],
      testThumbImages: [],
      testCreatedDates: [],
      testUpdatedDates: []
    };
  }
  getUser = (username) => {
    this.setState({user: username});
  }
  getTests = (data) => {
    if (this.state.testIds.length !== data.testIds.length) {
      this.setState({
        testIds: data.testIds, 
        testTitles: data.testTitles, 
        testThumbImages: data.testThumbImages,
        testCreatedDates: data.testCreatedDates,
        testUpdatedDates: data.testUpdatedDates
      });
    }
  }
  updateTests = (index) => {
    let tempTestIds = this.state.tempTestIds;

    this.setState
  }
  
  render() {
    function randomId() {
      let id = "";
      let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 10; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return id;
    }
    return (
      // testIds={this.state.testIds} testTitles={this.state.testTitles} testUpdatedDates={this.state.testUpdatedDates}
      <main className={'adjustHeaderHeight'}>
        <Switch>
          <Route exact path='/' component={() => (<SignInPage getUser={this.getUser}/>)}/>
          <PrivateRoute
            path='/home'
            component={() => (<Home user={this.state.user} getTests={this.getTests} 
              testThumbImages={this.state.testThumbImages}/>)}/>
          <PrivateRoute
            exact
            path='/analyze'
            component={() => (<AnalyzePage user={this.state.user} testTitles={this.state.testTitles}/>)}/>
          <PrivateRoute
            exact
            path='/grade'
            component={() => (<Grade user={this.state.user}/>)}/> 
          {this
            .state
            .testTitles
            .map((test, i) => <PrivateRoute
              key={i}
              exact
              path={'/test/analyze/' + String(test).replace(/\s/g,'')}
              component={() => (<Analyze user={this.state.user} testId={this.state.testIds[i]}/>)}/>)
          }
          {this
            .state
            .testTitles
            .map((test, i) => <PrivateRoute
              key={i}
              exact
              path={'/test/' + String(test).replace(/\s/g,'')}
              component={() => (<TestBuilderPage user={this.state.user} new={false} testId={this.state.testIds[i]}/>)}/>)
          }
          <PrivateRoute
            exact
            path={'/test/new'}
            component={() => (<TestBuilderPage user={this.state.user} new={true} testId={randomId()}/>)}/>

        </Switch>
      </main>
    );
  }
}


export default Main
// function mapStateToProps(state) {
//   return {
//     testTitles: state.allTests.testTitles,
//     testIds: state.allTests.testIds,
//     testCreatedDates: state.allTests.testCreatedDates,
//     testUpdatedDates: state.allTests.testUpdatedDates
//   };
// }
// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(actions, dispatch)
//   };
// }
// export default connect(
//   null,
//   mapDispatchToProps
// )(Main);