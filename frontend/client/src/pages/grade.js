import React, { Component } from 'react';
//import logo from './logo.svg';
import ClickableButton from '../components/clickablebutton';
import UploadFile from '../components/uploadfile';
import HeaderRoute from '../components/headerroute';
import * as $ from 'jquery';
import axios from 'axios';
class Grade extends Component {
  constructor(props){
    super(props);
    this.state = {
      response: '',
      image: ''
    };
  }
  handleGrade = () => {
    this.callApi()
    .then(res => this.setState({ response: res.express }))
    .catch(err => console.log(err));
  };
  callApi = async () => {
    // $('.sk-folding-cube').show();
    $('.gradeData').hide();
    const response = await fetch('/api/hello');
    const body = await response.json();
    
    if (response.status !== 200) throw Error(body.message);
    else {
      // $('.sk-folding-cube').hide();
      $('.gradeData').show();
    }

    return body;
  };

  getImageData = () => {
    return axios.get('/api/imagetest', {
        responseType: 'arraybuffer'
      })
      .then((result) => {
        let binData = new Buffer(result.data, 'binary').toString('base64');
        // console.log(binData);
        this.setState({
          image: binData
        });
      });
  }
  processImage = () => {
    this.getImageData();
    // if(promise.PromiseStatus === 'resolved'){
    //   console.log(promise.PromiseValue);
    // }else{
    //   console.log('promise.PromiseStatus ' + promise.PromiseStatus);
    // }

  }
  render() {
    return (
        <div>
            <HeaderRoute user={this.props.user} />
            <ClickableButton className={'button'} update={this.handleGrade} value='Grade Exam'/>
            <div className={'gradeData'}>{this.state.response}</div>
            <div className="sk-folding-cube">
              <div className="sk-cube1 sk-cube"></div>
              <div className="sk-cube2 sk-cube"></div>
              <div className="sk-cube4 sk-cube"></div>
              <div className="sk-cube3 sk-cube"></div>
            </div>
            <UploadFile/>

            <div className={'button'} onClick={this.processImage} >Get Image</div>
            <img  id='base64image'
                  src={'data:image/png;base64, ' + String(this.state.image)} alt='wpicon'/>

        </div>
    );
  }
}

export default Grade;
