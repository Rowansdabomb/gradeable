import React from 'react';

const AnswerKey = props => {
    return (
      <div>
        Answer Key
        <div style={styles.column}>
          {
            props.answerKey.map(function(object, i){
              if(i < 10){
                return <div key={i}>{'0' + i + '' + props.answerKey[i] + '' + props.numberOfAnswers[i]}</div>;
              }else{
                return <div key={i}>{i + '' + props.answerKey[i] + '' + props.numberOfAnswers[i]}</div>;
              }
              
            })
          }
        </div>
      </div>
    );
}

const styles = {
  column: {
    display: 'flex',
    flexDirection: 'column',
  }
}

export default AnswerKey;