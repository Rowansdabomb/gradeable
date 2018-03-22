import React, { Component } from 'react';
//import logo from './logo.svg';
import Loader from '../components/loader';
import ClickableButton from '../components/clickablebutton';
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
      imageIds: []
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
  delete = (index) => {
    axios.get('/api/deleteTempImage', {
      params: {
        file_id: this.state.imageIds[index]
      }
    })
    .then((result)=>{
      console.log(result);
    });
    let tempImages = this.state.images.slice(0, index).concat(this.state.images.slice(index + 1, this.state.images.length));
    let tempImageIds = this.state.imageIds.slice(0, index).concat(this.state.imageIds.slice(index + 1, this.state.imageIds.length));
    console.log(this.state.imageIds);
    console.log(tempImageIds);
    this.setState({
      images: tempImages,
      imageIds:tempImageIds
    });
  }

  getImageData = (index, imageId) => {
    axios.get('/api/imageTempThumb', {
      responseType: 'arraybuffer',
      params: {
        imageId: imageId
      }
    })
    .then((result) => {
      let binData = new Buffer(result.data, 'binary').toString('base64');
      this.setState({
        images: this.state.images.concat(binData)
      });
    });
  } 
  preGetImageData = () => {
    console.log('pregetimagedata');
    axios.get('api/imageTempId').then((result)=> {
      if(this.state.imageIds.length !== result.data.length){
        let tempImageIds = [];
        for(let i = 0; i < result.data.length; i++){
          this.getImageData(i, result.data.imageIds[i].imageId);
          tempImageIds.push(result.data.imageIds[i]._id);
        }
        // console.log(tempImageIds);
        this.setState({
          imageIds: tempImageIds,
          images: []
        }, ()=>{
          console.log(this.state.imageIds);
        });
      }
    });
  }
  componentDidMount(){
    this.preGetImageData();
  }
  render() {
    return (
        <div className={'row'}>
          <HeaderRoute user={this.props.user} />
          <div className={['col-md-6', 'offset-3'].join(' ')}>
            <div className={'gradeData'}>{this.state.response}</div>
            <UploadFile update={this.preGetImageData}/>
            <h1>Ungraded Exams</h1>
            <div className={'row'} style={styles.imgContainer}>
              {this.state.imageIds.map((imageId, index) =>
                <div className={['col-md-2', 'col-sm-4'].join(' ')} style={styles.colHeight} key={index}>
                  <ImageThumb delete={this.delete} image={this.state.images[index]} imageId={imageId} index={index} />
                </div>
              )}
            </div>
            <button className={'button'} onClick={this.handleGrade}>Grade Exams</button>
          </div>
        </div>
    );
  }
}
const styles={
  imgContainer: {
    marginTop: '20px',
  },
  colHeight: {
    maxHeight: '60px',
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0',
  },
}
export default Grade;
