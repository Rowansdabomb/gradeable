import React, { Component } from 'react';
import TestUser from '../components/testuser';
import HeaderRoute from '../components/headerroute';

class Basic extends Component {

    render() {
      return( 
        <div>
          <HeaderRoute user={this.props.user}/>
          <TestUser />
        </div>
      );
    }
  }
  
export default Basic;