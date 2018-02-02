import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Editor from './editor';
import Grade from './grade';
import {headerHeight} from '../other/constants';

const Main = () => (
  <main style={styles.adjustHeader}>
    <Switch>
      <Route exact path='/' component={Editor}/>
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