import React from 'react';
// import {radius} from '../other/constants'; import $ from 'jquery'; import
// Textarea from "react-textarea-autosize";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import {qPadding} from '../other/constants'

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      selected: 'false'
    };
  }
  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      value: event.target.value
    });
  }
  handleBlur = () => {
    this.props.update(this.props.aindex, this.state.value);
  }
  handleResize = () => {}
  componentDidMount(){
    this.setState({
      value: this.props.defaultText
    });
  }
  render() {
    var textCenter = this.props.type === 'title'
      ? 'title'
      : '';
    return (
      <div style={styles.container}>
        <textarea
          wrap='hard'
          rows='1'
          className={['textinput', textCenter].join(' ')}
          style={this.props.type === 'question'
          ? styles.question
          : styles.answer}
          type="text"
          // placeholder={this.props.defaultText}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.state.value}>
          </textarea>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: '0 5px',
    width: '100%'
  },
  answer: {
    border: '0px solid',
    backgroundColor: 'transparent',
    padding: qPadding
  },
  question: {
    border: '0px solid',
    backgroundColor: 'transparent',
    padding: '5px',
    fontSize: '1.2em'
  }
};

Input.propTypes = {
  actions: PropTypes.object,
  questionTexts: PropTypes.string,
};
function mapStateToProps(state) {
  return {
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
)(Input);