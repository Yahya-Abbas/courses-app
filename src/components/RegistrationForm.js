import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


class RegistrationForm extends React.Component {

    state = {
        startDate: new Date()
    }
    handleFormSubmit = (event) => {
        event.preventDefault()
        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;
        const username = event.target.elements.username.value;
        const country = event.target.elements.country.value;
        const gender = event.target.elements.gender.value;
        let d = String(event.target.elements.birthdate.value);
        console.log(d)
        d = d.split('/')
        let birthdate = d[2] + '-' + d[1] + '-' + d[0]
        console.log(birthdate)
        console.log(email, password)
        axios.post(`http://127.0.0.1:5000/api/register/`, {
            'email': email,
            'password': password,
            'username': username,
            'country': country,
            'gender': gender,
            'birthdate': birthdate
        }).then(res => {
            sessionStorage.setItem('logged_in', true)
            sessionStorage.setItem('email', email)
            console.log('here after saving')
            window.location.replace("/")
        }).catch(err => {
            alert("incorrect info")
            // window.location.reload()
        })


        //window.location.reload()
        //event.preventDefault()
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        {'Email:  '}
                        <input type="text" name='email' />
                    </label>
                    <br />
                    <label>
                        {'Password:  '}
                        <input type="password" name='password' />
                    </label>
                    <br />
                    <label>
                        {'Username:  '}
                        <input type="text" name='username' />
                    </label>
                    <br />
                    <label>
                        {'Country:  '}
                        <input type="text" name='country' />
                    </label>
                    <br />
                    <label>
                        {'Gender:   '}
                        <input type="radio" value='m' name='gender' /> {'Male  '}
                        <input type="radio" value='f' name='gender' /> {'Female  '}
                    </label>
                    <br />
                    <label>
                        {'Birthdate:  '}
                        <DatePicker name='birthdate' selected={this.state.startDate} onChange={date => this.setState({
                            startDate: date
                        })} />
                    </label>

                    <br />
                    <input type="submit" value="Register" />
                </form>

            </div >
        );
    }
};

export default withRouter(RegistrationForm)