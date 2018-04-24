import React, {Component} from 'react';
import AnswerKey from './answerkey';
import ClickableButton from './clickablebutton';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../redux/actions/actions';
import PropTypes from 'prop-types';

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
    // const showToggle = this.state.isHovered
    //   ? 'showSidebar'
    //   : 'hideSideBar';
    return (
      <div className={'noPrint'} style={styles.fixedTop}>
        <div
          className={'showSideBar'}
          onMouseEnter={this.handleHover}
          onMouseLeave={this.handleHover}>
          {/* <div style={styles.icon}>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </div> */}
          <div>
            <h3>Question</h3>
            <div className={['buttons', 'spaceBetween'].join(' ')} style={styles.buttons}>
              <div className={'button'} onClick={this.addQuestion}>
                <i className="fa fa-plus" aria-hidden="true"></i>
              </div>
              <div className={'button'} onClick={this.removeQuestion}>
                <i className="fa fa-minus" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <AnswerKey
            pageStart={this.props.pageStarts}
            answerKey={this.props.selectedAnswer}
            numberOfAnswers={this.props.numberOfAnswers}/>
          <div className={'button'} onClick={this.props.handlePrint}>
            Print {this.props.copies}
          </div>
          <div className={['row', 'no-gutters'].join(' ')}>
            <div className={['button', 'col-5'].join(' ')} onClick={() => {this.props.handleCopies(true)}}>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </div>
            <div className={['button', 'col-5', 'offset-2'].join(' ')} onClick={() => {this.props.handleCopies(false)}}>
              <i className="fa fa-minus" aria-hidden="true"></i>
            </div>
          </div>
          <div className={'button'} onClick={this.props.unselect}>
            Toggle
          </div>
          <div className={'button'} onClick={this.props.saveTest}>
            Save
          </div>
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
    position: 'absolute',
    top: 0,
    left: 0
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