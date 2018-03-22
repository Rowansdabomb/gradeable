import React, { Component } from 'react';

class ClickableButton extends Component {

  handleClick = () => {
    this.props.update();
  }
  render() {
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
      <div  className={[btnType, 'buttonblue'].join(' ')}
            onClick={this.handleClick}
            >
        <div>{type}</div>
      </div>
    );
  }
}

export default ClickableButton;