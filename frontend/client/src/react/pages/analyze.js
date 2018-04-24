import React, { Component } from 'react';
import HeaderRoute from '../components/headerroute';
import ImageThumb from '../components/imageThumb';
import axios from 'axios';
import Table from '../components/table';
import Student from '../components/student';
import PrivateRoute from '../components/privateroute';

class Analyze extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      testTakerData: [],
      testNumbers: [],
      viewStudent: false,
      studentData: []
    };
    this.handleClick = this.handleClick.bind(this);
  }
  getTestTakers = () => {
    axios.get('api/getTestTakers', {
      params: {
        testId: this.props.testId
      }
    }).then((result)=> {
      let tempTestTakerData = this.state.testTakerData;
      let tempTestNumbers = this.state.testNumbers;
      for(let i = 0; i < result.data.length; i++){
        let index = tempTestNumbers.indexOf(result.data[i].testNumber);
        if(index >= 0){
          tempTestTakerData[index].push(result.data[i]);
        }
        else{
          tempTestNumbers.push(result.data[i].testNumber);
          tempTestTakerData.push([result.data[i]])
        }
      }
      this.setState({
        testNumbers: tempTestNumbers,
        testTakerData: tempTestTakerData
      });
    });
  }
  handleClick = (data) => {
    console.log(data);
    this.setState(prevState => ({
      viewStudent: !prevState.viewStudent,
      studentData: data
    }));
  }
  handleTableClick = () => {
    alert('handle table click');
  }
  componentDidMount(){
    this.getTestTakers();
  }
  componentDidUpdate(){
    console.log(this.state.testTakerData);
    console.log(this.state.studentData)
  }
    render() {
      return( 
        <div>
          <HeaderRoute user={this.props.user}/>
          <div className={'row'}>
            <div className={['col-md-6', 'offset-3'].join(' ')}>
                {!this.state.viewStudent && 
                <div>
                  <h1>Class List</h1>
                  {this.state.testTakerData.map((data, index) =>
                    <div className={'row'} key={index}>
                      <div className={['col-md-4', 'col-sm-4'].join(' ')} >
                        {data[0].studentName}
                      </div>
                      <div className={['col-md-4', 'col-sm-4'].join(' ')} >
                        {}
                      </div>
                      <div className={['col-md-4', 'col-sm-4', 'button'].join(' ')}
                            onClick={() => this.handleClick(data)} >
                        View
                      </div>
                    </div>
                  )}
                </div>  
                }
                {this.state.viewStudent && 
                  <div>
                    <Student data={this.state.studentData}/>
                  </div>
                }
                
              </div>
            </div>
          </div>
      );
    }
  }
  
  const styles={
    imgContainer: {
      margin: '1rem 0',
    },
    colHeight: {
      maxHeight: '20rem',
      display: 'flex',
      justifyContent: 'center',
      margin: '1rem 0',
    },
  }
export default Analyze;