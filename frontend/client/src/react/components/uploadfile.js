import React, { Component } from 'react';
import axios from 'axios';

class UploadFile extends Component {
  constructor() {
    super();
    this.state = {
      description: '',
      selectedFiles: '',
      fileHistory: [],
    };
  }

  onChange = (e) => {
    const state = this.state;

    switch (e.target.name) {
      case 'selectedFiles':
        let temp = [];
        let newFiles = [];
        for(let i = 0; i < e.target.files.length; i++){
            // console.log('pushed: ' + e.target.files[i]);
            if(this.state.fileHistory.indexOf(e.target.files[i]) === -1){
                temp.push(e.target.files[i]);
                newFiles.push(e.target.files[i]);
            }
        }
        state.selectedFiles = temp;
        state.fileHistory = state.fileHistory.concat(newFiles);
       
        break;
      default:
        state[e.target.name] = e.target.value;
    }

    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { description, selectedFiles } = this.state;
    let formData = new FormData();
    console.log(selectedFiles);
    formData.append('description', description);
    for(let i = 0; i < selectedFiles.length; i++){
        formData.append('selectedFiles', selectedFiles[i]);
    }
    // console.log('form data submitted: ' + formData);
    axios.post('/api/upload', formData)
      .then((result) => {
        this.props.update();
      });
  }

  render() {
    // const { description, selectedFiles } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="file"
          name="selectedFiles"
          onChange={this.onChange}
          multiple
        />
        <button className={'button'} type="submit">Submit</button>
      </form>
    );
  }
}

export default UploadFile;
