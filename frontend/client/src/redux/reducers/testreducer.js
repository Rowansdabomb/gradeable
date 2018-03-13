import initialState from './newteststate';
import ABC, { defaultBubbleValues, defaultQuestionValue, defaultAnswers } from '../../react/other/constants';
import {
        INIT_TESTSTATE,
        ADD_ANSWER, 
        REMOVE_ANSWER, 
        ADD_QUESTION, 
        REMOVE_QUESTION,
        UPDATE_SELECTED_ANSWER,
        ADD_PAGE,
        REMOVE_PAGE,
        QUESTION_TO_NEXT_PAGE,
        QUESTION_TO_PREV_PAGE,
        UPDATE_TEST_TITLE,
        UPDATE_QUESTION_VALUES,
        UPDATE_ANSWER_VALUES
        } from '../actions/actiontypes';


const testState = (state = initialState, action) => {
  let newBubbleValues = [...state.bubbleValues];
  let newAnswerValues = [...state.answerValues];
  let newSelectedAnswer = [...state.selectedAnswer];
  let newPageStarts = [...state.pageStarts];
  let newPageEnds = [...state.pageEnds];
  let newQuestionValues = [...state.questionValues];
  // console.log(state.page[0].question[0].answer[0]);
  switch (action.type) {
    case INIT_TESTSTATE:
      console.log('INIT_TESTSTATE');
      return {
        ...state = action.testState
      }
    case ADD_PAGE:
      console.log('ADD_PAGE');
      return {
        ...state,
        pageStarts: [
          ...state.pageStarts,
          state.questionNumbers.length
        ],
        pageEnds: [
          ...state.pageEnds,
          state.questionNumbers.length
        ]
      }
    case REMOVE_PAGE:
      console.log('REMOVE_PAGE');
      return {
        ...state,
        pageStarts: [
          ...state.pageStarts.slice(0, state.pageStarts.length - 1)
        ],
        pageEnds: [
          ...state.pageEnds.slice(0, state.pageEnds.length - 1)
        ]
      }
    case ADD_ANSWER:
      console.log('ADD_ANSWER');
      newBubbleValues[action.index] = state.bubbleValues[action.index].concat(ABC[state.bubbleValues[action.index].length]);
      newAnswerValues[action.index] = state.answerValues[action.index].concat('...');
      return {
        ...state,
        bubbleValues: [
          ...state.bubbleValues = newBubbleValues
        ],
        answerValues: [
          ...state.answerValues = newAnswerValues
        ]
      }
    case REMOVE_ANSWER:
      //need to add case that the last page is removed
      console.log('REMOVE_ANSWER');
      newBubbleValues[action.index] = state.bubbleValues[action.index].slice(0, state.bubbleValues[action.index].length - 1);
      newAnswerValues[action.index] = state.answerValues[action.index].slice(0, state.answerValues[action.index].length - 1);
      return {
        ...state,
        bubbleValues: [
          ...state.bubbleValues = newBubbleValues
        ],
        answerValues: [
          ...state.answerValues = newAnswerValues
        ],
        selectedAnswer: [
          ...state.selectedAnswer = newSelectedAnswer
        ]
      }
    case ADD_QUESTION: {
      console.log('ADD_QUESTION');
      newPageEnds[state.pageEnds.length - 1] = state.pageEnds[state.pageEnds.length - 1] + 1;
      return{
        ...state,
          answerValues: [
            ...state.answerValues,
            defaultAnswers
          ],
          bubbleValues: [
            ...state.bubbleValues,
            defaultBubbleValues
          ],
          selectedAnswer: [
            ...state.selectedAnswer,
            0
          ],
          questionNumbers: [
            ...state.questionNumbers,
             state.questionNumbers.length + 1
          ],
          questionValues: [
            ...state.questionValues,
            defaultQuestionValue
          ],
          pageEnds: [
            ...state.pageEnds = newPageEnds
          ]
        }
      }
    case REMOVE_QUESTION: {
      console.log('REMOVE_QUESTION');
      //condition for removing page
      newPageEnds[state.pageEnds.length - 1] = state.pageEnds[state.pageEnds.length - 1] - 1;
      return{
        ...state,
          answerValues: [
            ...state.answerValues.slice(0, state.answerValues.length - 1)
          ],
          bubbleValues: [
            ...state.bubbleValues.slice(0, state.bubbleValues.length - 1)
          ],
          selectedAnswer: [
            ...state.selectedAnswer.slice(0, state.selectedAnswer.length - 1),
          ],
          questionNumbers: [
            ...state.questionNumbers.slice(0, state.questionNumbers.length - 1),
          ],
          questionValues: [
            ...state.questionValues.slice(0, state.questionValues.length - 1),
          ],
          pageEnds: [
            ...state.pageEnds = newPageEnds
          ],
        }
      } 
    case UPDATE_SELECTED_ANSWER:
      console.log('UPDATE_SELECTED_ANSWER');
      newSelectedAnswer[action.index] = action.value;
      return {
        ...state,
        selectedAnswer: [
          ...state.selectedAnswer = newSelectedAnswer
        ]
      }
    case QUESTION_TO_NEXT_PAGE:
      console.log('QUESTION_TO_NEXT_PAGE');
      newPageStarts[action.index + 1] = state.pageStarts[action.index + 1] - 1;
      newPageEnds[action.index] = state.pageEnds[action.index] - 1;
      return {
        ...state,
        pageStarts: [
          ...state.pageStarts = newPageStarts
        ],
        pageEnds: [
          ...state.pageEnds = newPageEnds
        ]
      }
    case QUESTION_TO_PREV_PAGE:
      console.log('QUESTION_TO_PREV_PAGE');
      newPageStarts[action.index] = state.pageStarts[action.index] + 1;
      newPageEnds[action.index - 1] = state.pageEnds[action.index - 1] + 1;
      return {
        ...state,
        pageStarts: [
          ...state.pageStarts = newPageStarts
        ],
        pageEnds: [
          ...state.pageEnds = newPageEnds
        ]
      }
    case UPDATE_TEST_TITLE:
      console.log('UPDATE_TEST_TITLE');
      console.log(action.text);
      return {
        ...state,
        testTitle: action.text
      }
    case UPDATE_QUESTION_VALUES:
      console.log('UPDATE_QUESTION_VALUES')
      console.log(action.text);
      newQuestionValues[action.index] = action.text;
      return {
        ...state,
        questionValues: [
          ...state.questionValues = newQuestionValues
        ]
      }
    case UPDATE_ANSWER_VALUES:
      console.log('UPDATE_ANSWER_VALUES')
      let newAnswerValue = arrayClone(state.answerValues);
      newAnswerValue[action.qindex][action.aindex] = action.text;
      return {
        ...state,
        answerValues: [
          ...state.answerValues = newAnswerValue
        ]
      }
    default:
      return state; 
  }
}

function arrayClone( arr ) {
  var i, copy;
  if( Array.isArray( arr ) ) {
      copy = arr.slice( 0 );
      for( i = 0; i < copy.length; i++ ) {
          copy[ i ] = arrayClone( copy[ i ] );
      }
      return copy;
  } else if( typeof arr === 'object' ) {
      throw 'Cannot clone array containing an object!';
  } else {
      return arr;
  }
}

export default testState;

