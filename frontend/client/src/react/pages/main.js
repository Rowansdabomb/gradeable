import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom'
import SignInPage from './signinpage';
import Grade from './grade';
import AnalyzePage from './analyzepage';
import Analyze from './analyze';
import Home from './home';
import TestBuilderPage from './testbuilderpage';
import PrivateRoute from '../components/privateroute';
// import {headerHeight} from '../other/constants';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      testIds: [],
      testTitles: [],
      testCreatedDates: [],
      testUpdatedDates: []
    };
  }

  getUser = (username) => {
    this.setState({user: username});
  }
  getTests = (newTestIds, newtestTitles, newTestCreatedDates, newTestUpdatedDates) => {
    if (this.state.testIds.length !== newTestIds.length) {
      this.setState({
        testIds: newTestIds, 
        testTitles: newtestTitles, 
        testCreatedDates: newTestCreatedDates,
        testUpdatedDates: newTestUpdatedDates
      });
    }
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
      <main className={'adjustHeaderHeight'}>
        <Switch>
          <Route exact path='/' component={() => (<SignInPage getUser={this.getUser}/>)}/>
          <PrivateRoute
            path='/home'
            component={() => (<Home user={this.state.user} testIds={this.state.testIds} testTitles={this.state.testTitles} testUpdatedDates={this.state.testUpdatedDates} getTests={this.getTests}/>)}/>
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

export default Main;