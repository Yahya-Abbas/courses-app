import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';

class CourseInfoForm extends React.Component {
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
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        Department Code 
                        <input type="text" name="dept_code" list="department_codes" required="1" style={{marginLeft: '10px'}}/>
                    </label>
                    <br/><br/>
                    <label>
                        Old Course Code
                        <input type="text" name="old_course_code" required="1" style={{marginLeft: '10px'}}/>
                    </label>
                    <br/><br/>
                    <label>
                        New Course Code
                        <input type="text" name="new_course_code" required="1" style={{marginLeft: '10px'}}/>
                    </label>
                    <br/><br/>
                    <input type="submit" name="submit" value="View Course Information"/>
                </form>
        );
    }
};

export default withRouter(CourseInfoForm)