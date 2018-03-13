import React from 'react';

import {connect} from 'react-redux';

const AnswerKey = props => {
    return (
      <div>
        Answer Key
        <div style={styles.column}>
          {
              props.selectedAnswer.map(function(object, i){
                let question = 0;
                let page = 0;
                props.pageStarts.forEach(function(item){
                  if(i >= item){
                    page = props.pageStarts.indexOf(item);
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
                 + props.selectedAnswer[i] + ', ' + props.answerValues[i].length + ';' }</div>;
  
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

function mapStateToProps(state) {
  return {
    noSelect: state.noSelect,
    bubbleValues: state.testState.bubbleValues,
    pageStarts: state.testState.pageStarts,
    selectedAnswer: state.testState.selectedAnswer,
    answerValues: state.testState.answerValues
  };
}
export default connect(
  mapStateToProps,
  null
)(AnswerKey);