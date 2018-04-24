import {combineReducers} from 'redux';
// import addQuestionTextReducer from './addquestiontextreducer';
import noSelect from './noselectreducer';
import testState from './testreducer';
import allTests from './alltests';
// import updatequestionvalues from './updatequestionvalues';

const rootReducer = combineReducers({
  // updatequestionvalues,
  noSelect,
  testState,
  allTests
});

export default rootReducer;