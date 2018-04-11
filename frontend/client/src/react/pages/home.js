import React, { Component } from 'react';
import HeaderRoute from '../components/headerroute';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Home extends Component {
  componentDidMount() {
    console.log(this.props);
    axios
      .get('/api/testdata')
      .then(res => {
        if (res.data.err) {
          console.log(res.data.err);
        }
        this.props.getTests(res.data.testIds, res.data.testTitles, res.data.testCreatedDates, res.data.testUpdatedDates);
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
          <div className={ ['col-md-6', 'col-lg-6', 'offset-md-2', 'offset-lg-3'].join(' ') }>
            <div className={ ['row'].join(' ') }>
              <h1 className={ ['col-12', 'text-center'].join(' ') }>Tests!</h1>
              { this.props
                  .testTitles
                  .map((test, i) => 
                  <div key={String(test).replace(/\s/g,'') + '_' + String(i)} className={['row', 'testRow', 'fullWidth'].join(' ')} style={{animationDelay: `${i*.1}s`}}>
                    <div className={['col-md-4', 'flex', 'alignCenter'].join(' ')}>
                      <h3 style={ styles.test }key={ i }>
                        {test}
                      </h3>
                    </div>
                    <div className={['col-md-4', 'flex', 'alignCenter'].join(' ')}>
                      <h3>{this.props.testUpdatedDates[i].slice(0, 10)}</h3>
                    </div>
                    <div className={['col-md-4'].join(' ')}>
                      <Link className={ ['button'].join(' ') } to={ '/test/' + String(test).replace(/\s/g,'') }>Edit</Link>
                    </div>
                  </div>
              )}
              <h3 className={ ['col-md-8', 'offset-md-2'].join(' ') }>
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
    margin: '.8rem, 0'
  },
  fullWidth: {
    width: '100%'
  }
}

export default Home;