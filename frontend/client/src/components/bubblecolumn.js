import React, { Component } from 'react';
import Bubble from '../components/bubble';
import _ from 'lodash';

const BubbleColumn = props => {

    return( 
      <div style={{...styles.column, ...styles.margins}}>
          {_.range(props.bubbles.length).map(i =>
              <div key={i} style={styles.bubble}>
                <Bubble click={true} bubbleSize={'small'} value={props.bubbles[i]}/>
              </div>
          )}
      </div>
    );
  }
  

const styles = {
  bubble:{
    margin: '1px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 2px'
  },
  margins: {
      marginBottom: '5px',
  }
}

export default BubbleColumn;