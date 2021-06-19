import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';

class LoginForm extends React.Component {
    state = {
        date: new Date()
    }
    handleFormSubmit = (event) => {
        event.preventDefault()
        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;
        var result
        console.log(email, password)
        axios.post(`http://127.0.0.1:5000/api/login/`, {
            'email': email,
            'password': password
        }).then(res => {
            sessionStorage.setItem('logged_in', true)
            sessionStorage.setItem('email', email)
            console.log('here after saving')
            window.location.replace("/")
        }).catch(err => {
            alert("incorrect info")
        })


        //window.location.reload()
        //event.preventDefault()
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        Name:
                        <input type="text" name='email' />
                    </label>
                    <br />
                    <label>
                        password:
                        <input type="password" name='password' />
                    </label>
                    <input type="submit" value="Login" />
                </form>

            </div >
        );
    }
};

export default withRouter(LoginForm)