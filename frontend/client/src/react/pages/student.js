import React, { Component } from 'react';
import HeaderRoute from '../components/headerroute';
import axios from 'axios';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render(){
    console.log(this.props);
    return(
      <div>
        <HeaderRoute user={this.props.user}/>
        <div>
          student page for {this.props.data.studentName}
        </div>
      </div>
    );
  }
}

export default Student;
