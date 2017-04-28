import React, { Component } from 'react';
import { Link,browserHistory } from 'react-router';
import appHistory from '../apphistory';
import StepChallenge from '../stepchallenge';
import * as firebase from 'firebase';
import '../css/spectre.min.css';
import '../layout.css';
import './register.css';


class Register extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            "name":"","location":"",email:"",hasStepTracker:"",locations:[]
        }
    }

    componentDidMount(){
        const locationRef=firebase.database().ref().child('locations');
        locationRef.on('value',snap=>{
            const obj = snap.val();

            let locations = Object.keys(obj).map(function(key){
                return obj[key];
            })
            locations.sort(function(a,b){
                let nameA = a.name.toUpperCase(); // ignore upper and lowercase
                let  nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            })
            this.setState({
                locations:locations
            });
        });
    }

    updateName(e){
        this.setState({
            name:e.target.value
        })
    }
    updateEmail(e){
        this.setState({
            email:e.target.value
        })
    }
    updateLocation(e){
        this.setState({
            location:e.target.value
        })
    }
    updateStepTracker(e){
        this.setState({
            hasStepTracker:e.target.value
        })
    }
    showSubmitting(e){
        e.preventDefault();
        const userRef=firebase.database().ref().child('users');
        userRef.push({
            email:this.state.email,
            name:this.state.name,
            location:this.state.location,
            hasStepTracker:this.state.hasStepTracker==="yes",
            steps:[]
        }).then(function(){
            StepChallenge.loginUser(this.state.email)

        }.bind(this)).then(function(){
            //appHistory.push("/");
            appHistory.replace('/');
        }).catch(function(error){
            //todo
        });

    }
    validateInput(){
        return this.state.name&&this.state.email&&this.state.location&&this.state.hasStepTracker;
    }
    render() {
        return (
            <div className="container register-container">
                <div className="columns">
                    <div className="column col-1"></div>
                <div className="column col-10 text-center">
                    <h3>Step Challenge Sign-Up!</h3>
                    <img className="logo" src={require('./step_logo.jpg')}/>
                    <img className="logo" src={require('./riverbend.png')}/>
                </div>
                    <div className="column col-1"></div>
                    </div>
                <div className="columns">
                    <div className="column col-1"></div>
                <div className="column col-10 register">
                    <h5>Begins Monday, April 3 (25 day challenge)</h5>
                    This challenge will not only benefit you by being step-conscious, but it will benefit the kids within our community!
                    <form onSubmit={this.showSubmitting.bind(this)}>
                        <div className="form-group">
                            <label className="form-label">First and Last Name<span className="required">*</span></label>
                            <input className="form-input" type="text" placeholder="Name" value={this.state.name} onChange={this.updateName.bind(this)}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Clinic Location<span className="required">*</span></label>
                            <select className="form-select" value={this.state.location}  onChange={this.updateLocation.bind(this)}>
                                <option value=""></option>
                                {
                                    this.state.locations.map(
                                        function(location){
                                            return <option value={location.name} key={location.name}>{location.name}</option>;
                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email<span className="required">*</span></label>
                            <input className="form-input" type="text" placeholder="Email" value={this.state.email} onChange={this.updateEmail.bind(this)}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Do you have a step tracker (ex., Fitbit, pedometer, Jawbone, Nike Fuel Band, Garmin)?<span className="required">*</span></label>
                            <select className="form-select" value={this.state.hasStepTracker} onChange={this.updateStepTracker.bind(this)}>
                                <option value=""></option>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>


                            </select>
                        </div>
                        <div className="modal-header text-center">
                            <button className={"btn btn-primary "+(this.validateInput()?"":"disabled")}>Register</button>
                            <Link to="auth"><button className="btn">Cancel</button></Link>
                        </div>
                    </form>
                </div>
                    <div className="column col-1"></div>
            </div>

            </div>
        );
    }
}


export default Register;
