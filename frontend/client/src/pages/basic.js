import React, { Component } from 'react';
import TestUser from '../components/testuser';

class Basic extends Component {

    render() {
        const rowLength = 10;
      return( 
        <div>
                <TestUser />
            
        </div>
      );
    }
  }
  

const styles = {
  adjustHeader: {

  }
}

export default Basic;