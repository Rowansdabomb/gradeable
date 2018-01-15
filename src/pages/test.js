import React, { Component } from 'react';
import _ from 'lodash';
import ClickableButton from '../components/clickablebutton';
import Page from '../components/page';
import AnswerKey from '../components/answerkey';
import {pageHeight, initNQ, defaultBubbleValues, defaultQuestionValue, defaultAnswers} from '../other/constants';
import ABC from '../other/constants';

class Test extends Component {
  constructor(props){
    super(props);
    this.state = {
      pageStart: [0],
      pageEnd: [6],
      pages: [1],
      firstQuestionHeights: [],
      noSelect: false,
      questionValues: _.range(1, initNQ), 
      answerKey: _.range(1, initNQ).map(function() {return 0}),
      numberOfAnswers: _.range(1, initNQ).map(function() {return 3}),
      bubbleValues: _.range(1, initNQ).map(function(){return defaultBubbleValues}),
      inputValueQuestion: _.range(1, initNQ).map(function() {return defaultQuestionValue}),
      inputValueAnswers: _.range(1, initNQ).map(function() {return defaultAnswers}),
      selectedAnswer: _.range(1, initNQ).map(function() {return 0}),
    };
  }
  
  handlePrint = () =>{
    window.print();
  }
  unselect = () => {
    this.setState(prevState => ({
      noSelect: !prevState.noSelect
    }));
  }

  addAnswer = (index) => {
    let newBubbleValues = this.state.bubbleValues;
    newBubbleValues[index] = newBubbleValues[index].concat(ABC[newBubbleValues[index].length]);
    let newInputValueAnswers = this.state.inputValueAnswers;
    newInputValueAnswers[index] = newInputValueAnswers[index].concat('...');
    this.setState(prevState => ({
      bubbleValues: newBubbleValues,
      inputValueAnswers: newInputValueAnswers
    }));
  }
  removeAnswer = (index) => {
    let newBubbleValues = this.state.bubbleValues;
    newBubbleValues[index] = newBubbleValues[index].slice(0, (newBubbleValues[index].length - 1));
    let newInputValueAnswers = this.state.inputValueAnswers;
    newInputValueAnswers[index] = newInputValueAnswers[index].slice(0, (newInputValueAnswers[index].length - 1));
    this.setState(prevState => ({
      bubbleValues: newBubbleValues,
      inputValueAnswers: newInputValueAnswers
    }));
  }
  addQuestion = () => {
    let newPageEnd = this.state.pageEnd;
    newPageEnd[newPageEnd.length - 1] = this.state.questionValues.length + 1;
    this.setState(prevState => ({
      questionValues: prevState.questionValues.concat(prevState.questionValues.length + 1),
      answerKey: prevState.answerKey.concat(0),
      numberOfAnswers: prevState.numberOfAnswers.concat(3),
      pageEnd: newPageEnd,
      //handle inter question values
      bubbleValues: prevState.bubbleValues.concat([defaultBubbleValues]),
      inputValueQuestion: prevState.inputValueQuestion.concat([defaultQuestionValue]),
      inputValueAnswers: prevState.inputValueAnswers.concat([defaultAnswers]),
      selectedAnswer: prevState.selectedAnswer.concat(0),
    }));
  }
  removeQuestion = () => {
    let newPageEnd = this.state.pageEnd;
    newPageEnd[newPageEnd.length - 1] = newPageEnd[newPageEnd.length - 1] - 1;
    let newPageStart = this.state.pageStart;
    let newPages = this.state.pages;
    let newQuestionValues = this.state.questionValues.slice(0, (this.state.questionValues.length - 1));
    let newAnswerKey= this.state.answerKey.slice(0, (this.state.answerKey.length - 1));
    let newNumberOfAnswers = this.state.numberOfAnswers.slice(0, (this.state.numberOfAnswers.length - 1));
    let newBubbleValues = this.state.bubbleValues.slice(0, this.state.bubbleValues.length - 1);
    let newInputValueQuestion = this.state.inputValueQuestion.slice(0, this.state.inputValueQuestion.length - 1);
    let newInputValueAnswers = this.state.inputValueAnswers.slice(0, this.state.inputValueAnswers.length - 1);
    let newSelectedAnswer = this.state.selectedAnswer.slice(0, this.state.selectedAnswer.length - 1);
    //condition for removing a page
    if(newPageEnd[newPageEnd.length - 1] === newPageEnd[newPageEnd.length - 2]){
      newPageEnd.pop();
      newPageStart.pop();
      newPages.pop();
    }
    this.setState(prevState => ({
      questionValues: newQuestionValues,
      answerKey: newAnswerKey,
      numberOfAnswers: newNumberOfAnswers,
      pageEnd: newPageEnd,
      pageStart: newPageStart,
      pages: newPages,
      //handle inter question values
      bubbleValues: newBubbleValues,
      inputValueQuestion: newInputValueQuestion,
      inputValueAnswers: newInputValueAnswers,
      selectedAnswer: newSelectedAnswer,
    })); 
  }
  updateSelectedAnswer = (index, value) => {
    this.setState(prevState => ({
      selectedAnswer: Object.assign([...prevState.selectedAnswer], {[index]: value})
    }));
  }
  updateAnswerKey = (index, value) => {
    if(!this.state.noSelect){
      //console.log('update answer key with ' + index + ' ' + value);
      this.setState(prevState => ({
        answerKey: Object.assign([...prevState.answerKey], {[index]: value}),
      }));
    }
  }
  updateNumberOfAnswers = (i, value) => {
    this.setState(prevState => ({
      numberOfAnswers: Object.assign([...prevState.numberOfAnswers], {[i]: value}),
    }));
  }
  addPage = () => {
    console.log('add page');
    let newPageEnd = this.state.pageEnd;
    newPageEnd[newPageEnd.length - 1] = this.state.pageEnd[newPageEnd.length - 1] - 1;
    newPageEnd = newPageEnd.concat(this.state.questionValues.length - 1);
    let newPageStart = this.state.pageStart;
    newPageStart = newPageStart.concat(newPageEnd[newPageEnd.length - 2]);
    let newPages = this.state.pages;
    newPages = newPages.concat(true);
    this.setState({
      pages: newPages,
      pageEnd: newPageEnd,
      pageStart: newPageStart
    });
  }
  /*
  * Moves First question on current page to previous page
  */
  moveQuestionUp = (index) => {
    let newPageEnd = this.state.pageEnd;
    newPageEnd[index] = newPageEnd[index] - 1;
    let newPageStart = this.state.pageStart;
    if(newPageStart[index] !== 0){
      newPageStart[index] = newPageStart[index] - 1;
    }
    newPageStart[index + 1] = newPageStart[index + 1] - 1;
    this.setState(prevState => ({
      pageEnd: newPageEnd,
      pageStart: newPageStart,
    }));
  }
  /*
  * Moves the last question on one page to the next page
  */
  moveQuestionDown = (index) => {
    console.log('move q down');
    let newPageEnd = this.state.pageEnd;
    //increase prior page end
    newPageEnd[index - 1] = newPageEnd[index - 1] + 1;
    //decrease current page start
    let newPageStart = this.state.pageStart;
    if(newPageStart[index] !== 0){
      newPageStart[index] = newPageStart[index] - 1;
    }
    let newPages = this.state.pages;
    console.log('newPageStart[index] ' + index + ': ' + newPageStart[index]);
    if(newPageEnd[newPageEnd.length - 1] === newPageEnd[newPageEnd.length - 2]){
      newPageEnd.pop();
      newPageStart.pop();
      newPages.pop();
    }
    //newPageStart[index + 1] = newPageStart[index + 1] + 1;
    this.setState(prevState => ({
      pageEnd: newPageEnd,
      pageStart: newPageStart,
      pages: newPages,
    }));
  }
  /*
  * Handles cases for adding pages and moving questions automaticatlly 
  * between pages on resize.
  */
  updatePage = (index, height) => {
    let temp = height - pageHeight;
    console.log(temp);
    if(temp >= 0){
      if(index + 1 === this.state.pages.length){
        this.addPage();
      }
      else{
        this.moveQuestionUp(index);
      }
    }else{
      // console.log('FQH ' + this.state.firstQuestionHeights[index + 1]);
      // if(Math.abs(temp) > this.state.firstQuestionHeights[index + 1] && this.state.firstQuestionHeights[index + 1] !== 'undefined'){
      //   this.moveQuestionDown(index);
      // }
    }
  }
  updateFirstQuestionHeight = (index, height) => {
    if(this.state.firstQuestionHeights[index] === 'undefined'){
      this.setState(prevState => ({
        firstQuestionHeights: prevState.firstQuestionHeights.concat(height),
      }));
    }
    else{
      this.setState(prevState => ({
        firstQuestionHeights: Object.assign([...prevState.firstQuestionHeights], {[index]: height}),
      }));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(this.state);
    if(this.state.pages.length > 10){
      throw new Error("Something went badly wrong!");
    }
    if(this.state.pages.length !== this.state.pageEnd.length || this.state.pages.length !== this.state.pageStart.length){
      throw new Error("Error: array lengths mismatch");
    }
  }

  render() {
    const { questionValues,
            pages, 
            answerKey, 
            numberOfAnswers, 
            noSelect,
            pageStart,
            pageEnd,
            bubbleValues,
            inputValueAnswers,
            inputValueQuestion,
            selectedAnswer
            } = this.state;
    return (
      <div>  
        <Page 
              noSelect={noSelect}
              pageStart={pageStart}
              pageEnd={pageEnd}
              pages={pages}
              firstQuestionHeights={this.state.firstQuestionHeights}
              addPage={this.addPage}
              updatePage={this.updatePage}
              updateAnswerKey={this.updateAnswerKey}
              updateNumberOfAnswers={this.updateNumberOfAnswers}
              updateFirstQuestionHeight={this.updateFirstQuestionHeight}
              questionValues={questionValues} 
              bubbleValues={bubbleValues}
              inputValueAnswers={inputValueAnswers}
              inputValueQuestion={inputValueQuestion}
              selectedAnswer={selectedAnswer}
              addAnswer={this.addAnswer}
              removeAnswer={this.removeAnswer}
              updateSelectedAnswer={this.updateSelectedAnswer}/>
        
        <div className={'noPrint'} style={styles.fixedTop}>
          <div>
            <h3>Question</h3>
            <div className={['buttons', 'spaceBetween'].join(' ')} style={styles.buttons}>
              <ClickableButton update={this.addQuestion} value='+'/>
              <ClickableButton update={this.removeQuestion} value='-'/>
            </div>
          </div>
          <AnswerKey answerKey={answerKey} numberOfAnswers={numberOfAnswers}/>
          <ClickableButton update={this.handlePrint} value={'Print'} />
          <ClickableButton update={this.unselect} value={'Toggle Select'} />
        </div>
      </div>
    );
  }
}

const styles = {
  buttons: {
    display: 'flex',
    flexDirection: 'row'
  },
  center: {
    margin: 'auto',
    justifySelf: 'center'
  },
  flex: {
    display: 'flex'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  fixedTop: {
    position: 'fixed',
    top: 0
  }
}
export default Test;
