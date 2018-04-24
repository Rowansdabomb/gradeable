import React, { Component } from 'react';
import HeaderRoute from '../components/headerroute';
import axios from 'axios';

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: 0,
      gradedImages: []
    };
  }
  getGradedImageData = (imageId) => {
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
  handleImageSlide = (right) => {
    let nextImage = this.state.selectedImage;
    if(right){
       nextImage++;
      if(nextImage >= this.state.gradedImages.length){
        nextImage = 0;
      }
    }else{
      nextImage--;
      if(nextImage < 0){
        nextImage = this.state.gradedImages.length - 1;
      }
    }
    this.setState({
      selectedImage: nextImage
    });
  }
  componentDidMount(){
    for(let i = 0; i < this.props.data.length; i++){
      this.getGradedImageData(this.props.data[i].imageId);
    }
  } 
  render(){
    return(
      <div>
        <HeaderRoute user={this.props.user}/>
        <div>
          <h1>{this.props.data[0].testTitle}</h1>
          <h2>{this.props.data[0].studentName}</h2>
          <div className={'row'}>
            <div className={'col-md-8'}>
              <div className={'row'} style={styles.imageContainer}>
                <img 
                id='base64image'
                src={'data:image/png;base64, ' + String(this.state.gradedImages[this.state.selectedImage])} 
                style={styles.img}
                alt={''}/>
              </div>
              <div className={'row'}>
                <div className={['slideLeft', 'button', 'col-2', 'offset-3'].join(' ')} onClick={() => this.handleImageSlide(false)}>
                  <i className="fa fa-angle-double-left" style={styles.iconSize}></i>
                </div>
                <div className={['slideRight', 'button', 'col-2', 'offset-1'].join(' ')} onClick={() => this.handleImageSlide(true)}>
                  <i className="fa fa-angle-double-right" style={styles.iconSize}></i>
                </div>
              </div>
            </div>
            {/* <ul>
              <li><h2>page number: {this.props.data[this.state.selectedImage].pageNumber}</h2></li>
              <li><h2>grade: {this.props.data[this.state.selectedImage].grade}</h2></li>
            </ul> */}

          </div>
        </div>
      </div>
    );
  }
}
const styles = {
  imageContainer: {
    height: '60rem',
  },
  img: {
    margin: 'auto',
    width: 'auto',
    height: '100%',
    justifySelf: 'center',
    alignSelf: 'center'
  },
  iconSize: {
    fontSize: '2rem'
  }
}
export default Student;
