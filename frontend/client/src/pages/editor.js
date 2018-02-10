import React, { Component } from 'react';
import _ from 'lodash';

import TestPage from '../components/testpage';
import SideBar from '../components/sidebar';
import * as $ from 'jquery';
import {pageHeight, 
        initNQ,
        defaultBubbleValues, 
        defaultQuestionValue, 
        defaultAnswers,
        defaultQuestionHeight} from '../other/constants';
import ABC from '../other/constants';

class Editor extends Component {
  constructor(props){
    super(props);
    this.state = {
      pageStart: [0],
      pageEnd: [6],
      pages: [1],
      firstQuestionHeights: [],
      pageHeight: 0,
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

  handlePrint = () => {
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
    let n = this.state.inputValueAnswers[index];
    this.setState(prevState => ({
      bubbleValues: newBubbleValues,
      inputValueAnswers: newInputValueAnswers,
      numberOfAnswers: Object.assign([...prevState.numberOfAnswers], {[index]: n.length}) 
    }));
  }
  removeAnswer = (index) => {
    let newBubbleValues = this.state.bubbleValues;
    newBubbleValues[index] = newBubbleValues[index].slice(0, (newBubbleValues[index].length - 1));
    let newInputValueAnswers = this.state.inputValueAnswers;
    newInputValueAnswers[index] = newInputValueAnswers[index].slice(0, (newInputValueAnswers[index].length - 1));
    let n = this.state.inputValueAnswers[index];
    this.setState(prevState => ({
      bubbleValues: newBubbleValues,
      inputValueAnswers: newInputValueAnswers,
      numberOfAnswers: Object.assign([...prevState.numberOfAnswers], {[index]: n.length})
    }));
  }
  addQuestion = () => {
    let height = $('.pageHeight').last().outerHeight();
    if(height + defaultQuestionHeight > pageHeight){
      this.updatePage(this.state.pages.length - 1, this.state.pageHeight + defaultQuestionHeight);
    }
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
    console.log('update answerkey');
    if(!this.state.noSelect){
      //console.log('update answer key with ' + index + ' ' + value);
      this.setState(prevState => ({
        answerKey: Object.assign([...prevState.answerKey], {[index]: value}),
      }));
    }
  }
  updateNumberOfAnswers = (i, value) => {
    console.log('update number of answers');
    let n = this.state.inputValueAnswers[i];
    this.setState(prevState => ({
      numberOfAnswers: Object.assign([...prevState.numberOfAnswers], {[i]: n.length}),
    }));
  }
  addPage = () => {
    console.log('page add pending');
    let newPageEnd = this.state.pageEnd;
    newPageEnd[newPageEnd.length - 1] = this.state.pageEnd[newPageEnd.length - 1] - 1;
    newPageEnd = newPageEnd.concat(this.state.questionValues.length);
    let newPageStart = this.state.pageStart;
    newPageStart = newPageStart.concat(newPageEnd[newPageEnd.length - 2]);
    let newPages = this.state.pages;
    newPages = newPages.concat(newPages[newPages.length - 1] + 1);
    this.setState({
      pages: newPages,
      pageEnd: newPageEnd,
      pageStart: newPageStart
    }, function () {
      console.log('page add complete');
    });
  }
  /*
  * Moves First question on current page to previous page
  */
  moveQuestionUp = (index) => {
    console.log('move question up pending');
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
    }), function () {
      console.log('move question up complete');
    });
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
    }), function () {
      console.log('move question down');
    });
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
  testpost = () => {
    console.log('click');
    var cars = [
      { "make":"Porsche", "model":"911S" },
      { "make":"Mercedes-Benz", "model":"220SE" },
      { "make":"Jaguar","model": "Mark VII" }
    ];
    $.post("/postmethod", cars, function(result, status){
      $("#result").text(result);
      alert(status);
    });
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
        <TestPage noSelect={noSelect}
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
        <SideBar  addQuestion={this.addQuestion}
                  removeQuestion={this.removeQuestion}
                  handlePrint={this.handlePrint}
                  unselect={this.unselect}
                  pageStart={pageStart}
                  answerKey={answerKey}
                  numberOfAnswers={numberOfAnswers}/>
      </div>
    );
  }
}
export default Editor;
