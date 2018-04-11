import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../redux/actions/actions';
import PropTypes from 'prop-types';

import Loader from '../components/loader';
import TestUser from '../components/testuser';
import TestPage from '../components/testpage';
import SideBar from '../components/sidebar';
import {
  defaultAnswerHeight,
  defaultQuestionHeight,
  maxPageHeight
} from '../other/constants';

import axios from 'axios';

class TestBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false,
    };
  }
  handlePrint = () => {
    this.saveTest();
    window.print();
  }
  saveTest = () => {
    this.setState({
      updateQr: true,
      saving: true
    });
    console.log('testTitle ' + this.props.testState.testTitle);
    axios.post('/api/testsave', {
      testId: String(this.props.testId),
      testTitle: String(this.props.testState.testTitle),
      testState: JSON.stringify(this.props.testState)
    }).then((result) => {
      console.log('save success');
      this.setState({
        saving: false
      });
    });
  }
  unselect = () => {
    this.props.actions.noSelect();
  }
  updatePage = (pindex, qindex, action) => {
    let height = 0;
    let qheights = [];
    for (let i = 0; i < this.props.pageStarts.length; i++) {
      height = document.getElementsByClassName('pageHeight')[i].offsetHeight;
      if(i < this.props.pageStarts.length - 1){
        qheights.push(document.getElementsByClassName('question')[this.props.pageStarts[i+1]].offsetHeight);
      }
      console.log('page ' + i + ' height = ' + height + ' qheight = ' + qheights[pindex - 1]);
      if(i === pindex){
        console.log('page match at ' + i);
        break;
      }
    }
    let heightAdjust = 0;
    switch(action){
      case 'addAnswer':
        heightAdjust = defaultAnswerHeight;
        break;
      case 'addQuestion':
        heightAdjust = defaultQuestionHeight;
        break;
      default:
        break;
    }
    let nextHeight = height + heightAdjust;
    if(nextHeight > maxPageHeight && heightAdjust !== 0){
      console.log('page ' + pindex + 'action ' + action);
      //case that this is the last page
      if(pindex === this.props.pageStarts.length - 1){
        this.props.actions.addpage();
      }
      else {
        this.props.actions.questiontonextpage(pindex);
      }  
    }
    // if(qheights[pindex - 1] !== 'undefined' && maxPageHeight - nextHeight > qheights[pindex - 1]){
    //   this.props.actions.questiontoprevpage(pindex);
    // } 
    if(qheights[pindex] !== 'undefined' && maxPageHeight - nextHeight > qheights[pindex]){
      this.props.actions.questiontoprevpage(pindex + 1);
    }
    switch(action){
      case 'addAnswer':
        this.props.actions.addanswer(qindex);
        break;
      case 'removeAnswer':
        this.props.actions.removeanswer(qindex);
        break;
      case 'addQuestion':
        this.props.actions.addquestion();
        break;
      case 'removeQuestion':
        this.props.actions.removequestion();
        break;
      case 'addPage':
        console.log('case add page');
        this.props.actions.addpage();
        // window.scrollBy(0, -100);
        break;        
      default:
        alert('error: incorrect action in updatePage():testbuilder.js')
    }
    if(nextHeight > maxPageHeight && action === 'addAnswer'){
      this.props.actions.questiontonextpage(pindex);
    }
    //cases for removing last pages
    if(action === 'removeQuestion' || action === 'removeAnswer'){
      if(this.props.pageStarts.length > 1){
        if(this.props.pageStarts[this.props.pageStarts.length - 1] === this.props.pageEnds[this.props.pageEnds.length - 1] - 1){
          this.props.actions.removepage();
        }
      }
    }

    //find heights of all first question, determine if fit on prev page
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.pageStarts.length > 10) {
      throw new Error("Something went badly wrong!");
    }
  }
  render() {
    return (
      <div className={['row', 'no-gutter'].join(' ')}>
        <div className={['offset-lg-2', 'col-lg-8', 'offset-md-1', 'col-md-10'].join(' ')}>
          <TestPage
            updateQr={false}
            testId={this.props.testId}
            testNumber={this.props.testNumber}
            updatePage={this.updatePage}
            />
        <TestUser
          updateQr={false}
          codevalue={this
          .props
          .testId
          .concat(',' + String(this.props.testNumber))}/>
        </div>
        <div className={['col-lg-2', 'col-md-1'].join(' ')}>
          <SideBar
            handlePrint={this.handlePrint}
            unselect={this.unselect}
            saveTest={this.saveTest}
            updatePage={this.updatePage}
            />
        </div>
        {this.state.saving && <Loader text={'saving'} show={true}/>}
      </div>
    )
  }
}
TestBuilder.propTypes = {
  actions: PropTypes.object,
  noSelect: PropTypes.bool,
};
function mapStateToProps(state) {
  return {
    noSelect: state.noSelect,
    pageStarts: state.testState.pageStarts,
    pageEnds: state.testState.pageEnds,
    testTitle: state.testState.testTitle,
    testState: state.testState,
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
)(TestBuilder);
