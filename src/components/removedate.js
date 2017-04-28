import React, { Component } from 'react';
import { Link } from 'react-router';
import StepChallenge from '../stepchallenge';
import * as firebase from 'firebase';
import './../css/spectre.min.css';
import '../layout.css';
import './removedate.css';

class RemoveDate extends Component {
    constructor(props) {
        super(props);
        if (firebase.apps.length === 0) {
            firebase.initializeApp(StepChallenge.config);
        }

    }
    removeDate(){
        //date is in mm/dd/yyyy format. convert it
        const date = this.props.date
        const fbdate = date.substr(6,4)+date.substr(0,2)+date.substr(3,2);
        const stepRef=firebase.database().ref().child('steps');
        stepRef.orderByChild("date").equalTo(fbdate).once("value",function(snap){
            const obj = snap.val();
            if (!obj){
                return;
            }
            Object.keys(obj).forEach(function(key){
                if (obj[key].email===StepChallenge.currentUser()){
                    stepRef.child(key).remove();
                }

            })

        }.bind(this));
    }
    render(){
        return(
            <div className="text-center remove-date" onClick={this.removeDate.bind(this)}>X</div>
        )
    }
}

export default RemoveDate;