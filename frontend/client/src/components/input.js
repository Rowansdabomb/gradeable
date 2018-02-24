import React from 'react';
// import {radius} from '../other/constants'; import $ from 'jquery'; import
// Textarea from "react-textarea-autosize";
import {qPadding} from '../other/constants'

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: this.props.defaultText,
      isHovered: 'false',
      selected: 'false'
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({inputValue: event.target.value});
    this.forceUpdate();
  }
  handleHover = () => {
    this.setState(prevState => ({
      isHovered: !prevState.isHovered
    }));
  }
  handleClick = () => {
    this.setState(prevState => ({
      isHovered: !prevState.selected
    }));
  }
  handleResize = () => {}
  render() {
    var inputHover = this.state.isHovered
      ? 'inputNotHovered'
      : 'inputHovered';
    var textCenter = this.props.type === 'title'
      ? 'title'
      : '';
    return (
      <div style={styles.container}>
        <textarea
          wrap='hard'
          rows='1'
          className={[inputHover, textCenter].join(' ')}
          style={this.props.type === 'question'
          ? styles.question
          : styles.answer}
          type="text"
          placeholder={this.props.defaultText}
          onMouseEnter={this.handleHover}
          onMouseLeave={this.handleHover}
          onClick={this.handleClick}
          onChange={this.handleChange}></textarea>
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

export default Input;