import React, {Component} from 'react';

class ImageThumb extends Component {
  constructor(props){
    super(props);
    this.state
  }
  render() {
    //make condition on this.props.image to get loading working properly
    const image = (this.props.image) ? 
      <div style={styles.container}>
        <img 
          id='base64image'
          src={'data:image/png;base64, ' + String(this.props.image)} 
          style={styles.img}
          alt={''}/>
        <i onClick={() => {this.props.delete(this.props.index)}} className={['hover-trash', 'fa', 'fa-trash'].join(' ')} style={styles.trash}></i>
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
    width: 'auto',
    maxWidth: '100%',
    height: '100%',
    justifySelf: 'center',
    alignSelf: 'center'
    // maxHeight: '100%'
  },
  container: {
    height: '100%',
    width: '100%',
    display: 'flex'
  },
  trash: {
    alignSelf: 'end',
    justifySelf: 'start'
  }
}
export default ImageThumb;