import React from 'react';
import AnswerKey from './answerkey';
import ClickableButton from './clickablebutton';

import {headerHeight} from '../other/constants';

const SideBar = props => {
    return (
        <div className={'noPrint'} style={styles.fixedTop}>
          <div>
            <h3>Question</h3>
            <div className={['buttons', 'spaceBetween'].join(' ')} style={styles.buttons}>
              <ClickableButton update={props.addQuestion} value='+'/>
              <ClickableButton update={props.removeQuestion} value='-'/>
            </div>
          </div>
          <AnswerKey    pageStart={props.pageStart} 
                        answerKey={props.answerKey} 
                        numberOfAnswers={props.numberOfAnswers}/>
          <ClickableButton update={props.handlePrint} value={'Print'} />
          <ClickableButton update={props.unselect} value={'Toggle Select'} />
        </div>
    );
}

const styles = {
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  fixedTop: {
    position: 'fixed',
    top: headerHeight + 20,
  }
}

export default SideBar;