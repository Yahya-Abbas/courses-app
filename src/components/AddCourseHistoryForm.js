import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';

class AddCourseHistoryForm extends React.Component {
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
                    <label>
                        Letter Grade
                        <input type="text" name="letter_grade" list="letter_grades" required="1" pattern="A|A-|B+|B|B-|C+|C|C-|D+|D|F|P|CR" style={{marginLeft: '10px'}}/>
                        <datalist id="letter_grades">
                            <option>A</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B</option>
                            <option>B-</option>
                            <option>C+</option>
                            <option>C</option>
                            <option>C-</option>
                            <option>D+</option>
                            <option>D</option>
                            <option>F</option>
                            <option>P</option>
                            <option>CR</option>
                        </datalist>
                    </label>
                    <br/><br/>
                    <label>
                        Year 
                        <input type="text" name="year" required="1" style={{marginLeft: '10px'}}/>
                    </label>
                    <br/><br/>
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
                    <input type="submit" name="add_course_history" value="Add To Course History"/>
                </form>
        );
    }
};

export default withRouter(AddCourseHistoryForm)