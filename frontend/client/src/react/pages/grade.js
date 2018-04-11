import React, { Component } from 'react';
import Loader from '../components/loader';
import UploadFile from '../components/uploadfile';
import HeaderRoute from '../components/headerroute';
import ImageThumb from '../components/imageThumb';
import axios from 'axios';
class Grade extends Component {
  constructor(props){
    super(props);
    this.state = {
      response: '',
      loading: false,
      images: [],
      imageIds: [],
      imgHover: false,
      pendingImages: true,
    };
  }
  handleGrade = () => {
    this.setState({
      loading: true
    });
    axios.post('/api/gradetests')
    .then((result) => {
      if(result.status !== 200){
        alert('Error from server while grading test');
      }
      this.setState({
        loading: false,
        response: result.data.message
      });
    });
  };

  deleteTemp = (index) => {
    axios.get('/api/deleteTempImage', {
      params: {
        file_id: this.state.imageIds[index]
      }
    })
    .then((result)=>{
    });
    let tempImages = this.state.images.slice(0, index).concat(this.state.images.slice(index + 1, this.state.images.length));
    let tempImageIds = this.state.imageIds.slice(0, index).concat(this.state.imageIds.slice(index + 1, this.state.imageIds.length));
    this.setState({
      images: tempImages,
      imageIds:tempImageIds
    });
  }
  // getGradedImageData = (index, imageId) => {
  //   axios.get('/api/imageTempThumb', {
  //     responseType: 'arraybuffer',
  //     params: {
  //       imageId: imageId
  //     }
  //   })
  //   .then((result) => {
  //     let binData = new Buffer(result.data, 'base64');
  //     this.setState({
  //       gradedImages: this.state.gradedImages.concat(binData)
  //     });
  //   });
  // } 
  // preGetGradedImageData = () => {
  //   axios.get('api/imageGradedId').then((result)=> {
  //     if(this.state.gradedImageIds.length !== result.data.length){
  //       let temp = [];
  //       let tempData = [];
  //       for(let i = 0; i < result.data.length; i++){
  //         this.getGradedImageData(i, result.data.imageIds[i].imageId);
  //         temp.push(result.data.imageIds[i].imageId);
  //         tempData.push(result.data.imageIds[i]);
  //       }
  //       this.setState({
  //         gradedImageIds: temp,
  //         gradedImages: [],
  //         gradedImageData: tempData
  //       });
  //     }
  //   });
  // }
  getImageData = (index, imageId) => {
    axios.get('/api/imageTempThumb', {
      responseType: 'arraybuffer',
      params: {
        imageId: imageId
      }
    })
    .then((result) => {
      let binData = new Buffer(result.data, 'binary').toString('base64');
      // let binData = new Buffer(result.data, 'base64');
      console.log(binData.slice(-40));
      console.log(binData.length);
      this.setState({
        images: this.state.images.concat(binData),
        pendingImages: false
      });
    });
  } 
  preGetImageData = () => {
    // console.log('pregetimagedata');
    setTimeout(() => {
      axios.get('api/imageTempId').then((result)=> {
        // console.log(result);
        if(this.state.imageIds.length !== result.data.length){
          let tempImageIds = [];
          for(let i = 0; i < result.data.length; i++){
            this.getImageData(i, result.data.imageIds[i].imageId);
            tempImageIds.push(result.data.imageIds[i]._id);
          }
          this.setState({
            imageIds: tempImageIds,
            images: []
          });
        }
        else{
          this.setState({
            pendingImages: false
          });
        }
      });
    }, 1000);
  }
  componentDidMount(){
    this.preGetImageData();
  }
  render() {
    const pendingImages = this.state.imageIds.length > 0 ? true: false;
    const pendingGrade = this.state.response === '' ? true: false;
    return (
        <div>
          <HeaderRoute user={this.props.user} />
          <div className={'row'}>
          <div className={['col-md-6', 'offset-3'].join(' ')}>
        
            <UploadFile update={this.preGetImageData}/>
            {!this.state.pendingImages &&
              <div>
                {this.state.imageIds.length > 0  && <h1>Exams Pending Grading</h1>}
                {this.state.imageIds.length == 0  && <h1> No Exams Pending Grading!</h1>}
              </div>
            }
            {this.state.pendingImages &&
              <Loader text={'Fetching exams...'}/>
            }

            <div className={'row'} style={styles.imgContainer}>
              {this.state.imageIds.map((imageId, index) =>
                <div className={['col-md-4', 'col-sm-4'].join(' ')} style={styles.colHeight} key={index}>
                  <ImageThumb delete={this.deleteTemp} image={this.state.images[index]} imageId={imageId} index={index} />
                </div>
              )}
            </div>
            <p>You may need to refresh your browser to see new uploads</p>
            <button className={'button'} onClick={this.handleGrade}>Grade Exams</button>
            {/* <div className={'gradeData'}>{this.state.response}</div> */}
            {!pendingGrade && <div> <h2>Grading Complete!</h2> <p>Go to the Analyze page to see graded results</p></div>}
            
            {this.state.loading && <Loader text={'Grading images... This may take several minutes... Do not refresh your browser'} show={true}/>}
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
export default Grade;
