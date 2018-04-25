import React, { Component } from 'react';
import HeaderRoute from '../components/headerroute';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/actions';

class Home extends Component {
  deleteTest = (index) => {
    axios.delete('/api/deleteTest', 
      { params: {testId: this.props.testIds[index]}}
    );
    this.props.actions.deleteTest(index);
  }
  componentDidUpdate(){
    // axios
    //   .get('/api/testdata')
    //   .then(res => {
    //     console.log(res.data);
    //     this.props.getTests(res.data);
    //     this.props.actions.getTests(res.data);
    //   })
  }
  componentDidMount() {
    axios
      .get('/api/testdata')
      .then(res => {
        console.log(res.data);
        this.props.getTests(res.data);
        this.props.actions.getTests(res.data);
      })
  }
  render() {
    return (
      <div>
        <HeaderRoute user={ this.props.user } />
        <div className={ 'row' }>
          <div className={ ['col-md-10', 'col-12', 'offset-1'].join(' ') }>
            <div className={ ['row'].join(' ') }>
              <h1 className={ ['col-12', 'text-center'].join(' ') }>Tests!</h1>
                <div className={['row', 'fullWidth'].join(' ')}>
                { this.props
                    .testTitles
                    .map((test, index) => 
                    <div className={['col-xl-4', 'col-lg-6', 'col-12', 'testRow'].join(' ')} style={{animationDelay: `${index*.1}s`}} key={test}>
                      <div key={String(test).replace(/\s/g,'') + '_' + String(index)} className={['row', 'fullWidth', 'no-out-gutters'].join(' ')}>
                        <div className={['col-lg-5', 'col-5', 'flex', 'justifyStart'].join(' ')}>
                          <h3 style={ styles.test }key={ index }>
                            {test}
                          </h3>
                        </div>
                        <div className={['col-lg-7', 'col-7', 'flex', 'justifyEnd'].join(' ')}>
                          <h3>{this.props.testUpdatedDates[index].slice(0, 10)}</h3>
                        </div>
                      </div>
                      <div className={['row', 'no-out-gutters'].join(' ')}>
                        <div className={['col-lg-12'].join(' ')}>
                          <div style={styles.crop}>
                            <img 
                            id='base64image'
                            src={String(this.props.testThumbImages[index])} 
                            style={styles.img}
                            alt={''}/>
                          </div>
                          <div className={'gradient'}></div>
                        </div>
                      </div>
                      <div className={['row', 'no-out-gutters'].join(' ')}>
                        <div style={styles.reducePadding} className={['col-lg-4', 'col-md-12'].join(' ')}>
                          <Link className={ ['button'].join(' ') } style={styles.buttonFont} to={ '/test/' + String(test).replace(/\s/g,'') }>
                            Edit
                            <i className="fa fa-edit" style={styles.iconMargin}></i>
                          </Link>
                        </div>
                        <div style={styles.reducePadding} className={['col-lg-4', 'col-md-12'].join(' ')}>
                          <Link className={ ['button'].join(' ') } style={styles.buttonFont}  to={ '/test/' + String(test).replace(/\s/g,'') }>
                            Analyze
                            <i className="fa fa-bar-chart" style={styles.iconMargin}></i>
                          </Link>
                        </div>
                        <div style={styles.reducePadding} className={['col-lg-4', 'col-md-12'].join(' ')}>
                          <div className={ ['button'].join(' ')} style={styles.buttonFont} onClick={()=>{this.deleteTest(index)}}>
                            Delete
                            <i className="fa fa-trash" style={styles.iconMargin}></i>
                          </div>
                        </div>
                      </div>
                    </div>
                )}
              </div>
              <h3 className={ ['col-md-8', 'offset-md-2'].join(' ') }>
                <Link className={ 'button' } to={ '/test/new' }>
                  Create new test
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </div>
      );
  }
}

const styles = {
  test: {
    margin: '.8rem, 0'
  },
  fullWidth: {
    width: '100%'
  },
  img: {
    width: '100%',
    clipPath: 'polygon(0 0, 100% 0, 100% 15rem, 0 15rem)'
  },
  crop: {
    width: '100%',
    height: '15rem',
    overflow: 'hidden'
  },
  reducePadding: {
    padding: '0 .5rem'
  },
  iconMargin: {
    marginLeft: '5px'
  }
}
function mapStateToProps(state) {
  return {
    testCreatedDates: state.allTests.testCreatedDates,
    testTitles: state.allTests.testTitles,
    testIds: state.allTests.testIds,
    testUpdatedDates: state.allTests.testUpdatedDates,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);