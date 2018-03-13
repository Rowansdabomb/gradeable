import React, { Component } from 'react';
import axios from 'axios';
class SigninForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      passwordConf: '',
      email: '',
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
    const { username, password, passwordConf, email } = this.state;
    if (this.props.formType === 'signup') {
      if (password.length === 0 || passwordConf.length === 0 || username.length === 0 || email.length === 0) {
        alert("Please complete the form");
      }
      else if (password === passwordConf) {
        axios.post('/api/signin', { username, password, email, type: 'signup' })
          .then((result) => {
            console.log(result.data);
            if (typeof (result.data) === 'object') {
              this.props.goToUrl(result.data.url);
              this.props.getUser(result.data.user);
            }
            else {
              if (result.data.status === 11000) {
                alert('An account with that email already exists');
              } else {
                alert('unkown error');
              }
            }
          });
      }
      else {
        alert("Passwords do not match!");
      }
    }
    else if (this.props.formType === 'login') {
      if (password.length === 0 || email.length === 0) {
        alert("Please fill all fields");
      }
      else {
        console.log(email, password);
        axios.post('/api/signin', { password, email, type: 'login' })
          .then((result) => {
            console.log(result.data);
            if (result.data.status === 401) {
              alert('No account with that email and password');
            }
            else if (typeof (result.data) === 'object') {
              this.props.goToUrl(result.data.url);
              this.props.getUser(result.data.user);
            }
            else {
              alert('unkown error');
            }
          });
      }
    }
  }

  render() {
    const { username, password, passwordConf, email } = this.state;
    var toggleShow = 'show';
    if (this.props.formType === 'login') {
      toggleShow = 'none';
    }
    return (
      <div className={['fullWidth', 'col', 'justifyStart', 'alignCenter'].join(' ')}>
        <div className={'loginForm'}>
          <h1 className={['col', 'text-center'].join(' ')}>
            {this.props.formTitle}
          </h1>
          <form className={'row'} onSubmit={this.onSubmit} autoComplete={"on"}>
            <div style={styles.field} className={[toggleShow, 'col-12'].join(' ')}>
              <h2>Username</h2>
              <input type="text" name="username" value={username} onChange={this.onChange} autoComplete={'off'} />
            </div>
            <div style={styles.field} className={['col-12'].join(' ')}>
              <h2>Email</h2>
              <input type="text" name="email" value={email} onChange={this.onChange} autoComplete={'email'} />
            </div>
            <div style={styles.field} className={['col-12'].join(' ')}>
              <h2>Password</h2>
              <input type="password" name="password" value={password} onChange={this.onChange} autoComplete={'off'} />
            </div>
            <div style={styles.field} className={[toggleShow, 'col-12'].join(' ')}>
              <h2>Confirm password</h2>
              <input type="password" name="passwordConf" value={passwordConf} onChange={this.onChange} autoComplete={'off'} />
            </div>
            <button style={styles.center} className={['offset-4', 'col-md-4', 'button'].join(' ')} type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}
const styles = {
  field: {
    display: 'block'
  },
  center: {

  }
}
export default SigninForm;

