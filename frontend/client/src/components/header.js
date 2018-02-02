import React from 'react';
import {Link} from 'react-router-dom';
import {headerHeight} from '../other/constants';


const Header = props => {
  // <button style={styles.front} onClick={this.props.callApi}>Click here</button>
  // <p style={styles.test} className="App-intro">{this.props.response}</p>
  return (
      <div className={'noPrint, header'} style={styles.pageTop}>
          <div style={styles.rowBlock}></div>
          <div style={{...styles.rowBlock, ...styles.titlefont}}>HundoP</div>
          <div style={styles.rowBlock}>
            <nav style={{...styles.row, ...styles.padding}}>
                <div style={styles.navElement}><Link to='/'>Home</Link></div>
                <div style={styles.navElement}><Link to='/grade'>Grade</Link></div>
            </nav>
          </div>
      </div>
    );
}

const styles = {
  pageTop: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: '0',
    height: headerHeight,
    width: '100%',
    zIndex: '100',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlefont: {
    fontSize: '2em',
    letterSpacing: '2px',
    alignSelf: 'center'
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
  }
}

export default Header;