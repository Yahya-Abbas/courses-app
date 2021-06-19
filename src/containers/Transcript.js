import React from 'react'
import axios from 'axios'
import {Table } from 'antd'

class Transcript extends React.Component {

    state = {
        aucID: 0,
        courses: []
    }

    componentDidMount() {
        // const aucID = this.props.match.aucID
        const aucID = 900171515
        this.setState({
            aucID: aucID
        })
        axios.get(`http://127.0.0.1:5000/api/view_transcript/${aucID}`)
            .then(res => {
                console.log(res.data)
                const data = res.data.map((row, index) => ({
                    key: index,
                    departmentCode: row.departmentCode,
                    oldCourseCode: row.oldCourseCode,
                    newCourseCode: row.newCourseCode,
                    name: row.name,
                    letterGrade: row.letterGrade,
                    year: row.year,
                    semester: row.semester
                  }))
                this.setState({
                    courses: data
                })
            })
    }

    render() {
        const columns = [
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
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Letter Grade',
                dataIndex: 'letterGrade',
                key: 'letterGrade',
            },
            {
                title: 'Year',
                dataIndex: 'year',
                key: 'year',
            },
            {
                title: 'Semester',
                dataIndex: 'semester',
                key: 'semester',
            }
        ];
    
        return (
          <div>
            <Table columns={columns} dataSource={this.state.courses} />
          </div>
        );
    }
}

export default Transcript