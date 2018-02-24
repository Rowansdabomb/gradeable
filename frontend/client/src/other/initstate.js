import _ from 'lodash';
import {initNQ, defaultBubbleValues, defaultQuestionValue, defaultAnswers} from './constants';

var initState = {
  // testId: makeid(20),
  pageStart: [0],
  pageEnd: [6],
  pages: [1],
  firstQuestionHeights: [],
  pageHeight: 0,
  noSelect: false,
  updateQr: false,
  mounted: false,
  saving: false,
  questionValues: _.range(1, initNQ),
  answerKey: _
    .range(1, initNQ)
    .map(function () {
      return 0
    }),
  numberOfAnswers: _
    .range(1, initNQ)
    .map(function () {
      return 3
    }),
  bubbleValues: _
    .range(1, initNQ)
    .map(function () {
      return defaultBubbleValues
    }),
  inputValueQuestion: _
    .range(1, initNQ)
    .map(function () {
      return defaultQuestionValue
    }),
  inputValueAnswers: _
    .range(1, initNQ)
    .map(function () {
      return defaultAnswers
    }),
  selectedAnswer: _
    .range(1, initNQ)
    .map(function () {
      return 0
    })
};

export default initState;