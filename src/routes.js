import React from 'react'
import { Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import ViewCourseReviewForm from './components/ViewCourseReviewForm'
import LogoutForm from './components/LogoutForm'
import RegistrationForm from './components/RegistrationForm'
import UserDetail from './containers/UserDetailView'
import AddCourseReviewForm from './components/AddCourseReviewForm'
import AddCourseHistoryForm from './components/AddCourseHistoryForm'
import AvailableCoursesForm from './components/AvailableCoursesForm'
import CourseInfoForm from './components/CourseInfoForm'
import Transcript from './containers/Transcript'

const BaseRouter = () => (
    <div>
        <Route exact path='/viewCourseReviews/' component={ViewCourseReviewForm} />
        <Route exact path='/addCourseReview/' component={AddCourseReviewForm} />
        <Route exact path='/availableCourses/' component={AvailableCoursesForm} />
        <Route exact path='/login/' component={LoginForm} />
        <Route exact path='/AddCourseHistory/' component={AddCourseHistoryForm} />
        <Route exact path='/CourseInfoForm/' component={CourseInfoForm} />
        <Route exact path='/logout/' component={LogoutForm} />
        <Route exact path='/register/' component={RegistrationForm} />
        <Route exact path='/transcript/' component={Transcript} />   
        <Route exact path='/user/:eMail/' component={UserDetail} />
    </div>
)

export default BaseRouter