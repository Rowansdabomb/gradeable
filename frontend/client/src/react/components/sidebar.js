import React, {Component} from 'react';
import AnswerKey from './answerkey';
import ClickableButton from './clickablebutton';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../redux/actions/actions';
import PropTypes from 'prop-types';

import {headerHeight} from '../other/constants';

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    };
  }
  handleHover = () => {
    this.setState(prevState => ({
      isHovered: !prevState.isHovered
    }));
  }
  addQuestion = () => {
    this.props.updatePage(this.props.pageStarts.length - 1, null, 'addQuestion');
  }
  removeQuestion = () => {
    this.props.updatePage(this.props.pageStarts.length - 1, null, 'removeQuestion');
  }
  render() {
    const showToggle = this.state.isHovered
      ? 'showSidebar'
      : 'hideSideBar';
    return (
      <div className={'noPrint'} style={styles.fixedTop}>
        <div
          className={showToggle}
          onMouseEnter={this.handleHover}
          onMouseLeave={this.handleHover}>
          <div style={styles.icon}>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </div>
          <div>
            <h3>Question</h3>
            <div className={['buttons', 'spaceBetween'].join(' ')} style={styles.buttons}>
              <ClickableButton update={this.addQuestion} value='+'/>
              <ClickableButton update={this.removeQuestion} value='-'/>
            </div>
          </div>
          <AnswerKey
            pageStart={this.props.pageStarts}
            answerKey={this.props.selectedAnswer}
            numberOfAnswers={this.props.numberOfAnswers}/>
          <ClickableButton update={this.props.handlePrint} value={'Print'}/>
          <ClickableButton update={this.props.unselect} value={'Toggle'}/>
          <ClickableButton update={this.props.saveTest} value={'Save'}/>
        </div>
      </div>
    );
  }
}

const styles = {
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  fixedTop: {
    position: 'fixed',
    top: headerHeight - 25
  },
  icon: {
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    left: '105px',
    top: '40px'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row'
  }
}
SideBar.propTypes = {
  actions: PropTypes.object,
  noSelect: PropTypes.bool,
};
function mapStateToProps(state) {
  return {
    noSelect: state.noSelect,
    pageStarts: state.testState.pageStarts,
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
)(SideBar);