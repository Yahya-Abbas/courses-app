import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';

class LogoutForm extends React.Component {

    handleFormSubmit = (event) => {
        event.preventDefault()
        sessionStorage.removeItem('logged_in')
        sessionStorage.removeItem('email')
        window.location.replace("/")


        //window.location.reload()
        //event.preventDefault()
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <input type="submit" value="Logout" />
                </form>

            </div >
        );
    }
};

export default withRouter(LogoutForm)