import initialState from './init_all_tests';

import {
  GET_TESTS,
  DELETE_TEST
} from '../actions/actiontypes';

const allTests = (state = initialState, action) => {
  switch (action.type) {
    case GET_TESTS:
      console.log('INIT_TESTSTATE');
      return {
        ...state = action.initTests
      }
    case DELETE_TEST:
      console.log('DELETE_TEST');
      return {
        ...state,
          testTitles: [
            ...state.testTitles.slice(0, action.index),
            ...state.testTitles.slice(action.index + 1)
          ],
          testIds: [
            ...state.testIds.slice(0, action.index),
            ...state.testIds.slice(action.index + 1)
          ],
          testCreatedDates: [
            ...state.testCreatedDates.slice(0, action.index),
            ...state.testCreatedDates.slice(action.index + 1)
          ],
          testUpdatedDates: [
            ...state.testUpdatedDates.slice(0, action.index),
            ...state.testUpdatedDates.slice(action.index + 1)
          ],
      }
    default:
      return state;
  }
}

export default allTests
      