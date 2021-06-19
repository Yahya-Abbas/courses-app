import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';

class AvailableCoursesForm extends React.Component {
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
                        Semester 
                        <input type="text" name="semester" list="semesters" pattern="Fall|Winter|Spring|Summer" required="1" style={{marginLeft: '10px'}}/>
                        <datalist id="semesters">
                            <option>Fall</option>
                            <option>Winter</option>
                            <option>Spring</option>
                            <option>Summer</option>
                        </datalist>
                    </label>
                    <br/><br/>
                    <input type="submit" name="submit" value="Available Courses for this Semester"/>
                </form>
        );
    }
};

export default withRouter(AvailableCoursesForm)