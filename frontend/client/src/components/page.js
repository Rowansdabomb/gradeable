import React, { Component } from 'react';
import _ from 'lodash';
import Question from '../components/question';
import Input from '../components/input';
import * as $ from 'jquery';
// import ABC from '../other/constants';
import {pageHeight} from '../other/constants';

class Page extends Component {
  updatePage = () => {
    for(let i = 0; i < this.props.pages.length; i++){
      let height = $('.pageHeight').eq(i).outerHeight();
      this.props.updatePage(i, height);
    }
  }
  //gets height of first question component
  handleFirstQuestionHeight = () => {
    for(let i = 0; i < this.props.pages.length; i++){
      var height = $('.question').eq(this.props.pageStart[i]).outerHeight();
      this.props.updateFirstQuestionHeight(i, height);
      if(height > pageHeight){
        throw new Error("Question bigger than page size! reload page and try again");
      }
    }

  }
  componentDidMount() {
    this.handleFirstQuestionHeight();
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.firstQuestionHeights === this.props.firstQuestionHeights){
      this.handleFirstQuestionHeight();
    }
    this.updatePage();
  }

  render() {
    const {
      pageEnd,
      pageStart,
      questionValues,
      bubbleValues,
      inputValueAnswers,
      inputValueQuestion,
      selectedAnswer
    } = this.props;
    return (
        <div>
        {_.range(this.props.pages.length).map(i =>
          <div key={i} className={'page'} style={styles.center} >
            <div className={'pageHeight'}>
              <div className={i === 0 ? 'show': 'none'}  style={styles.flex}>
                <div style={styles.center}>
                  <Input justify={'center'} type={'title'} defaultText={'Test Title'} />
                </div>
              </div>
              {_.range(questionValues.slice(pageStart[i], pageEnd[i]).length).map( j => 
                <Question key={j}
                          index={j}
                          pindex={i}
                          qindex={pageStart[i] + j}
                          selectedAnswer={selectedAnswer[pageStart[i] + j]}
                          bubbleValues={bubbleValues[pageStart[i] + j]}
                          inputValueQuestion={inputValueQuestion[i]}
                          inputValueAnswers={inputValueAnswers[i]}
                          pageStart={pageStart[i]}
                          questionValues={questionValues[pageStart[i] + j]} 
                          getState={this.getState}
                          noSelect={this.props.noSelect}
                          updateAnswerKey={this.props.updateAnswerKey}
                          updateNumberOfAnswers={this.props.updateNumberOfAnswers}
                          updateSelectedAnswer={this.props.updateSelectedAnswer}
                          addAnswer={this.props.addAnswer}
                          removeAnswer={this.props.removeAnswer} />
                          
              )}
            </div>
          </div>
        )}

      </div>
    );
  }
}

const styles = {
  center: {
    margin: 'auto',
    justifySelf: 'center'
  },
  flex: {
    display: 'flex'
  },
}
export default Page;
