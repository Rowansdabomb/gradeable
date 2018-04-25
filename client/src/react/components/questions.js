import React, {Component} from 'react';
import _ from 'lodash';
import Question from '../components/question';
import Input from '../components/input';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../redux/actions/actions';
import PropTypes from 'prop-types';

class Questions extends Component {
  updateTestTitle = (aindex, value) => {
    console.log(value);
    console.log(this.props.testTitle);
    this.props.actions.updatetesttitle(value);
  }
  render() {
    const {
      questionValues,
      pageStarts,
      pageEnds,
      pindex
    } = this.props;

    return (
      <div>
            <div className={'pageHeight'}>
              <div  className={pindex === 0 ? 'show' : 'none'}
                    style={styles.center}>
                <Input  update={this.updateTestTitle}
                        justify={'center'} 
                        type={'title'} 
                        defaultText={this.props.testTitle}/>
              </div>
              {_.range(questionValues.slice(pageStarts[pindex], pageEnds[pindex]).length).map(i => 
                <Question
                  key={i}
                  index={i}
                  pindex={pindex}
                  qindex={pageStarts[pindex] + i}
                  noSelect={this.props.noSelect}
                  updatePage={this.props.updatePage}
                  questionValue={this.props.questionValues[pageStarts[pindex] + i]}
                  selectedAnswer={this.props.selectedAnswer}
                  />
              )}
            </div>
      </div>
    );
  }
}

const styles = {
  center: {
    display: 'flex',
    justifyContent: 'center'
  },
}
Questions.propTypes = {
  actions: PropTypes.object,
  noSelect: PropTypes.bool,
};
function mapStateToProps(state) {
  return {
    noSelect: state.noSelect,
    pageStarts: state.testState.pageStarts,
    pageEnds: state.testState.pageEnds,
    questionValues: state.testState.questionValues,
    selectedAnswer: state.testState.selectedAnswer,
    testTitle: state.testState.testTitle
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Questions);