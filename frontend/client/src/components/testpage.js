import React, {Component} from 'react';
import _ from 'lodash';
import Question from '../components/question';
import Input from '../components/input';
import QR from '../components/qr';

class TestPage extends Component {
  // constructor(props) {   super(props); }
  render() {
    const {
      pageEnd,
      pageStart,
      questionValues,
      bubbleValues,
      inputValueAnswers,
      inputValueQuestion,
      selectedAnswer
    } = this.props;
    return (
      <div>
        {_
          .range(this.props.pages.length)
          .map(i => <div key={i} className={'page'} style={styles.page}>
            <div className={'pageHeight'}>
              <div
                className={i === 0
                ? 'show'
                : 'none'}
                style={styles.center}>
                <Input justify={'center'} type={'title'} defaultText={'Test Title'}/>
              </div>
              {_.range(questionValues.slice(pageStart[i], pageEnd[i]).length).map(j => <Question
                key={j}
                index={j}
                pindex={i}
                qindex={pageStart[i] + j}
                selectedAnswer={selectedAnswer[pageStart[i] + j]}
                bubbleValues={bubbleValues[pageStart[i] + j]}
                inputValueQuestion={inputValueQuestion[i]}
                inputValueAnswers={inputValueAnswers[i]}
                pageStart={pageStart[i]}
                questionValues={questionValues[pageStart[i] + j]}
                getState={this.getState}
                noSelect={this.props.noSelect}
                updateAnswerKey={this.props.updateAnswerKey}
                updateNumberOfAnswers={this.props.updateNumberOfAnswers}
                updateSelectedAnswer={this.props.updateSelectedAnswer}
                addAnswer={this.props.addAnswer}
                removeAnswer={this.props.removeAnswer}/>)}
            </div>
            <QR
              updateQr={this.props.updateQr}
              codevalue={this
              .props
              .testId
              .concat(':' + String(i) + ':' + String(this.props.pages.length))}/>
          </div>)}
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
export default TestPage;
