import React, { Component } from 'react';
import { Link } from 'react-router';
import StepChallenge from '../stepchallenge';
import * as firebase from 'firebase';
import appHistory from '../apphistory';
import '../css/spectre.min.css';
import '../layout.css';
import './signin.css';


class Signin extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            locations:[],
            users:[],
            loading:false
        }
    }
    updateLocation(e){
        this.setState({
            location:e.target.value
        });
        if (!e.target.value){
            this.setState({
                users:[]
            })
            return;
        }
        const location = e.target.value;
        const userRef=firebase.database().ref().child('users');
        this.setState({loading:true});
        userRef.orderByChild("location").equalTo(location).on("value",function(snap){
           const obj = snap.val();
            this.setState({loading:false});
            if (!obj){
                this.setState({
                    users:[]
                });

                return;
                            }
            const users = Object.keys(obj).map(function(key){
                return obj[key];
            })

            this.setState({
               users:users
           })
        }.bind(this));
    }
    signIn(e){
        if (e.target.value){
            StepChallenge.loginUser(e.target.value);
            appHistory.push('/');
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
                            Select your location and name to sign in.
                            <div className="form-group">
                                <label className="form-label">Clinic Location</label>
                                <select className="form-select" value={this.state.location} onChange={this.updateLocation.bind(this)}>
                                    <option value=""></option>
                                    {
                                        this.state.locations.map(
                                            function(location){
                                                return <option key={location.name} value={location.name}>{location.name}</option>;
                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                {
                                    (this.state.loading?
                                            <div className="loading "></div>
                                            :
                                            <select className="form-select" onChange={this.signIn.bind(this)}>
                                                <option value=""></option>
                                                {
                                                    this.state.users.map(
                                                        function(user){
                                                            return <option key={user.email} value={user.email}>{user.name}</option>;
                                                        }
                                                    )
                                                }
                                            </select>
                                    )
                                }


                            </div>

                        </div>
                        <div className="content text-center controls">
                            Not listed? <Link to="register">Click to Register</Link>
                        </div>
                    </div>
                    <div className="column col-1"></div>
                </div>
            </div>
        );
    }
}


export default Signin;
