import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom'
import SignInPage from './signinpage';
import Grade from './grade';
import Basic from './basic';
import Home from './home';
import TestBuilderPage from './testbuilderpage';
import PrivateRoute from '../components/privateroute';
// import {headerHeight} from '../other/constants';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      tests: [],
      testStates: []
    };
  }

  getUser = (username) => {
    this.setState({user: username});
  }
  getTests = (newTests, newTestStates) => {
    if (this.state.tests.length !== newTests.length) {
      this.setState({tests: newTests, testStates: newTestStates});
    }
  }
  render() {
    function randomId() {
      let id = "";
      let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 20; i++) {
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
            component={() => (<Home user={this.state.user} tests={this.state.tests} getTests={this.getTests}/>)}/>
          <PrivateRoute
            exact
            path='/basic'
            component={() => (<Basic user={this.state.user}/>)}/>
          <PrivateRoute
            exact
            path='/grade'
            component={() => (<Grade user={this.state.user}/>)}/> 
          {this
            .state
            .tests
            .map((test, i) => <PrivateRoute
              key={i}
              exact
              path={'/test/' + String(i)}
              component={() => (<TestBuilderPage user={this.state.user} new={false} testId={test}/>)}/>)
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