import React from 'react';

const Table = props => {
  console.log(props);
  
  return(
      <div className={'row'}>
        <div className={['col-md-6', 'offset-3'].join(' ')}>
          <h1>{props.title}</h1>
            {(props.data).map((prop, index) =>
              <div className={'row'} key={index}>
                <div className={['col-md-4', 'col-sm-4'].join(' ')} >
                  {prop[0]}
                </div>
                {props.data.length > 1 && 
                  <div className={['col-md-4', 'col-sm-4'].join(' ')} >
                    {prop[1]}
                  </div>
                }
                {props.data.length  > 2 && 
                  <div className={['col-md-4', 'col-sm-4'].join(' ')} >
                    {prop[2]}
                  </div>
                }
                {props.data.length  > 3 && 
                  <div className={['col-md-4', 'col-sm-4'].join(' ')} >
                    {prop[3]}
                  </div>
                }
                {props.button &&
                  <div onClick={props.update(props.index)} className={['col-md-4', 'col-sm-4', 'button'].join(' ')} >
                    {props.buttonText}
                  </div>
                }
              </div>
            )}
          </div>
        </div>
    );
  }

  export default Table;
