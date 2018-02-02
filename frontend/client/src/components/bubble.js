import React, { Component } from 'react';
import {radius} from '../other/constants';

class Bubble extends Component {
	constructor(props){
    super(props);
    this.state = {
      isHovered: false,
      selected: false
    };
  }
  handleHover = () =>{
    this.setState(prevState=> ({isHovered: !prevState.isHovered}));
  }
  render() {
    const showToggle = this.state.isHovered ? styles.hovered: styles.unhovered;
    return (
        <div  style={showToggle}
              className={this.props.class}
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
    border: '3px solid black',
    borderRadius: radius,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '20px',
    width: radius,
    height: radius,
    fontSize: '.9rem',
    cursor: 'pointer'
  },
  hovered: {
    backgroundColor: 'transparent',
    color: '#555',
    border: '3px solid #009900',
    borderRadius: radius,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '20px',
    width: radius,
    height: radius,
    fontSize: '.9rem',
    cursor: 'pointer'
  }
};

export default Bubble;