import React, { Component } from 'react';
import axios from 'axios';
class Login extends Component {
  constructor() {
    super();
    this.state = {
      logpassword: '',
      logemail: '',
    };
  }

  onChange = (e) => {
    // Because we named the inputs to match their corresponding values in state, it's
    // super easy to update the state
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    // get our form data out of state
    const { logpassword, logemail } = this.state;
    if(logpassword.length === 0 || logemail.length === 0){
      alert("Please fill all fields");
		} 
		else{
      axios.post('/api/signup', { logpassword, logemail })
      .then((result) => {
        if(typeof(result.data) === 'object'){
          this.props.goToUrl(result.data.url);
          
        }
        else{
          if(result.data.status === 11000){
            alert('An account with that email already exists');
          }else{
            alert('unkown error');
          }
        }
      });
		} 
  }

  render() {
    const { password, email } = this.state;
    return (
      <div className={['fullWidth', 'justifyStart', 'col', 'alignCenter'].join(' ')}>
        <div className={'loginForm'}>
          <h1 className={['flex', 'justifyCenter'].join(' ')}>
            Login
          </h1>
          <form className={'col'} onSubmit={this.onSubmit} autoComplete={"on"}>
            <div>Email</div>
            <input type="text" name="logemail" value={email} onChange={this.onChange} autoComplete={'off'}/>
            <div>Password</div>
            <input type="password" name="logpassword" value={password} onChange={this.onChange} autoComplete={'off'}/>
            <button type="submit">Submit</button>
          </form>
        </div>
	    </div>
    );
  }
}

export default Login;

