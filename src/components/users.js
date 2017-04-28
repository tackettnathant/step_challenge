import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import StepChallenge from '../stepchallenge';
import AdminNavbar from './adminnavbar';
import {Table} from 'reactable';
import '../css/spectre.min.css';
import '../layout.css';
import './users.css';

class Users extends Component {
    constructor(props) {
        super(props);
        if (firebase.apps.length === 0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            users:[],
            message:""
        }
    }

    updatePacks(e){
        const settings = Object.assign({},this.state.settings,{totalPacks:e.target.value});
        this.setState({
            settings:settings
        })
    }
    updateSteps(e){
        const settings = Object.assign({},this.state.settings,{stepsPerPack:e.target.value});
        this.setState({
            settings:settings
        })
    }

    componentDidMount(){
        const userRef=firebase.database().ref().child('users');
        userRef.on("value",function(snap){
            const obj = snap.val();
            if (!obj){
                this.setState({
                    users:[]
                });

                return;
            }

            const users = Object.keys(obj).map(function(key){
                let user=obj[key];
                user.hasStepTracker=user.hasStepTracker?"Y":"N";
                return user;
            })

            this.setState({
                users:users
            })
        }.bind(this));

    }
    render(){
        return (
            <div className="container">
                <div className="columns">
                    <div className="column col-12 text-center headerRow" >
                        <h3>Rock Valley Step Challenge</h3>
                    </div>
                </div>
                <AdminNavbar active={"users"}/>
                <div className="columns">
                    <div className="column col-12" >
                        <Table className="table table-striped" data={this.state.users}
                            columns={[
                               {key:"name",label:"Name"},
                               {key:"location",label:"Location"},
                               {key:"email",label:"Email"},
                               {key:"hasStepTracker",label:"Tracker?"}
                               ]}

                               sortable={[
                                    {
                                        column: 'name',
                                        sortFunction: function(a, b){
                                            // Sort by last name
                                            var cmpNameA;
                                            var nameA;
                                            if (a.indexOf(" ")<0){
                                                cmpNameA=a;
                                            } else {
                                                nameA = a.split(' ');
                                                cmpNameA=nameA[1];
                                            }
                                             var nameB;
                                             var cmpNameB;
                                            if (b.indexOf(" ")<0){
                                                cmpNameB=b;
                                            } else {
                                                nameB = b.split(' ');
                                                cmpNameB=nameB[1];
                                            }

                                            if (!cmpNameA){
                                                cmpNameA=" ";
                                            }
                                            if (!cmpNameB){
                                                cmpNameB=" ";
                                            }
                                            return cmpNameA.localeCompare(cmpNameB);
                                        }
                                    },
                                    'location',
                                    'email',
                                    'hasStepTracker'
                                ]}
                               defaultSort={{column: 'name', direction: 'asc'}}
                               filterable={['name','location','email','hasStepTracker']}
                               filterPlaceholder="Search Users"
                            />
                    </div>
                </div>
            </div>
        )
    }
}


export default Users;