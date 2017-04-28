import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import StepChallenge from '../stepchallenge';
import AdminNavbar from './adminnavbar';
import '../css/spectre.min.css';
import '../layout.css';
import './admin.css';

class Admin extends Component {
    constructor(props) {
        super(props);
        if (firebase.apps.length === 0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            settings: {
                stepsPerPack: 60000,
                totalPacks: 350
            },
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

    saveSettings(){
        const settingsRef=firebase.database().ref().child('settings');
        settingsRef.set(this.state.settings)
            .then(function(){
                    this.setState({message:"Saved"})
                    StepChallenge.showMessage("success");
            }.bind(this))
            .catch(function(err){
                this.setState({message:"Unable to save settings"})
                StepChallenge.showMessage("error");
            }.bind(this));
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

    }
    render(){
        return (
            <div className="container">
                <div className="columns">
                    <div className="column col-12 text-center headerRow" >
                        <h3>Rock Valley Step Challenge</h3>
                    </div>
                </div>
                <AdminNavbar active={"admin"}/>
                <div className="columns">
                    <div className="column col-12" >
                        <form className="form-horizontal">
                            <div className="form-group">
                                <div className="col-4">
                                    <label className="form-label" for="input-example-1">Number of Packs</label>
                                </div>
                                <div className="col-8">
                                    <input className="form-input" type="text" id="input-example-1" value={this.state.settings.totalPacks} onChange={this.updatePacks.bind(this)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-4">
                                    <label className="form-label" for="input-example-1">Steps per Pack</label>
                                </div>
                                <div className="col-8">
                                    <input className="form-input" type="text" id="input-example-1" value={this.state.settings.stepsPerPack} onChange={this.updateSteps.bind(this)}/>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="column col-12" >
                        <div className="column col-12 text-center" >
                            <button className="btn btn-primary" onClick={this.saveSettings.bind(this)}>Save</button>
                            <div className="msg success" id="message">{this.state.message}</div>
                        </div>


                    </div>

                </div>
            </div>
        )
    }
}


export default Admin;