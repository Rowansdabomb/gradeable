import React from 'react';

const Loader = props => {
  // const showLoader = props.show ? styles.show: styles.hide;
  return (
    // <div style={showLoader}>
      <div style={styles.fullScreen}>
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>
        <h3>{props.text}</h3>
      </div>
    // </div>
  );
}

const styles = {
  fullScreen: {
    position: 'fixed',
    padding: 0,
    margin: 0,
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 10000,
  },
  show: {
    display: 'block'
  },
  hide: {
    display: 'none'
  }
}
export default Loader;