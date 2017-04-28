import React, { Component } from 'react';
import { Link } from 'react-router';
import '../css/spectre.min.css';
import '../layout.css';
import './auth.css';


class Auth extends Component {
    render() {
        return (
            <div className="container register-container">
                <div className="columns">
                    <div className="column col-1"></div>
                    <div className="column col-10 text-center">
                        <h3>Step Challenge Sign-In</h3>
                        <img className="logo" src={require('./step_logo.jpg')}/>
                        <img className="logo" src={require('./riverbend.png')}/>
                    </div>
                    <div className="column col-1"></div>
                </div>
                <div className="columns">
                    <div className="column col-1"></div>
                    <div className="column col-10 register">
                        <div className="content text-center">
                            <Link to="signin"><button className="btn btn-lg btn-primary">Sign In</button></Link>
                        </div>
                    </div>
                    <div className="column col-1"></div>
                </div>
            </div>
        );
    }
}


export default Auth;
