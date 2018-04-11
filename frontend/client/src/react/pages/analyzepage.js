import React, { Component } from 'react';
import HeaderRoute from '../components/headerroute';
import ImageThumb from '../components/imageThumb';
import Loader from '../components/loader';
import axios from 'axios';
import { Link } from 'react-router-dom';

class AnalyzePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      response: '',
      loading: false,
      gradedImages: [],
      gradedImageData: [],
      testTitles: [],
      imgHover: false,
    };
  }
  deleteGraded = (index) => {
    axios.get('/api/deleteGradedImage', {
      params: {
        file_id: this.state.gradedImageData[index].imageId
      }
    })
    .then((result)=>{
    });
    let tempImages = this.state.gradedImages.slice(0, index).concat(this.state.gradedImages.slice(index + 1, this.state.gradedImages.length));
    let tempImageData = this.state.gradedImageData.slice(0, index).concat(this.state.gradedImageData.slice(index + 1, this.state.gradedImageData.length));
    this.setState({
      gradedImages: tempImages,
      gradedImageData: tempImageData
    });
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
  preGetGradedImageData = () => {
    axios.get('api/imageGradedId').then((result)=> {
      console.log(result.data);
      if(this.state.gradedImageData.length !== result.data.length){
        let tempData = [];
        let tempTestTitles = [];
        for(let i = 0; i < result.data.length; i++){
          this.getGradedImageData(i, result.data.imageIds[i].imageId);
          tempData.push(result.data.imageIds[i]);
          if(tempTestTitles.indexOf(result.data.imageIds[i].testTitle) == -1){
            tempTestTitles.push(result.data.imageIds[i].testTitle);
          }
        }
        this.setState({
          gradedImages: [],
          gradedImageData: tempData,
          testTitles: tempTestTitles
        });
      }
    });
  }
  componentDidMount(){
    // this.preGetGradedImageData()
  }
    render() {
      return( 
        <div>
          <HeaderRoute user={this.props.user}/>
          <div className={'row'}>
            <div className={['col-md-6', 'offset-3'].join(' ')}>
              <div className={['row', 'fullWidth'].join(' ')}>
                <div className={'col-md-4'}>
                  <h2>Test</h2>
                </div>
                <div className={'col-md-4'}>
                  <h2>Median</h2>
                </div>
                <div className={'col-md-4'}>
                  <h2>Mean</h2>
                </div>
              </div>
              
              {this.props.testTitles.map((test, index) =>
                <div className={'row'} key={String(test).replace(/\s/g,'')+String(index)}>
                  <div className={['col-md-4', 'col-sm-4'].join(' ')} key={index}>
                    {test}
                  </div>
                  <div className={['col-md-4'].join(' ')}>
                      <Link className={ ['button'].join(' ') } key={ test } to={ '/test/analyze/' + String(test).replace(/\s/g,'') }>Analyze</Link>
                  </div>
                </div>
              )}
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
export default AnalyzePage;