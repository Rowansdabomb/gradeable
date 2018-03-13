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
      <div style={styles.pageBottom}>
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
      </div>
    );
  }

}

const styles = {
  qrcode: {
    boxSizing: 'bounding-box',
    padding: '.15cm',
    border: '.05cm solid black',
    display: 'inline-block',
  },
  pageBottom: {
    alignSelf: 'center',
    padding: 'inherit',
    position: 'absolute',
    bottom: '0',
  }
}
export default QR;