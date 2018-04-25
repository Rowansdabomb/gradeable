import _ from 'lodash';
import { initNQ, defaultBubbleValues, defaultQuestionValue, defaultAnswers } from '../../react/other/constants';

export default {
  testTitle: 'New Test',
  pageStarts: [0],
  pageEnds: [initNQ - 1],
  bubbleValues: _
    .range(1, initNQ)
    .map(function() {
      return defaultBubbleValues
    }),
  answerValues: _
    .range(1, initNQ)
    .map(function() {
      return defaultAnswers
    }),
  questionValues: _
    .range(1, initNQ)
    .map(function() {
      return defaultQuestionValue
    }),
  questionNumbers: _.range(1, initNQ),
  selectedAnswer: _
    .range(1, initNQ)
    .map(function() {
      return 0
    }),
}