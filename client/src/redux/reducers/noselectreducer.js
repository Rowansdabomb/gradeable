import initialState from './initialstate';
import {NO_SELECT} from '../actions/actiontypes';

const noSelect = (state = initialState.noSelect, action) => {
  let newState = state;
  switch (action.type) {
    case NO_SELECT:
      console.log('NO_SELECT')
      // newState = !newState;
      return !newState;
    default:
      return state;
  }
}

export default noSelect;