import React, {Component} from 'react';
import BubbleColumn from '../components/bubblecolumn';
import _ from 'lodash';
import QR from '../components/qr';
import {smallradius} from '../other/constants';

class TestUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bubbles: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ '.split(''),
      firstname: 'firstnames'.split(''),
      lastname: 'lastnamesarelong'.split('')
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.updateQr === true) 
      return true;
    else {
      return false;
    }
  }
  render() {
    return (
      <div className={'page'} style={styles.page}>
        <div style={styles.row}>
          <div id={'firstname'} style={styles.name}>
            <h1 style={styles.headermargin}>First Name</h1>
            <div
              style={{
              ...styles.row,
              ...styles.margins
            }}>
              {_
                .range(this.state.firstname.length)
                .map(i => <div key={i} style={styles.column}>
                  <div style={styles.box}></div>
                  <BubbleColumn bubbles={this.state.bubbles}/>
                </div>)}
            </div>
          </div>
          <div id={'lastname'} style={{...styles.name, ...styles.right}}>
            <h1 style={styles.headermargin}>Last Name</h1>
            <div
              style={{
              ...styles.row,
              ...styles.margins
            }}>
              {_
                .range(this.state.lastname.length)
                .map(i => <div key={i} style={styles.column}>
                  <div style={styles.box}></div>
                  <BubbleColumn bubbles={this.state.bubbles}/>
                </div>)}
            </div>
          </div>
        </div>
        <QR codevalue={this.props.codevalue}/>
      </div>
    );
  }
}

const styles = {
  box: {
    border: '1px solid black',
    alignSelf: 'center',
    marginBottom: '1.5rem',
    width: smallradius + 4,
    height: smallradius + 12
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    marginRight: '10px'
  },
  namefont: {
    fontSize: '2rem',
    letterSpacing: '.2rem',
    marginTop: '0',
    marginBottom: '.5rem'
  },
  page: {
    margin: 'auto',
    justifySelf: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  margins: {
    marginBottom: '.5rem',
  },
  center: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  qrcode: {
    position: 'relative',
    bottom: '0',
    display: 'inline-block',
    alignSelf: 'center'
  }
}

export default TestUser;