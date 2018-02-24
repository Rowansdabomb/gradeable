import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { headerHeight } from '../other/constants';
import axios from 'axios';

class Header extends Component {
  // <button style={styles.front} onClick={this.props.callApi}>Click here</button>
  // <p style={styles.test} className="App-intro">{this.props.response}</p>
  handleLogout = () => {
    axios.post('/api/logout', {})
      .then((result) => {
        if (typeof (result.data) === 'object') {
          console.log(result.data);
          this.props.goToUrl(result.data.url);
        } else {
          alert('unkown error');
          console.log(result.data);
        }
      });
  }
  render() {
    return (
      <div className={ 'noPrint' }>
        <div className={ ['row', 'no-gutters', 'align-items-center'].join(' ') } style={ styles.header }>
          <div className={ ['col-md-4', 'align-content-center'].join(' ') }></div>
          <div className={ ['col-md-4', 'text-center', 'align-se-center'].join(' ') }>
            <div className={'col-12'}></div>
            <div className={ ['col-12', 'text-center'].join(' ') } style={ styles.title }>
              HundoP
            </div>
            <div className={'col-12'}>
              <nav className={ 'row' }>
                <div className={ [ 'col-md-4'].join(' ') }>
                  <Link to='/home'>Home</Link>
                </div>
                <div className={ 'col-md-4' }>
                  <Link to='/basic'>Basic</Link>
                </div>
                <div className={ 'col-md-4' }>
                  <Link to='/grade'>Grade</Link>
                </div>
              </nav>
            </div>
          </div>
          <div className={ ['col-md-2', 'offset-2'].join(' ') }>
            <div className={['row', 'align-items-center'].join(' ')}>
              <div className={'col-md-12'}>
                Logged In as: <div style={styles.username}>{ this.props.user }</div>
              </div>
              <div className={ ['col-md-6'].join(' ')}>
                <div className={'buttonblue'} onClick={ this.handleLogout }>
                  logout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
  }

}

const styles = {
  header: {
    position: 'fixed',
    top: '0',
    height: headerHeight,
    width: '100%',
    zIndex: '100',
    color: '#3FA5D0',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: '2em',
    letterSpacing: '2px',
    alignSelf: 'center',
    position: 'relative',
    top: '-8px',
  },
  padding: {
    padding: '5px',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  rowBlock: {
    display: 'flex',
    height: '33.33%'
  },
  navElement: {
    margin: '0 15px',
    textDecoration: 'none',
  },
  username: {
    fontSize: '1.2em',
    display: 'inline-block',
  }
}

export default Header;