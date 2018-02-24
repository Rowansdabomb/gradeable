import React, { Component } from 'react';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: "",
          };
    }
    componentDidMount() {
        fetch('<your-heroku-url-goes-here>')
        .then(results => {
            return results.json();
            data.map((msg) => {
                return(
                  <div key={msg.results}>
                    <h3 className="h3msg">{msg.message}</h3>
                    <h2 className="h2sig">-{msg.guestSignature}</h2>
                  </div>
                );
                this.setState({messages: messages});
            });
        }
    }
    render() {
        return (
            <div className="guestdataContainer">
                    <h6>Guestbook Messages</h6>
                    {this.state.messages}
            </div>
        )
    }
}

export default User;