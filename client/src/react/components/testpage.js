import React, { Component } from 'react';
import _ from 'lodash';
import Questions from '../components/questions';
import QR from '../components/qr';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/actions';
import PropTypes from 'prop-types';

class TestPage extends Component {
  render() {
    return (
      <div>
        { _
            .range(this.props.pageStarts.length)
            .map(i => <div key={ i } className={ 'page' } id={'page' + String(i)} style={ styles.page }>
                        <div className={ 'fullPageHeight' }>
                          <Questions key={ i } pindex={ i } noSelect={ this.props.noSelect } updatePage={ this.props.updatePage } />
                        </div>
                        <QR updateQr={ this.props.updateQr } 
                          codevalue={ this
                          .props
                          .testId
                          .concat(',' + String(this.props.testNumber) + ',' + String(i) + ',' + String(this.props.pageStarts.length)) } />
                      </div>) }
      </div>
      );
  }
}

const styles = {
  page: {
    margin: 'auto',
    justifySelf: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  center: {
    display: 'flex',
    justifyContent: 'center'
  },
  flex: {
    display: 'flex'
  }
}
TestPage.propTypes = {
  actions: PropTypes.object,
  noSelect: PropTypes.bool,
};
function mapStateToProps(state) {
  return {
    noSelect: state.noSelect,
    pageStarts: state.testState.pageStarts,
    pageEnds: state.testState.pageEnds,
    questionValues: state.testState.questionValues
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
)(TestPage);
