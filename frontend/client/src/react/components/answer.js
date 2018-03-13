import React from 'react';
import _ from 'lodash';
import Input from './input';
import Bubble from './bubble';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/actions';
import PropTypes from 'prop-types';

class Answer extends React.Component {
  getClass = (value, qindex) => {
    if (!this.props.noSelect) {
      if (this.props.selectedAnswer[qindex] === value) {
        return 'selected';
      } else {
        return 'unselected';
      }
    } else {
      return 'unselected';
    }

  }
  updateAnswerValues = (aindex, value) => {
    this.props.actions.updateanswervalues(this.props.qindex, aindex, value);
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    return true;
  }
  render() {
    const {index, pindex, qindex} = this.props;
    let answerChars = this.props.bubbleValues[this.props.pageStarts[pindex] + index];
    return (
      <div style={ styles.container }>
        { _.range(answerChars.length).map(i => <div key={ i } style={ styles.bubbleContainer }>
                                                 <div style={ styles.alignCenter } onClick={ this.props.callBack.bind(this, i) }>
                                                   <Bubble class={ this.getClass(i, qindex) } click={ false } value={ answerChars[i] } />
                                                 </div>
                                                 <Input aindex={ i } update={ this.updateAnswerValues } defaultText={ this.props.answerValues[i] } />
                                               </div>
          ) }
      </div>
      ); //return
  } //render
} //class

const styles = {
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
  },
  bubbleContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    margin: '0 -5px'
  },
  container: {
    marginLeft: '5px',
  },
};
Answer.propTypes = {
  actions: PropTypes.object,
  questionTexts: PropTypes.bool,
};
function mapStateToProps(state, ownProps) {
  return {
    noSelect: state.noSelect,
    bubbleValues: state.testState.bubbleValues,
    pageStarts: state.testState.pageStarts,
    selectedAnswer: state.testState.selectedAnswer,
    answerValues: state.testState.answerValues[ownProps.qindex]
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
)(Answer);