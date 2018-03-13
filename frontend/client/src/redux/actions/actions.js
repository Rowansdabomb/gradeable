import * as types from './actiontypes';
export const initteststate = (testState) => {
  return { type: types.INIT_TESTSTATE, testState: testState};
}
export const updatetesttitle = (text) => {
  return {type: types.UPDATE_TEST_TITLE, text: text};
}
export const updatequestionvalues = (index, text) => {
  return {type: types.UPDATE_QUESTION_VALUES, index: index, text: text};
}
export const updateanswervalues = (qindex, aindex, text) => {
  return {type: types.UPDATE_ANSWER_VALUES, qindex: qindex, aindex: aindex, text: text};
}
export const noSelect = () => {
  return {type: types.NO_SELECT};
}
export const addanswer = (index) => {
  return {type: types.ADD_ANSWER, index: index};
}
export const removeanswer = (index) => {
  return {type: types.REMOVE_ANSWER, index: index};
}
export const addquestion = () => {
  return {type: types.ADD_QUESTION};
}
export const removequestion = () => {
  return {type: types.REMOVE_QUESTION};
}
export const updateselectedanswer = (index, value) => {
  return {type: types.UPDATE_SELECTED_ANSWER, index: index, value:value};
}
export const addpage = () => {
  return {type: types.ADD_PAGE};
}
export const removepage = () => {
  return {type: types.REMOVE_PAGE};
}
export const addpagethenquestion = () => {
  return {type: types.ADD_PAGE_THEN_QUESTION};
}
export const questiontonextpage = (index) => {
  return {type: types.QUESTION_TO_NEXT_PAGE, index:index};
}
export const questiontoprevpage = (index) => {
  return {type: types.QUESTION_TO_PREV_PAGE, index:index};
}