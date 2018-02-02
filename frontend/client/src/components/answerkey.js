import React from 'react';

const AnswerKey = props => {
    return (
      <div>
        Answer Key
        <div style={styles.column}>
          {
              props.answerKey.map(function(object, i){
                let question = 0;
                let page = 0;
                props.pageStart.forEach(function(item){
                  if(i >= item){
                    page = props.pageStart.indexOf(item);
                  }
                });

                if(i < 10){
                  question = '00' + i;
                }else if(i < 100){
                  question = '0' + i;
                }else if(i < 1000){
                  question = i;
                }else{
                  throw new Error("Too many questions! Please keep tests under 1000 questions, think of your poor students");
                }
                return <div style={{fontFamily: "monospace"}} key={i}>{ page + ', ' + question + ', '
                 + props.answerKey[i] + ', ' + props.numberOfAnswers[i] + ';' }</div>;
  
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