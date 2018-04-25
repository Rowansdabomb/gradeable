import React from 'react';
import SigninForm from '../components/signinform';
import {Route} from 'react-router-dom';

const SignInPage = (props) => {
	return(
		<Route render={({ history}) => (
			<div className={['fullWidth', 'row', 'justifyCenter'].join(' ')} >
				<div className={['fullWidth', 'row'].join(' ')} style={styles.signupForm}>
					<SigninForm formType={'signup'} formTitle={'Sign Up'} getUser={props.getUser} goToUrl={(URL) => { history.push(URL)}}/>
					<SigninForm formType={'login'} formTitle={'Login'} getUser={props.getUser} goToUrl={(URL) => { history.push(URL)}}/>
				</div>
			</div>
  	)} />
	);
}
const styles = {
		signupForm: {
			maxWidth: '1200px',
			maxHeight: '600px',
			margin: '50px, auto'
		},
}
export default SignInPage;

