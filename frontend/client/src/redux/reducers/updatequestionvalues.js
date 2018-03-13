import initialState from './initialteststate';
import {UPDATE_QUESTION_VALUES} from '../actions/actiontypes';

const updatequestionvalues = (state = initialState.questionValues, action) => {
  let newState = [...state];
  switch (action.type) {
    case UPDATE_QUESTION_VALUES:
      console.log('UPDATE_QUESTION_VALUES')
      newState[action.qindex][action.aindex] = action.text;
      return newState;
    default:
      return state;
  }
}

export default updatequestionvalues;