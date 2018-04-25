import React from 'react';
import Header from '../components/header';
import {Route} from 'react-router-dom';


const HeaderRoute = (props) => {
	return(
		<Route render={({history}) => (
            <Header user={props.user} goToUrl={(URL) => {history.push(URL)}}/>
  	)} />
	);
}

export default HeaderRoute;

