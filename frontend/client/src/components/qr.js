import React from 'react';
import {QRCode} from 'react-qr-svg';

const QR = props => {
    return (
        <div style={styles.qrcode}>
              <QRCode
                    bgColor={"#FFFFFF"}
                    fgColor={"#000000"}
                    level={"Q"}
                    style={{width: 100, verticalAlign: 'top'}}
                    value={props.codevalue}
                />
        </div>
    );
}

const styles = {
    qrcode: {
      position: 'relative',
      bottom: '0',
      boxSizing: 'bounding-box',
      padding: '5px',
      border: '2px solid black',
      display: 'inline-block',
      alignSelf: 'center',
    }
  }
  export default QR;