import React from 'react';
import Answer from './answer';
import Input from './input';
import ClickableButton from './clickablebutton';
//import ABC from '../other/constants';
import {radius, qPadding} from '../other/constants';
//import $ from 'jquery';

class Question extends React.PureComponent {
	constructor(props){
    super(props);
    this.state = {
       isHovered: 'false',
    };
  }
  handleSave = () => {
    
  }
  addAnswer = () => {
    this.props.addAnswer(this.props.qindex);
    //this.props.updateNumberOfAnswers(this.props.qindex, this.props.inputValueAnswers.length + 1);
  }
  removeAnswer = () => {
    if(this.props.bubbleValues.length > 2){
      this.props.removeAnswer(this.props.qindex);
      //this.props.updateNumberOfAnswers(this.props.qindex, this.props.inputValueAnswers.length - 1);
    }
   }
  handleHover = () =>{
    this.setState(prevState=> ({isHovered: !prevState.isHovered}));
  }
  handleSelect = (value) => {
    if(!this.props.noSelect){
      if(this.props.selectedAnswer !== value){
        this.props.updateSelectedAnswer(this.props.qindex, value);
      }
      this.props.updateAnswerKey(this.props.qindex, value);
    }
  }
  componentDidUpate() {
    this.handleHeight();
  }
  
  render() {
    const { bubbleValues, 
            inputValueAnswers, 
            inputValueQuestion, 
            questionValues, 
            noSelect,
            selectedAnswer} = this.props;
    const showToggle = this.state.isHovered ? styles.hide: styles.show;
    const btnHover = this.state.isHovered ? 'buttons': 'buttonsHovered';
    return (
      <div className='question' onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
          <div style={styles.column}>
            <div style={styles.question}>
              <div style={styles.questionNumber}>{questionValues}.</div>
              <Input type='question' onSave={this.onSave} defaultText={inputValueQuestion[0]}/>
            </div>
            <div style={styles.row}>
              <div style={showToggle}>
                <div className={'test'}>
                  <h3>Answer</h3>
                  <div className={[btnHover, 'row', 'no-gutters'].join(' ')} style={styles.row}>
                    <div className={['col-5', 'no-gutters'].join(' ')}>
                      <ClickableButton  key={0}
                                        update={this.addAnswer.bind(this)} 
                                        value='+'/>
                    </div>
                    <div className={['col-5', 'no-gutters'].join(' ')}>
                      <ClickableButton  key={1}
                                        update={this.removeAnswer.bind(this)} 
                                        value='-'/>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div  style={styles.column}>
                <Answer callBack={this.handleSelect} 
                        noSelect={noSelect}
                        selectedAnswer={selectedAnswer} 
                        bubbleValues={bubbleValues} 
                        inputValue={inputValueAnswers}/>
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

export default Question;