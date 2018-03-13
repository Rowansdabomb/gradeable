import React, { Component } from 'react';
// import TestBuilder from './components/testbuilder';
import HeaderRoute from '../components/headerroute';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Home extends Component {
  componentDidMount() {
    console.log(this.props);
    axios
      .get('/api/testids')
      .then(res => {
        if (res.data.err) {
          console.log(res.data.err);
        }
        this.props.getTests(res.data.testIds, res.data.testNames);
        // this.props.getTests(res.data.testNames);
      })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.tests === nextProps.tests)
      return false;
    else
      return true;
  }

  render() {
    return (
      <div>
        <HeaderRoute user={ this.props.user } />
        <div className={ 'row' }>
          <div className={ ['col-md-4', 'offset-4'].join(' ') }>
            <div className={ ['row'].join(' ') } style={ styles.testSelector }>
              <h1 className={ ['col-12', 'text-center'].join(' ') }>Tests!</h1>
              { this.props
                  .testNames
                  .map((test, i) => <h2 style={ styles.test } className={ ['col-12', 'text-center'].join(' ') } key={ i }>
                                                                                  <Link className={ 'hoverLink' } key={ test } style={ styles.testSelector } to={ '/test/' + String(i) }>{ test }</Link>
                                                                                  </h2>) }
              <h3 className={ ['col-8', 'offset-2'].join(' ') }>
                      <Link className={ 'button' } to={ '/test/new' }>
                        Create new test
                      </Link>
                    </h3>
            </div>
          </div>
        </div>
      </div>
      );
  }
}

const styles = {
  test: {
    margin: '8px, 0'
  }
}

export default Home;