import React, { Component } from 'react';
//import logo from './logo.svg';
import ClickableButton from '../components/clickablebutton';
import UploadFile from '../components/uploadfile';
import * as $ from 'jquery';
class Grade extends Component {
  constructor(props){
    super(props);
    this.state = {
      response: '',
    };
  }
  handleGrade = () => {
    this.callApi()
    .then(res => this.setState({ response: res.express }))
    .catch(err => console.log(err));
  };
  callApi = async () => {
    $('.sk-folding-cube').show();
    $('.gradeData').hide();
    const response = await fetch('/api/hello');
    const body = await response.json();
    
    if (response.status !== 200) throw Error(body.message);
    else {
      $('.sk-folding-cube').hide();
      $('.gradeData').show();
    }
    return body;
  };
  render() {
    return (
        <div>
            this is the grade page
            <ClickableButton update={this.handleGrade} value='Grade Exam'/>
            <div className={'gradeData'}>{this.state.response}</div>
            <div className="sk-folding-cube">
              <div className="sk-cube1 sk-cube"></div>
              <div className="sk-cube2 sk-cube"></div>
              <div className="sk-cube4 sk-cube"></div>
              <div className="sk-cube3 sk-cube"></div>
            </div>
            <UploadFile/>
        </div>
    );
  }
}

export default Grade;
