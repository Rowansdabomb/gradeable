import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Editor from './editor';
import Grade from './grade';
import Basic from './basic';
import {headerHeight} from '../other/constants';

const Main = () => (
  <main className={'adjustHeaderHeight'}>
    <Switch>
      <Route exact path='/' component={Editor}/>
      <Route exact path='/basic' component={Basic}/>
      <Route exact path='/grade' component={Grade}/>
    </Switch>
  </main>
)

const styles = {
  adjustHeader: {
    position: 'relative',
    top: headerHeight
  }
}

export default Main;