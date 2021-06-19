import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import {Table, Button} from 'antd'

class ViewCourseReviewForm extends React.Component {
    state = {
        departments: [],
        requested: 0,
        reviews: []
    }
    componentDidMount() {
        const requested = this.state.requested
        {!requested &&
            axios.post(`http://127.0.0.1:5000/api/viewCourseReviews/`, {
                'requested': 0
            })
                .then(res => {
                    console.log(res.data)
                    this.setState({
                        departments: res.data
                    })
                })
        }
    }
    handleFormSubmit = (event) => {
        event.preventDefault()
        const deptCode = event.target.elements.dept_code.value;
        const oldCourseCode = event.target.elements.old_course_code.value;
        const newCourseCode = event.target.elements.new_course_code.value;

        console.log(deptCode, oldCourseCode, newCourseCode)
        axios.post(`http://127.0.0.1:5000/api/viewCourseReviews/`, {
            'requested': 1,
            'dept_code': deptCode,
            'old_course_code': oldCourseCode,
            'new_course_code': newCourseCode
        }).then(res => {
            console.log(res.data)

            const data = res.data.map((row, index) => ({
                key: index,
                studentID: row.studentID,
                departmentCode: row.departmentCode,
                oldCourseCode: row.oldCourseCode,
                newCourseCode: row.newCourseCode,
                courseName: row.courseName,
                rating: row.rating,
                review: row.review,
                verified: row.verified
              }))

            this.setState({
                reviews: data,
                requested: 1
            })
            
        }).catch(err => {
            alert("incorrect info")
        })


        //window.location.reload()
        //event.preventDefault()
    }
    resetReviewsForm = () => {
        this.setState({
            requested: 0,
            reviews: []
        })
    }
    render() {
        const departments = this.state.departments

        const columns = [
            {
                title: 'Student ID',
                dataIndex: 'studentID',
                key: 'studentID'
            },
            {
                title: 'Department Code',
                dataIndex: 'departmentCode',
                key: 'departmentCode'
            }, 
            {
                title: 'Old Course Code',
                dataIndex: 'oldCourseCode',
                key: 'oldCourseCode',
            }, 
            {
                title: 'New Course Code',
                dataIndex: 'newCourseCode',
                key: 'newCourseCode',
            },
            {
                title: 'Course Name',
                dataIndex: 'courseName',
                key: 'courseName',
            },
            {
                title: 'Rating',
                dataIndex: 'rating',
                key: 'rating',
            },
            {
                title: 'Review',
                dataIndex: 'review',
                key: 'review',
            },
            {
                title: 'Verified?',
                dataIndex: 'verified',
                key: 'verified',
            }
        ];

        var hasRequested = this.state.requested ? false : true
        
        return (
                <div>
                { hasRequested && 
                    <form onSubmit={this.handleFormSubmit}>
                        <label>
                            Department Code 
                            <input type="text" name="dept_code" list="department_codes" required="1" style={{marginLeft: '10px'}}/>
                            <datalist id="department_codes">
                                {departments.map((department, index) => (
                                    <option key={index}>{department}</option>
                                ))}
                                    
                            </datalist>
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
                        <input type="submit" name="submit" value="View Course Reviews"/>
                    </form>
                }

                {!hasRequested &&
                    <div>
                        <Table columns={columns} dataSource={this.state.reviews} />
                        <Button onClick={this.resetReviewsForm}>Find Another Review</Button>
                    </div>
                }
                </div>
                
        );
    }
};

export default withRouter(ViewCourseReviewForm)