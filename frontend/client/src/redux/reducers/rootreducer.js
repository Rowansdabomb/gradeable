import {combineReducers} from 'redux';
// import addQuestionTextReducer from './addquestiontextreducer';
import noSelect from './noselectreducer';
import testState from './testreducer';
// import updatequestionvalues from './updatequestionvalues';

const rootReducer = combineReducers({
  // updatequestionvalues,
  noSelect,
  testState
});

export default rootReducer;