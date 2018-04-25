import React from 'react';

const ClickableButton = () => {
  var type;
  var btnType;
  if(typeof this.props === 'undefined'){
    btnType = 'button';
  }
  else if(this.props.value === '+' || this.props.value === '-'){
    type = <i className="fa fa-plus" aria-hidden="true"></i>;
    btnType = 'squareButton';
  }
  else if(this.props.invertColor === true){
    btnType = 'buttonInverse'
  }else{
    btnType = 'button';
  };
  return (
    <div  className={[btnType, ''].join(' ')}
          onClick={this.props.update}
          >
      <div>{type}</div>
    </div>
  );
}

export default ClickableButton;