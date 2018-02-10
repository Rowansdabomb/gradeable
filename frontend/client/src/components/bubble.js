import React, { Component } from 'react';
import {medradius, smallradius} from '../other/constants';

class Bubble extends Component {
	constructor(props){
    super(props);
    this.state = {
      isHovered: false,
      isClicked: false,
      selected: false
    };
  }
  handleHover = () =>{
    this.setState(prevState=> ({isHovered: !prevState.isHovered}));
  }
  handleClick = () => {
    if(this.props.click===true){
      this.setState(prevState => ({isClicked: !prevState.isClicked}));
    }
  }

  render() {
    const showToggle = this.state.isHovered ? styles.hovered: styles.unhovered;
    var selectToggle;
    if(this.props.click === true){
      selectToggle = this.state.isClicked ? 'selected': 'unselected';
    }
    var bubbleSize;

    if(String(this.props.bubbleSize) === 'small'){
      bubbleSize = {
        fontSize: '.7em',
        width: smallradius,
        height: smallradius,
        borderRadius: smallradius,
      }
    }else{
      bubbleSize = {
        fontSize: '.9em',
        width: medradius,
        height: medradius,
        borderRadius: medradius,
      }
    }
 
    return (
        <div  style={{ ...bubbleSize,...showToggle}}
              className={[this.props.class, selectToggle].join(' ')}
              onClick={this.handleClick}
              onMouseEnter={this.handleHover} 
              onMouseLeave={this.handleHover}>
          {this.props.value}
        </div>
      
    );
  }
}

const styles = {
  unhovered: {
    backgroundColor: 'transparent',
    border: '2px solid black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  hovered: {
    backgroundColor: 'transparent',
    color: '#555',
    border: '2px solid #009900',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  }
};

export default Bubble;