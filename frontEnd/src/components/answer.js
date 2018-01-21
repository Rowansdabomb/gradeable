import React from 'react';
import _ from 'lodash';
import Input from './input';
import Bubble from './bubble'

class Answer extends React.Component{
  getClass  = (value) => {
    if(!this.props.noSelect){
      if(this.props.selectedAnswer === value){
        return 'selected';
      }
      else{
        return 'unselected';
      }
    }else{
      return 'unselected';
    }

  }
  render() {
    return (
      <div style={styles.container}>
        {_.range(this.props.bubbleValues.length).map(i =>
          <div key={i} style={styles.bubbleContainer}>
            <div style={styles.alignCenter} onClick={this.props.callBack.bind(this, i)}>
              <Bubble class={this.getClass(i)} 
                      value={this.props.bubbleValues[i]}/>
            </div>
            <Input defaultText={this.props.inputValue[i]} />
          </div>
        )}
      </div>
    );//return
  }//render
}//class

const styles = {
  alignCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  bubbleContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    margin: '0 -5px'
  },
  container: {
    marginLeft: '5px',
  },
};

  export default Answer;