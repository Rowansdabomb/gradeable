import React from 'react';
import Answer from './answer';
import Input from './input';
import ClickableButton from './clickablebutton';
import { radius, qPadding } from '../other/constants';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/actions';
import PropTypes from 'prop-types';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      height: null
    };
  }
  addAnswer = () => {
    this.props.updatePage(this.props.pindex, this.props.qindex, 'addAnswer');
  }
  removeAnswer = () => {
    if (this.props.bubbleValues[this.props.qindex].length > 2) {
      this.props.updatePage(this.props.pindex, this.props.qindex, 'removeAnswer');
    }
  }
  handleSelect = (value) => {
    if (!this.props.noSelect) {
      if (this.props.selectedAnswer[this.props.qindex] !== value) {
        this.props.actions.updateselectedanswer(this.props.qindex, value);
      }
    }
  }
  hover = () => {
    this.setState({
      isHovered: true
    });
  }
  unHover = () => {
    this.setState({
      isHovered: false
    });
  }
  updateQuestionValues = (aindex, value) => {
    this.props.actions.updatequestionvalues(this.props.qindex, value);
  }
  render() {

    const showToggle = this.state.isHovered ? styles.show : styles.hide;
    const {index, pindex, qindex} = this.props;
    return (
      <div className='question' onMouseOver={ this.hover } onMouseOut={ this.unHover }>
        <div style={ styles.column }>
          <div style={ styles.question }>
            <div style={ styles.questionNumber }>
              { qindex + 1 }.</div>
            <Input type='question' onSave={ this.onSave } qindex={ qindex } update={ this.updateQuestionValues } defaultText={ this.props.questionValue } />
          </div>
          <div style={ styles.row }>
            <div style={ showToggle }>
              <div className={ 'test' }>
                <h3>Answer</h3>
                <div className={ ['row', 'no-gutters'].join(' ') } style={ styles.row }>
                  <div className={ ['col-5', 'no-gutters'].join(' ') }>
                    <ClickableButton key={ 0 } update={ this.addAnswer.bind(this) } value='+' />
                  </div>
                  <div className={ ['col-5', 'no-gutters'].join(' ') }>
                    <ClickableButton key={ 1 } update={ this.removeAnswer.bind(this) } value='-' />
                  </div>
                </div>
              </div>
            </div>
            <div style={ styles.column }>
              <Answer callBack={ this.handleSelect } index={ index } pindex={ pindex } qindex={ qindex } />
            </div>
          </div>
        </div>
      </div>

      );
  }
}

const styles = {
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  answers: {
    display: 'flex',
    flexDirection: 'column'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row'
  },
  input: {
    border: '0px solid',
    backgroundColor: 'transparent',
    height: radius,
    padding: '3px',
    fontSize: '1rem'
  },
  line: {
    height: '3px',
    width: '700px',
    backgroundColor: '#3FA5D0',
    bottom: '5px',
  },
  question: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  questionNumber: {
    position: 'relative',
    fontSize: '1.5em',
    top: qPadding
  },
  show: {
    opacity: 1,
    width: '0',
    position: 'relative',
    justifySelf: 'start',
    transition: '.25s'
  },
  hide: {
    width: '0',
    position: 'relative',
    opacity: 0,
    transition: '.25s'
  }
};
Question.propTypes = {
  actions: PropTypes.object,
};
function mapStateToProps(state) {
  return {
    bubbleValues: state.testState.bubbleValues,
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
)(Question);