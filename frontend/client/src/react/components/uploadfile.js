/*jshint loopfunc:true */

import React, { Component } from 'react';
import axios from 'axios';
import PDFJS from 'pdfjs-dist';
import Loader from './loader';

class UploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfRendering: false,
      urls: [],
      description: '',
      selectedFiles: '',
      fileHistory: [],
    };
  }
  onChange = (e) => {
    const state = this.state;
    console.log(e.target.files);
    switch (e.target.name) {
      case 'selectedFiles':
        let temp = [];
        let newFiles = [];
        for(let i = 0; i < e.target.files.length; i++){
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
    const {selectedFiles} = this.state;
    console.log(selectedFiles[0]);

    let formData = new FormData();
    let submit = false;
    for(let i in selectedFiles){
      console.log(selectedFiles[i].name);
      if(selectedFiles[i].name.search('.pdf') !== -1){
        if(selectedFiles.length !== 1){
          alert('Only single pdf uploads are supported at this time');
          break;
        }
        console.log('submitting a pdf');
        var reader  = new FileReader();
        reader.readAsDataURL(selectedFiles[i]);
        reader.onload = () => {
          this.readPdf(reader.result);
        }
      }
      else{
        formData.append('selectedFiles', selectedFiles[i]);
        submit = true;
      }
    }
    if(submit){
      axios.post('/api/tempFileUpload', formData)
      .then((result) => {
        this.props.update();
      });
    }
  }
  readPdf = (url) => {
    this.setState({
      pdfRendering: true
    });
    PDFJS.disableWorker = true;
    let currpage = 1;
    let tempArray = [];
    PDFJS.getDocument(url).then((pdf) => {
      while(currpage <= pdf.numPages){
        // console.log(currpage);
        pdf.getPage(currpage).then((page) => {
          var scale = 1;
          var viewport = page.getViewport(scale);
          var canvas = document.createElement( 'canvas' );
          canvas.style.display = "block";
          var context = canvas.getContext('2d');
          context.translate(0.5, 0.5);
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          let pdfElement = document.getElementById('pdf-view')
          pdfElement.appendChild(canvas);
          page.render({canvasContext: context, viewport: viewport}).then(()=>{
            let data = canvas.toDataURL();
            tempArray.push(data);
          })

          pdfElement.removeChild(pdfElement.getElementsByTagName('canvas')[0]);
        });

        currpage++;

        if(currpage > pdf.numPages){
          console.log(tempArray);
          console.log(tempArray.length);
          let formData = new FormData();
          setTimeout(() => {
            for(let i = 0; i < tempArray.length; i++){
              // console.log(tempArray[i]);
              fetch(tempArray[i])
              .then(function(res){return res.arrayBuffer();})
              .then(function(buf){return new File([buf], 'pdf_page' + String(i) + '.png', {type: 'image/png'});})
              .then(function(tempFile){
                console.log(tempFile);
                formData.append('selectedFiles', tempFile);
              });
              
            }
            setTimeout(()=>{
              axios.post('/api/tempFileUpload', formData)
              .then((result) => {
                this.props.update();
                this.setState({
                  // urls: tempArray,
                  pdfRendering: false,
                });
              });
            }, 1000)
          }, 1000)
        }
      }
    });
  }
  render() {
    const pdfShow = this.state.pdfRendering ? styles.show : styles.none;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            style={styles.input}
            type="file"
            name="selectedFiles"
            onChange={this.onChange}
            multiple
          />
          <button className={'button'} type="submit">Upload Files</button>
        </form>
        {this.state.numPages}
        <div id={'pdf-view'} style={pdfShow}> 

        </div>
        {this.state.pdfRendering && <Loader text={'Converting PDF'} show={true}/>}
      </div>
    );
  }
}
const styles={
  input: {
    borderRadius: '5px',
    border: '3px solid white'
  },
  show: {
    width: '100%',
    height: '100%',
    zIndex: '10000',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center'
  },
  none: {
    display: 'none'
  }
}
export default UploadFile;
