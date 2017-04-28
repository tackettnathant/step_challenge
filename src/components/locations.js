import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import StepChallenge from '../stepchallenge';
import AdminNavbar from './adminnavbar';
import '../css/spectre.min.css';
import '../layout.css';
import './locations.css';

class Locations extends Component {
    constructor(props) {
        super(props);
        if (firebase.apps.length === 0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            locations:[],
            newLocation:"",
            message:""
        }
    }
    componentDidMount(){
        const locationRef=firebase.database().ref().child('locations');
        locationRef.orderByChild("name").on('value',function(snap){
            const obj = snap.val();
            if (!obj){
                return;
            }
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
        }.bind(this));
    }
    addLocation(){
        const locationRef=firebase.database().ref().child('locations');
        locationRef.push({name:this.state.newLocation})
        .then(function(){
                this.setState({message:"Added"})
                StepChallenge.showMessage("success");
                this.setState({
                    newLocation:""
                })
            }.bind(this))
        .catch(function(e){
                this.setState({message:"Unable to add location"})
                StepChallenge.showMessage("error");
            })

    }
    changeLocation(e){
        this.setState({newLocation:e.target.value});

    }

    render() {
        return (
            <div className="container">
                <div className="columns">
                    <div className="column col-12 text-center headerRow">
                        <h3>Rock Valley Step Challenge</h3>
                    </div>
                </div>
                <AdminNavbar active={"locations"}/>
                <div className="columns">
                    <div className="column col-12 text-center">
                        <h4>Locations</h4>
                        <table className="table table-striped table-hover">
                            <thead>
                            <tr>
                                <th>
                                    <input value={this.state.newLocation} onChange={this.changeLocation.bind(this)} placeholder="New Location"/>
                                </th>
                                <th>
                                    <button onClick={this.addLocation.bind(this)} className={"btn btn-primary "+(this.state.newLocation?"":"disabled")}>Add</button>
                                    <div className="msg" id="message">{this.state.message}</div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.locations.map(function(location){
                                    return (
                                      <tr>
                                          <td>{location.name}</td>
                                          <td>&nbsp;</td>
                                          </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Locations;
