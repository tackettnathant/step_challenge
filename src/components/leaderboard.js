import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import StepChallenge from '../stepchallenge';
import Navbar from './navbar';
import Header from './header';
import {Table} from 'reactable';
import '../css/spectre.min.css';
import '../layout.css';
import './leaderboard.css';


class Leaderboard extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            settings:{
                stepsPerPack:60000,
                totalPacks:350
            },
            leaders:[],
            userDetails:{}
        }
    }
	componentDidMount(){
        const settingsRef=firebase.database().ref().child('settings');
        settingsRef.on('value',snap=>{
            if (snap.val()) {
                this.setState({
                    settings: snap.val()
                })
            }
        });

        const userRef=firebase.database().ref().child('users');
        userRef.on("value",function(snap) {
            const obj = snap.val();

            const users = Object.keys(obj).map(function(key){
                return obj[key];
            });


            const userDetails = users.reduce(function(all,user){
                all[user.email]=user;
                return all;
            },{});

            this.setState({
                userDetails:userDetails
            })
            const stepRef=firebase.database().ref().child('steps');
            stepRef.on("value",function(snap){
                const obj = snap.val();
                if (!obj){
                    this.setState({
                        leaders:[]
                    });
                    return;
                }
                const steps = Object.keys(obj).map(function(key){
                    return obj[key];
                })

                const totalSteps = steps.reduce(function(all,val){
                    if (!all.hasOwnProperty(val.email)){
                        all[val.email]=0;
                    }
                    all[val.email]+=parseInt(val.steps);
                    return all;
                },{});


                let leaders = Object.keys(totalSteps).map(function(key){
                    return {email:key,
                        formattedSteps:totalSteps[key].toLocaleString(),
                        steps:totalSteps[key],
                        name:userDetails[key]?userDetails[key].name:key,
                        location:userDetails[key]?userDetails[key].location:"",
                        packs:parseInt(totalSteps[key]/this.state.settings.stepsPerPack)
                    };
                }.bind(this))

                leaders.sort(function(a,b){
                    return a.steps - b.steps;
                })
                leaders.reverse();

                for (let i=0;i<leaders.length;i++){
                    leaders[i].rank=(i+1);
                }
                this.setState({
                    leaders:leaders
                });

            }.bind(this));
        }.bind(this));



    }
	render() {
        return (
            <div className="container">
                <Header/>
                <Navbar active={"leaderboard"}/>
                <div className="columns">
                    <div className="column col-12 text-center" >
                    <h4>Leader Board</h4>
                    </div>
                </div>
                <div className="columns">
                <div className="column col-12 text-center" >
                    <Table className="table table-striped" data={this.state.leaders}
                           columns={[
                               {key:"rank",label:"#"},
                               {key:"name",label:"Name"},
                               {key:"location",label:"Location"},
                               {key:"formattedSteps",label:"Steps"},
                               {key:"packs",label:"Packs"}
                               ]}

                           sortable={[
                                    {
                                        column: 'name',
                                        sortFunction: function(a, b){
                                            // Sort by last name
                                            var nameA = a.split(' ');
                                            var nameB = b.split(' ');

                                            return nameA[1].localeCompare(nameB[1]);
                                        }
                                    },
                                    'location',
                                    'steps',
                                    'rank'
                                ]}
                           defaultSort={{column: 'rank', direction: 'asc'}}
                           filterable={['name','location']}
                           filterPlaceholder="Search Leaders"
                        />

                </div>
            </div>

            </div>
        );
    }
}


export default Leaderboard;
