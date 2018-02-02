import React, { Component } from 'react';

class ClickableButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      isHovered: true,
      clicks: 0
    };
  }
  handleHover = () =>{
    this.setState(prevState=> ({isHovered: !prevState.isHovered}));
  }
  handleClick = () => {
    this.setState(prevState => ({
      clicks: prevState.clicks + 1
    }));
    this.props.update(this.state.clicks);
  }
  render() {
    const btnClass = this.state.isHovered ? styles.unhovered: styles.hovered;
    var type;
    var btnType;
    if(this.props.value === '+'){
      type = <i className="fa fa-plus" aria-hidden="true"></i>;
      btnType = 'squareButton';
    }else if(this.props.value === '-'){
      type = <i className="fa fa-minus" aria-hidden="true"></i>;
      btnType = 'squareButton';
    }else{
      type = this.props.value;
      btnType = 'normalButton';
    };
    return (
      <div  className={[btnType, 'button'].join(' ')}
            style={btnClass}
            onClick={this.handleClick}
            onMouseEnter={this.handleHover} 
            onMouseLeave={this.handleHover}>
        <div>{type}</div>
      </div>
    );
  }
}

const styles = {
  hovered: {
    fontSize: '1.25rem',
    transition: '0.25s'
  },
  unhovered: {
    boxShadow: 'none'
  }
}

export default ClickableButton;