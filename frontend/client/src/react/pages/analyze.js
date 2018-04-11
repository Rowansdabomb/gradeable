import React, { Component } from 'react';
import HeaderRoute from '../components/headerroute';
import ImageThumb from '../components/imageThumb';
import Loader from '../components/loader';
import axios from 'axios';
import Table from '../components/table';
import Student from './student';
import PrivateRoute from '../components/privateroute';

class Analyze extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      gradedImages: [],
      testTakerData: [],
      viewStudent: false,
      studentData: []
    };
    this.handleClick = this.handleClick.bind(this);
  }
  getGradedImageData = (index, imageId) => {
    axios.get('/api/imageTempThumb', {
      responseType: 'arraybuffer',
      params: {
        imageId: imageId
      }
    })
    .then((result) => {
      let binData = new Buffer(result.data, 'base64');
      this.setState({
        gradedImages: this.state.gradedImages.concat(binData)
      });
    });
  } 
  getTestTakers = () => {
    axios.get('api/getTestTakers', {
      params: {
        testId: this.props.testId
      }
    }).then((result)=> {
      for(let i = 0; i < result.data.length; i++){
        this.getGradedImageData(i, result.data[i].imageId);
      }
      this.setState({
        testTakerData: result.data
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
    render() {
      return( 
        <div>
          <HeaderRoute user={this.props.user}/>
          <div className={'row'}>
            <div className={['col-md-6', 'offset-3'].join(' ')}>
              <h1>Students</h1>
                {!this.state.viewStudent && 
                <div>
                  {this.state.testTakerData.map((data, index) =>
                    <div className={'row'} key={index}>
                      <div className={['col-md-4', 'col-sm-4'].join(' ')} >
                        {data.studentName}
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
                    {/* <h2>student stuff here</h2> */}
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