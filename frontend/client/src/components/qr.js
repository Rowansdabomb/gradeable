import React, {Component} from 'react';
import {QRCode} from 'react-qr-svg';

class QR extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.updateQr === true) 
      return true;
    else 
      return false;
    }
  render() {
    return (
      <div style={styles.qrcode}>
        <QRCode
          bgColor={"#FFFFFF"}
          fgColor={"#000000"}
          level={"Q"}
          style={{
          width: 100,
          verticalAlign: 'top'
        }}
          value={this.props.codevalue}/>
      </div>
    );
  }

}

const styles = {
  qrcode: {
    position: 'relative',
    bottom: '0',
    boxSizing: 'bounding-box',
    padding: '5px',
    border: '2px solid black',
    display: 'inline-block',
    alignSelf: 'center'
  }
}
export default QR;