import React from 'react';

import {headerHeight, primaryColor, secondaryColor} from '../other/constants';

const Header = props => {
    return (
      <div className={'noPrint, header'} style={styles.pageTop}>
        <div>Header</div>
      </div>
    );
}

const styles = {
  pageTop: {
    display: 'flex',
    flexDirection: 'row',
    position: 'fixed',
    top: '0',
    height: headerHeight,
    width: '100%',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default Header;