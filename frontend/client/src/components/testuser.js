import React, { Component } from 'react';
import BubbleColumn from '../components/bubblecolumn';
import _ from 'lodash';
import QR from '../components/qr';
import { smallradius } from '../other/constants';


class TestUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            bubbles: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            firstname: 'firstnames'.split(''),
            lastname: 'lastnamesarelong'.split(''),
            
        };
    }
    render() {
      return( 
        <div className={'page'} style={styles.page}>
            <div style={styles.row}>
                <div id={'firstname'} style={styles.name}>
                    <p style={styles.namefont}>First Name </p>
                    <div style={{...styles.row, ...styles.margins}}>
                        {_.range(this.state.firstname.length).map(i =>
                            <div key={i} style={styles.column}>
                                <div style={styles.box}></div>
                                <BubbleColumn bubbles={this.state.bubbles}/>
                            </div>
                        )}
                    </div>
                </div>
                <div id={'lastname'} style={styles.name}>
                    <p style={styles.namefont}>Last Name </p>
                    <div style={{...styles.row, ...styles.margins}}>
                        {_.range(this.state.lastname.length).map(i =>
                            <div key={i} style={styles.column}>
                                <div style={styles.box}></div>
                                <BubbleColumn bubbles={this.state.bubbles}/>
                            </div>
                        )}
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
    marginBottom: '3px',
    width: smallradius + 4,
    height: smallradius + 8, 
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  name: {
    marginRight: '10px',
  },
  namefont: {
    fontSize: '2em',
    letterSpacing: '2px',
    marginTop: '0',
    marginBottom: '5px'
  },
  page: {
    margin: 'auto',
    justifySelf: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  margins: {
      marginBottom: '5px',
      marginRight: '5px'
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
    alignSelf: 'center',
  }
}

export default TestUser;