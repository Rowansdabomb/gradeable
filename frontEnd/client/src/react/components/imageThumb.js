import React, {Component} from 'react';

class ImageThumb extends Component {
  constructor(props){
    super(props);
    this.state = {
      imgHover: false,
      testId: '',
      testNumber: '',
      pageNumber: ''
    };
  }
  handleMouseEnter = () => {
    this.setState({
      imgHover: true
    });
  }
  handleMouseLeave= () => {
    this.setState({
      imgHover: false
    });
  }
  componentDidUpdate() {
    console.log(typeof this.props.sub);
    // if(this.props.sub != nextProps.sub){
    //   this.setState({
    //     testId: this.props.sub.testId,
    //     testNumber: this.props.sub.testNumber,
    //     pageNumber: this.props.sub.pageNumber
    //   })
    // }
  }
  render() {
    //make condition on this.props.image to get loading working properly
    const show = this.state.imgHover ? 'show': 'hide';
    const image = (this.props.image) ? 
      <div style={styles.container}
          onClick={() => {this.props.delete(this.props.index)}}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}>
        <img 
          id='base64image'
          src={'data:image/png;base64, ' + String(this.props.image)} 
          style={styles.img}
          alt={''}/>
        {/* <ul>
          <li>testId: {this.state.testId}</li>
          <li>testNumber: {this.state.testNumber}</li>
          <li>pageNumber: {this.state.pageNumber}</li> 
        </ul> */}
        <i className={[show, 'hover-trash', 'fa', 'fa-trash'].join(' ')} style={styles.trash}></i>
      </div>
      :<div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>;
    return (
      <div>
        {image}
      </div>
    );
  }
}

const styles = {
  img: {
    margin: 'auto',
    width: 'auto',
    height: '100%',
    justifySelf: 'center',
    alignSelf: 'center'
  },
  container: {
    height: '100%',
    width: '100%',
    cursor: 'pointer'
  },
  trash: {
    alignSelf: 'end',
    justifySelf: 'start'
  }
}
export default ImageThumb;