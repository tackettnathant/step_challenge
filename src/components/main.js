import React, { Component } from 'react';
import { Link } from 'react-router';
import StepChallenge from '../stepchallenge';
import * as firebase from 'firebase';
import Header from './header';
import './../css/spectre.min.css';
import '../layout.css';
import './main.css';

/*
TODO:
1. Retrieve user
2. Hide the "touch backpack" if steps>0
5. Add Link to record route

 */
class Main extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            totalSteps:0,
            packs:null,
            settings:{
                stepsPerPack:60000,
                totalPacks:350
            },
            newUser:true,
            loading:true
        }
    }
    getCssValuePrefix()
    {
        var rtrnVal = '';//default to standard syntax
        var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

        // Create a temporary DOM object for testing
        var dom = document.createElement('div');

        for (var i = 0; i < prefixes.length; i++)
        {
            // Attempt to set the style
            dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

            // Detect if the style was successfully set
            if (dom.style.background)
            {
                rtrnVal = prefixes[i];
            }
        }

        dom = null;
        return rtrnVal;
    }
    fillPack(level){
        if (document.getElementById('main_pack')) {
            var orientation = "90deg";
            var colorOne = "#FFFF00  " + level + "%";
            var colorTwo = "#E8F1F9 " + level + "%";
            document.getElementById('main_pack').style.backgroundImage = this.getCssValuePrefix() + 'linear-gradient(' + orientation + ', ' + colorOne + ', ' + colorTwo + ')';
        }
    }
    componentDidMount(){
        this.setState({
            loading:true
        });
        const settingsRef=firebase.database().ref().child('settings');
        settingsRef.on('value',snap=>{
           if (snap.val()) {
               this.setState({
                   settings: snap.val()
               })
           }
        });

        const stepRef=firebase.database().ref().child('steps');
        stepRef.on("value",function(snap){
            const obj = snap.val();
            this.setState({
                loading:false
            });
            if (!obj){
                return;
            }
            const steps = Object.keys(obj).map(function(key){
                return obj[key];
            })

            const totalSteps = steps.reduce(function(total,val){
                total+=parseInt(val.steps);
                return total;
            },0);

            this.setState({
                totalSteps:totalSteps,
                packs:parseInt(totalSteps/this.state.settings.stepsPerPack)
            })


        }.bind(this));

        const userRef=firebase.database().ref().child('steps');
        userRef.orderByChild("email").equalTo(StepChallenge.currentUser()).on("value",function(snap){
            const obj = snap.val();

            this.setState({
                newUser:obj?false:true
            })

        }.bind(this));


    }

    componentDidUpdate(){
        const pct = parseInt((this.state.packs/this.state.settings.totalPacks)*100);
        this.fillPack(pct);
    }
    render() {
        return (
            <div className="container">
                <Header/>
                <div className="columns">
                    <div className="column col-12 text-center details">
                        {
                            (this.state.loading?
                                    <div className="loading "></div>
                                    :
                                    (
                                        this.state.totalSteps>0?
                                            <h4>{this.state.packs} of {this.state.settings.totalPacks} Backpacks Filled</h4>
                                            :
                                            <h4>Record your steps to fill the backpack!</h4>
                                    )
                            )
                        }



                    </div>
                </div>
                {
                    (true?
                        <div className="columns ">
                            <div className="column col-12 text-center">
                                <span className="tiny">touch the backpack to record steps</span>
                            </div>
                        </div>
                        :"")
                }
                <div className="columns big-pack-row">
                    <div className="column col-1"></div>
                    <div className="column col-10 centered mainPack" id="main_pack">

                        <Link to="dashboard"><img className="centered img-responsive mainPack" src={require('./Backpack-Dark.png')}/></Link>
                    </div>
                    <div className="column col-1"></div>
                </div>

            </div>
        );
    }
}

export default Main;
