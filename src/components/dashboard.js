import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import StepChallenge from '../stepchallenge';
import Navbar from './navbar';
import Pack from './pack';
import RemoveDate from './removedate';
import Header from './header';
import '../css/spectre.min.css';
import '../layout.css';
import './dashboard.css';

class Dashboard extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            steps:"",
            date:this.formatDate(),
            totalSteps:0,
            packs:[],
            settings:{
                stepsPerPack:60000,
                totalPacks:350
            },
            stepHistory:[],
            dates:this.getDates()
        }
    }

    formatDate(d){
        if (!d){
            d=new Date();
        }
        return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);

    }


    getDates(){
        var dates=[];
        for (var i=3;i<31;i++){
            var d=new Date(2017,3,i);
            dates.push(d);
        }
        return dates;
    }

    updatePacks(steps,perPack=60000){
    	if (steps==="" || steps<perPack){
    		return [];
    	}

    	const packCount = parseInt(steps/perPack);
    	const packs=[];
    	for (let i=0;i<packCount;i++){
    		packs.push(i+1);
    	}
    	return packs;
    	
    }
    updateSteps(e){
        this.setState({
            steps:e.target.value?e.target.value.replace(/[^\d,]/g,''):null
        })
    }
    updateDate(e){
        this.setState({
            date:e.target.value
        })
    }
    submitSteps(){
    	const stepRef=firebase.database().ref().child('steps');
    	stepRef.push({
    		email:StepChallenge.currentUser(),
    		steps:this.state.steps.replace(/\D/,""),
    		date:this.state.date.replace(/-/g,"")
    	},function(error){
    		if (error){
    			alert("oh snap");
    			//todo
    		} else {
    			this.setState({
    				steps:"",
    				date:this.formatDate()
    			})
    			document.getElementById("totalSteps").className+=" notify ";
				setTimeout(function(){
					document.getElementById("totalSteps").className=document.getElementById("totalSteps").className.replace(/notify/,'');
				},1000)
    		}
    	}.bind(this))
        
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
        const stepRef=firebase.database().ref().child('steps');
        stepRef.orderByChild("email").equalTo(StepChallenge.currentUser()).on("value",function(snap){
            const obj = snap.val();
            if (!obj){
                this.setState({
                    totalSteps:0
                });
                return;
            }
            const steps = Object.keys(obj).map(function(key){
                return obj[key];
            })
            
            const totalSteps = steps.reduce(function(acc,val){
            	return acc+parseInt(val.steps);
            },0);
            this.setState({
                totalSteps:totalSteps
            });
            
        }.bind(this));
    }
    
    showHistory(){
    	const stepRef=firebase.database().ref().child('steps');
    	document.getElementById("history").className+=" active ";
        stepRef.orderByChild("email").equalTo(StepChallenge.currentUser()).on("value",function(snap){
            const obj = snap.val();
            if (!obj){
                this.setState({
                    stepHistory:[]
                })
                return;
            }
            const steps = Object.keys(obj).map(function(key){
                return obj[key];
            })
            let data = steps.reduce(function(d,step){
            	if (!d.hasOwnProperty("dates")){
            		d.dates=[];
            	}
            	if (d.dates.indexOf(step.date)<0){
            		d.dates.push(step.date);
            		d[step.date]=0;
            	}
            	d[step.date]+=parseInt(step.steps);
            	return d;
            },{})
            data.dates.sort().reverse();
            const stepHistory=data.dates.reduce(function(all,date){
            	all.push({date:date.substr(4,2)+"/"+date.substr(6,2)+"/"+date.substr(0,4),steps:data[date].toLocaleString()});
            	return all;
            },[]);
            
            this.setState({
            	stepHistory:stepHistory
            })
            
        }.bind(this));
    }
    hideHistory(){
    	document.getElementById("history").className=document.getElementById("history").className.replace(/active/,"");
    }

    render() {
        
    	return (
            <div className="container">
                <Header/>
                <Navbar active={"dashboard"}/>


                <div className="columns" onClick={this.showHistory.bind(this)}>
                    <div className="column col-12 text-center total-steps" >
                        <h5>My Steps</h5>
                        <h1 className="" id="totalSteps">{this.state.totalSteps.toLocaleString()}</h1>

                    </div>
                </div>
                <div className="columns">
                    {
                        (this.state.totalSteps && this.state.totalSteps >= 60000) ?
                            <div className={"column col-12 text-center completed-packs "+(this.state.totalSteps && this.state.totalSteps>=60000?"":"hidden")}>
                                <h5>My Backpacks</h5>
                                {this.updatePacks(this.state.totalSteps, this.state.settings.stepsPerPack).map(
                                    (num)=>
                                        <Pack />
                                )}
                            </div>
                            : ""
                    }
                    {
                        (this.state.totalSteps && this.state.totalSteps >= 60000) ?
                        <div className={"column col-12 text-center "+(this.state.totalSteps && this.state.totalSteps>=60000?"":"hidden")}>
                            <img className="tinypack" src={require('./backpack-complete-yellow.jpg')}/><span className="stepref"> - {this.state.settings.stepsPerPack.toLocaleString()} steps</span>
                        </div>
                        :""
                    }

                    {
                        (!this.state.totalSteps || this.state.totalSteps<60000)?

                        <div className="column col-12 text-center">
                        <h5>Record {this.state.settings.stepsPerPack.toLocaleString()} steps to fill a backpack</h5>
                        </div>
                            :""

                    }
                </div>

                <div className="modal" id="history">
                <div className="modal-overlay"></div>
                <div className="modal-container">
                  <div className="modal-header text-center">
                    <button className="btn btn-clear float-right" onClick={this.hideHistory.bind(this)}></button>
                    <div className="modal-title"><h3>Step History</h3></div>
                  </div>
                  <div className="modal-body">
                    <div className="content">
                    <table className="table table-striped table-hover">
                    	<thead>
                    		<tr>
                    			<td>Date</td>
                    			<td>Steps</td>
                                <td>&nbsp;</td>
                    		</tr>
                    	</thead>
                    	<tbody>
                    	{
                    		this.state.stepHistory.map(function(day){
                    			return (
                    			<tr><td>{day.date}</td><td>{day.steps}</td>
                                <td><RemoveDate date={day.date}/></td>
                                </tr>
                    			)
                    		})
                    	}
                    	</tbody>
                    </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="columns">
              <div className="column col-3"></div>
              <div className="column col-6 text-center" >
                      <input className="form-input input-lg input-min" placeholder="Steps" value={this.state.steps} onChange={this.updateSteps.bind(this)}/>
                        <select className="form-input input-lg input-min" value={this.state.date} onChange={this.updateDate.bind(this)}>
                            {
                                this.state.dates.map(function(d){
                                    return (
                                        <option value={d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}>April {d.getDate()}</option>
                                    )
                                })
                            }
                        </select>
                       <button className={"btn btn-lg btn-primary "+(!this.state.steps?"disabled":"")} onClick={this.submitSteps.bind(this)}>Save Steps</button>
              </div>
              <div className="column col-3"></div>
          </div>
                <div className="columns">
                    <div className="column col-12 text-center" >
                        <Link onClick={StepChallenge.logout} className="logout">Logout</Link>
                    </div>
                </div>
                </div>

        );
    }
}


export default Dashboard;
