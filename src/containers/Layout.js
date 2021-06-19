import React from 'react'
import { PageHeader, Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
const { Header, Content } = Layout;



const CustomLayout = (props) => {
    var logged_in = sessionStorage.getItem('logged_in') || true
    const eMail = sessionStorage.getItem('email')

    console.log(logged_in)
    return (
        <Layout className="layout">
            <PageHeader title='AUC Course Catalog' ghost={true}/>
            <Header>
                {/* <div className="logo" />
                <h1 style={{color:"white", textAlign:'center'}}>AUC Course Catalog</h1>
                <hr /> */}
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Link to='/viewCourseReviews/'>
                            Find Course Reviews
                        </Link>
                    </Menu.Item>
                    { logged_in &&
                        <Menu.Item key="2">
                            <Link to='/transcript/'>
                                View Transcript
                            </Link>
                        </Menu.Item>
                    }
                    { logged_in &&
                        <Menu.Item key="3">
                            <Link to='/availableCourses/'>
                                Available Courses for Registration
                            </Link>
                        </Menu.Item>
                    }
                    { logged_in &&
                        <Menu.Item key="4">
                            <Link to='/CourseInfoForm/'>
                                Find Course Info
                            </Link>
                        </Menu.Item>
                    }
                    { logged_in &&
                        <Menu.Item key="5">
                            <Link to='/AddCourseHistory'>
                                Add to Course History
                            </Link>
                        </Menu.Item>
                    }
                    { logged_in &&
                        <Menu.Item key="6">
                            <Link to='/addCourseReview/'>
                                Add Course Review
                            </Link>
                        </Menu.Item>
                    }
                    {
                        logged_in === null ?
                            <Menu.Item key="7">
                                <Link to='/login/'>
                                    Login
                                </Link>
                            </Menu.Item>
                            :
                            <Menu.Item key="7">
                                <Link to='/logout/'>
                                    Logout
                                </Link>
                            </Menu.Item>

                    }
                    {
                        logged_in === null ?
                            <Menu.Item key="8">
                                <Link to='/register/'>
                                    Register
                                </Link>
                            </Menu.Item>
                            :
                            <Menu.Item key="8">
                                <Link to={`/user/${eMail}/`}>
                                    Profile
                                </Link>
                            </Menu.Item>
                    }

                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to='/'>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to='/'>List</Link></Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    {props.children}
                </div>
            </Content>
        </Layout>
    );
}

export default CustomLayout;