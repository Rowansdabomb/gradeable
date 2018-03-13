import React, { Component } from 'react';
//import logo from './logo.svg';
import Loader from '../components/loader';
import ClickableButton from '../components/clickablebutton';
import UploadFile from '../components/uploadfile';
import HeaderRoute from '../components/headerroute';
import axios from 'axios';
class Grade extends Component {
  constructor(props){
    super(props);
    this.state = {
      response: '',
      loading: false,
      image: []
    };
  }
  handleGrade = () => {
    this.setState({
      loading: true
    });
    axios.post('/api/gradetests')
    .then((result) => {
      console.log(result);
      if(result.status !== 200){
        alert('Error from server while grading test');
      }
      this.setState({
        loading: false,
        response: result.data.message
      });
      
    });
  };

  getImageData = () => {
    return axios.get('/api/imagetest', {
        responseType: 'arraybuffer'
      })
      .then((result) => {
        let binData = new Buffer(result.data, 'binary').toString('base64');
        this.setState({
          image: binData
        });
      });
  }
  processImage = () => {
    this.getImageData();
  }
  render() {
    return (
        <div className={'row'}>
          <HeaderRoute user={this.props.user} />
          <div className={['col-md-6', 'offset-3'].join(' ')}>
            <ClickableButton className={'button'} update={this.handleGrade} value='Grade Exam'/>
            <div className={'gradeData'}>{this.state.response}</div>
            <UploadFile update={this.processImage}/>
            {this.state.loading && <Loader/>}
          </div>
          <div style={styles.imgContainer}>
            <img  id='base64image'
                src={'data:image/png;base64, ' + String(this.state.image)} 
                style={styles.img}
                alt={''}/>
          </div>
        </div>
    );
  }
}
const styles={
  img: {
    width: 'auto',
    maxWidth: '600px',
    height: 'auto',
    maxHeight: '600px'
  },
  imgContainer: {
    width: '600px',
    height: '600px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center'
  }
}
export default Grade;
